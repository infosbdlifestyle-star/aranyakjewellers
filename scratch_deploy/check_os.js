const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkOS() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu',
      readyTimeout: 10000
    });
    
    console.log('Connected to VPS successfully!');
    
    const result = await ssh.execCommand('lsb_release -a || cat /etc/os-release');
    console.log('OS Info:');
    console.log(result.stdout || result.stderr);
    
    const nodeResult = await ssh.execCommand('node -v');
    console.log('Node version:', nodeResult.stdout || 'Not installed');
    
    const pm2Result = await ssh.execCommand('pm2 -v');
    console.log('PM2 version:', pm2Result.stdout || 'Not installed');
    
    const mongoResult = await ssh.execCommand('mongod --version');
    console.log('MongoDB version:', mongoResult.stdout || 'Not installed');
    
    const nginxResult = await ssh.execCommand('nginx -v');
    console.log('Nginx version:', nginxResult.stdout || nginxResult.stderr || 'Not installed');
    
    ssh.dispose();
  } catch (error) {
    console.error('Error connecting to VPS:', error.message);
  }
}

checkOS();
