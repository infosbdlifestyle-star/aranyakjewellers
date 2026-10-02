const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkStatus() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu',
      readyTimeout: 30000,
    });
    
    console.log('\n--- PM2 STATUS ---');
    const status = await ssh.execCommand('pm2 status');
    console.log(status.stdout);

    console.log('\n--- PM2 LOGS ---');
    const logs = await ssh.execCommand('pm2 logs aranyak-backend --lines 50 --nostream');
    console.log(logs.stdout);
    if (logs.stderr) console.error(logs.stderr);

    ssh.dispose();
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

checkStatus();
