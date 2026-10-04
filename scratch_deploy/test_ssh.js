const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function test() {
  try {
    console.log('Connecting to VPS with new password...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: 'b&Doe2K46e%1',
      readyTimeout: 30000,
      keepaliveInterval: 10000,
    });
    
    console.log('✅ Connected! Running test command...');
    const result = await ssh.execCommand('whoami && uptime && pm2 list');
    console.log(result.stdout);
    if (result.stderr) console.error(result.stderr);
    
    ssh.dispose();
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
}

test();
