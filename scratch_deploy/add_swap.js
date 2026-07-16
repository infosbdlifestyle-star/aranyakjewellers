const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkAndAddSwap() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    console.log('Connected to VPS. Checking memory...');
    const memResult = await ssh.execCommand('free -m');
    console.log(memResult.stdout);
    
    // Check if swap exists
    const swapResult = await ssh.execCommand('swapon --show');
    if (!swapResult.stdout.trim()) {
      console.log('No swap found. Adding 2GB swap...');
      const commands = [
        'fallocate -l 2G /swapfile',
        'chmod 600 /swapfile',
        'mkswap /swapfile',
        'swapon /swapfile',
        'echo "/swapfile swap swap defaults 0 0" >> /etc/fstab'
      ];
      for (const cmd of commands) {
        console.log(`Executing: ${cmd}`);
        const res = await ssh.execCommand(cmd);
        if (res.stderr) console.error(res.stderr);
      }
      console.log('Swap added.');
    } else {
      console.log('Swap already exists:');
      console.log(swapResult.stdout);
    }
    
    ssh.dispose();
  } catch (error) {
    console.error('Error:', error.message);
    ssh.dispose();
  }
}

checkAndAddSwap();
