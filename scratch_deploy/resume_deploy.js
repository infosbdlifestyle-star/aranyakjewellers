const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function resumeDeploy() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    console.log('Connected. Running resume commands...');
    
    const commands = [
      'cd /root/aranyak-backend && npm install --verbose',
      'cd /root/aranyak-backend && npx prisma generate',
      'cd /root/aranyak-backend && npx prisma db push --accept-data-loss',
      'cd /root/aranyak-backend && node prisma/seed.js || true',
      'cd /root/aranyak-backend && npm run build',
      'pm2 describe aranyak-backend > /dev/null && pm2 restart aranyak-backend || pm2 start dist/main.js --name aranyak-backend',
      'pm2 save'
    ];
    
    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const result = await ssh.execCommand(cmd);
      if (result.stdout) console.log(result.stdout);
      if (result.stderr && !result.stderr.includes('npm WARN') && !result.stderr.includes('Created table')) console.error(result.stderr);
    }
    
    console.log('Deployment completed successfully!');
    ssh.dispose();
  } catch (error) {
    console.error('Deployment failed:', error.message);
    ssh.dispose();
  }
}

resumeDeploy();
