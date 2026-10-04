const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run(cmd) {
  console.log(`\n$ ${cmd}`);
  const r = await ssh.execCommand(cmd);
  if (r.stdout) console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr);
  return r;
}

async function fix() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: 'b&Doe2K46e%1',
      readyTimeout: 30000,
      keepaliveInterval: 10000,
    });
    console.log('Connected!\n');

    // Step 1: Fix MongoDB config — remove replica set and auth, fix dbPath
    console.log('=== STEP 1: Fix MongoDB Config ===');
    await run('systemctl stop mongod 2>&1');
    
    // Write a clean mongod.conf
    await run(`cat > /etc/mongod.conf << 'EOF'
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

storage:
  dbPath: /var/lib/mongo

processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid
  timeZoneInfo: /usr/share/zoneinfo

net:
  port: 27017
  bindIp: 127.0.0.1
EOF`);

    // Ensure directories exist with correct ownership
    await run('mkdir -p /var/lib/mongo /var/log/mongodb /var/run/mongodb');
    await run('chown -R mongod:mongod /var/lib/mongo /var/log/mongodb /var/run/mongodb');
    await run('rm -f /tmp/mongodb-27017.sock');

    // Start MongoDB
    await run('systemctl start mongod');
    await run('sleep 3');
    await run('systemctl status mongod');
    
    // Test MongoDB connection
    await run('mongosh --eval "db.runCommand({ping:1})" 2>&1');

    // Step 2: Fix PM2 — use correct path dist/src/main.js
    console.log('\n=== STEP 2: Start PM2 ===');
    await run('ls /root/aranyak-backend/dist/src/main.js 2>&1');
    await run('pm2 delete aranyak-backend 2>/dev/null; cd /root/aranyak-backend && pm2 start dist/src/main.js --name aranyak-backend && pm2 save');
    
    // Wait and verify
    await run('sleep 3');
    await run('pm2 list');
    await run('curl -s http://localhost:3001/api/categories 2>&1 | head -200');

    console.log('\n✅ Done!');
    ssh.dispose();
  } catch (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }
}

fix();
