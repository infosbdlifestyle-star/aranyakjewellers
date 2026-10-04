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

    // Debug MongoDB
    console.log('=== DEBUGGING MONGODB ===');
    await run('cat /var/log/mongod.log 2>&1 | tail -20');
    await run('ls -la /var/lib/mongodb/ 2>&1 || echo "dir not found"');
    await run('ls -la /tmp/mongodb-27017.sock 2>&1 || echo "no socket"');
    
    // Try to fix MongoDB data dir and permissions
    await run('mkdir -p /var/lib/mongodb /var/log/mongodb');
    await run('chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb 2>&1 || chown -R mongod:mongod /var/lib/mongodb /var/log/mongodb 2>&1');
    await run('rm -f /tmp/mongodb-27017.sock');
    
    // Check mongod config
    await run('cat /etc/mongod.conf 2>&1 | head -30');
    
    // Try starting with systemctl
    await run('systemctl stop mongod 2>&1; systemctl start mongod 2>&1; systemctl status mongod 2>&1');
    
    // If systemctl fails, try direct start
    await run('sleep 2 && mongosh --eval "db.runCommand({ping:1})" 2>&1');

    // Debug build output  
    console.log('\n=== DEBUGGING BUILD ===');
    await run('ls -la /root/aranyak-backend/');
    await run('ls -la /root/aranyak-backend/dist/ 2>&1 || echo "NO DIST DIR"');
    await run('ls -la /root/aranyak-backend/src/ 2>&1 | head -10');
    await run('cat /root/aranyak-backend/nest-cli.json 2>&1 || echo "no nest-cli.json"');
    await run('cat /root/aranyak-backend/tsconfig.build.json 2>&1 || echo "no tsconfig.build.json"');
    
    // Try rebuilding
    console.log('\n=== REBUILDING ===');
    await run('cd /root/aranyak-backend && npm run build 2>&1');
    await run('ls -la /root/aranyak-backend/dist/ 2>&1 || echo "STILL NO DIST"');

    ssh.dispose();
  } catch (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }
}

fix();
