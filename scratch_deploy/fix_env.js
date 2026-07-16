const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixEnv() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    console.log('Connected. Uploading .env...');
    await ssh.putFile('prod.env', '/root/aranyak-backend/.env');
    
    console.log('Running prisma seed and restarting pm2...');
    const commands = [
      'cd /root/aranyak-backend && npx prisma db push --accept-data-loss',
      'cd /root/aranyak-backend && node prisma/seed.js || true',
      'cd /root/aranyak-backend && pm2 describe aranyak-backend > /dev/null && pm2 restart aranyak-backend || pm2 start dist/src/main.js --name aranyak-backend',
      'pm2 save'
    ];
    
    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const result = await ssh.execCommand(cmd);
      if (result.stdout) console.log(result.stdout);
      if (result.stderr && !result.stderr.includes('Created table')) console.error(result.stderr);
    }
    
    console.log('Fix complete!');
    ssh.dispose();
  } catch (error) {
    console.error('Fix failed:', error.message);
    ssh.dispose();
  }
}

fixEnv();
