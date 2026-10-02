const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixSeed() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    console.log('Connected. Uploading seed.js...');
    await ssh.putFile('../backend/prisma/seed.js', '/root/aranyak-backend/prisma/seed.js');
    
    console.log('Running prisma seed...');
    const commands = [
      'cd /root/aranyak-backend && node prisma/seed.js'
    ];
    
    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const result = await ssh.execCommand(cmd);
      if (result.stdout) console.log(result.stdout);
      if (result.stderr) console.error(result.stderr);
    }
    
    console.log('Fix complete!');
    ssh.dispose();
  } catch (error) {
    console.error('Fix failed:', error.message);
    ssh.dispose();
  }
}

fixSeed();
