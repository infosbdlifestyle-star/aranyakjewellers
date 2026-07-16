const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function restart() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu',
      readyTimeout: 30000,
    });
    
    console.log('Connected. Restarting PM2...');
    const result = await ssh.execCommand('cd /root/aranyak-backend && (pm2 describe aranyak-backend > /dev/null 2>&1 && pm2 restart aranyak-backend --update-env || pm2 start dist/main.js --name aranyak-backend) && pm2 save');
    
    console.log(result.stdout);
    if (result.stderr) console.error(result.stderr);
    
    console.log('✅ Restarted successfully!');
    ssh.dispose();
  } catch (error) {
    console.error('Restart failed:', error);
    process.exit(1);
  }
}

restart();
