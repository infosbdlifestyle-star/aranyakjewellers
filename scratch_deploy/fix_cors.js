const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const envContent = `DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers"
JWT_SECRET="aranyak_secret_key_production_deploy_secure"
PORT=3001
FRONTEND_URL="*"
`;

async function fixCors() {
  try {
    console.log('Connecting...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    console.log('Writing .env...');
    await ssh.execCommand(`echo '${envContent}' > /root/aranyak-backend/.env`);
    
    console.log('Restarting backend...');
    const result = await ssh.execCommand('pm2 restart aranyak-backend');
    console.log(result.stdout);
    
    console.log('Done.');
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fixCors();
