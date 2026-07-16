const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deployProd() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu',
      readyTimeout: 60000
    });
    
    console.log('Connected. Uploading production tarball...');
    await ssh.putFile('../production.tar.gz', '/root/production.tar.gz');
    
    console.log('Upload complete. Executing deployment commands...');
    
    const envContent = `DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers"
JWT_SECRET="aranyak_secret_key_production_deploy_secure"
PORT=3001
FRONTEND_URL="https://frontend-6na2sinf0-rony-santras-projects.vercel.app"`;

    const commands = [
      'systemctl start mongod || true',
      'systemctl enable mongod || true',
      'rm -rf /root/aranyak-backend',
      'mkdir -p /root/aranyak-backend',
      'tar -xzf /root/production.tar.gz -C /root/aranyak-backend',
      'cd /root/aranyak-backend && echo "' + envContent.replace(/\n/g, '\\n') + '" > .env',
      'cd /root/aranyak-backend && npm install --omit=dev',
      'cd /root/aranyak-backend && npx prisma generate',
      'cd /root/aranyak-backend && npx prisma db push --accept-data-loss',
      'cd /root/aranyak-backend && node dist/prisma/seed.js || node prisma/seed.js || true',
      'pm2 describe aranyak-backend > /dev/null && pm2 restart aranyak-backend || pm2 start dist/main.js --name aranyak-backend',
      'pm2 save'
    ];
    
    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const result = await ssh.execCommand(cmd);
      if (result.stdout) console.log(result.stdout);
      if (result.stderr && !result.stderr.includes('npm WARN') && !result.stderr.includes('Created table') && !result.stderr.includes('Created symlink')) console.error(result.stderr);
    }
    
    console.log('Deployment completed successfully!');
    ssh.dispose();
  } catch (error) {
    console.error('Deployment failed:', error.message);
    ssh.dispose();
  }
}

deployProd();
