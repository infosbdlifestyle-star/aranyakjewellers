const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAndStart() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    console.log('Connected!');

    // 1. Install MongoDB on AlmaLinux 9
    console.log('\n=== Installing MongoDB (AlmaLinux/RHEL) ===');
    
    // Create MongoDB repo file
    const mongoRepo = `[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc`;
    
    let res = await ssh.execCommand(`cat > /etc/yum.repos.d/mongodb-org-7.0.repo << 'EOF'
${mongoRepo}
EOF`);
    console.log('Repo created:', res.stderr || 'OK');

    res = await ssh.execCommand('yum install -y mongodb-org 2>&1');
    console.log('MongoDB install:', res.stdout.slice(-500));

    res = await ssh.execCommand('systemctl enable mongod && systemctl start mongod 2>&1');
    console.log('MongoDB start:', res.stdout || res.stderr);

    // Wait for MongoDB to start
    await new Promise(r => setTimeout(r, 3000));

    res = await ssh.execCommand('systemctl status mongod --no-pager 2>&1');
    console.log('MongoDB status:', res.stdout.slice(0, 500));

    // 2. Generate Prisma client
    console.log('\n=== Generating Prisma Client ===');
    res = await ssh.execCommand('cd /var/www/aranyak-backend && npx prisma generate 2>&1');
    console.log(res.stdout.slice(-500));

    // 3. Open firewall port 3001
    console.log('\n=== Opening firewall port 3001 ===');
    res = await ssh.execCommand('firewall-cmd --permanent --add-port=3001/tcp 2>&1 && firewall-cmd --reload 2>&1');
    console.log(res.stdout || res.stderr || 'OK');

    // 4. Start backend with correct path
    console.log('\n=== Starting Backend ===');
    res = await ssh.execCommand('pm2 delete aranyak-backend 2>&1 || true');
    console.log('PM2 cleanup:', res.stdout || 'OK');

    // Check the correct main.js path
    res = await ssh.execCommand('find /var/www/aranyak-backend/dist -name "main.js" 2>&1');
    console.log('Main.js location:', res.stdout);
    const mainPath = res.stdout.trim().split('\n')[0];

    res = await ssh.execCommand(`cd /var/www/aranyak-backend && pm2 start ${mainPath} --name aranyak-backend 2>&1`);
    console.log('PM2 start:', res.stdout.slice(-500));

    // Wait and check
    await new Promise(r => setTimeout(r, 3000));
    
    res = await ssh.execCommand('pm2 status 2>&1');
    console.log('\n=== PM2 Status ===');
    console.log(res.stdout);

    res = await ssh.execCommand('pm2 logs aranyak-backend --lines 15 --nostream 2>&1');
    console.log('\n=== PM2 Logs ===');
    console.log(res.stdout);

    res = await ssh.execCommand('pm2 save 2>&1');
    console.log('PM2 saved:', res.stdout);

    // 5. Quick API test
    console.log('\n=== Testing API ===');
    res = await ssh.execCommand('curl -s http://localhost:3001/api 2>&1');
    console.log('API Response:', res.stdout || res.stderr);

    console.log('\n=== DEPLOYMENT COMPLETE ===');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixAndStart();
