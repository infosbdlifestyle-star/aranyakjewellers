const { NodeSSH } = require('node-ssh');
const path = require('path');

const ssh = new NodeSSH();

async function deploy() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    console.log('Connected!');

    // 1. Install Node.js, MongoDB, PM2
    console.log('Installing dependencies...');
    const setupCmds = [
      'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -',
      'apt-get install -y nodejs',
      'npm install -g pm2',
      'apt-get install -y gnupg curl',
      'curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes',
      'echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list',
      'apt-get update',
      'apt-get install -y mongodb-org',
      'systemctl enable mongod',
      'systemctl start mongod'
    ];

    for (const cmd of setupCmds) {
      console.log(`Running: ${cmd}`);
      const res = await ssh.execCommand(cmd);
      if (res.stderr && !res.stderr.includes('Warning') && !res.stderr.includes('debconf')) {
         console.log(`Stderr: ${res.stderr}`);
      }
    }

    // 2. Upload Backend
    console.log('Uploading backend files...');
    const localPath = path.resolve('..', 'backend');
    const remotePath = '/var/www/aranyak-backend';

    await ssh.execCommand(`mkdir -p ${remotePath}`);
    
    await ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 10,
      validate: function(itemPath) {
        const baseName = path.basename(itemPath);
        return baseName !== 'node_modules' && baseName !== 'dist' && baseName !== '.env' && baseName !== '.git'; // exclude huge/unnecessary folders
      }
    });

    // 3. Create .env on VPS
    console.log('Setting up .env file...');
    const envContent = `PORT=3001
DATABASE_URL="mongodb://localhost:27017/aranyak"
FRONTEND_URL="*"
JWT_SECRET="aranyak_super_secret_jwt_key_2026_xyz"
`;
    await ssh.execCommand(`echo '${envContent}' > ${remotePath}/.env`);

    // 4. Build and Start
    console.log('Building and starting backend...');
    const buildCmds = [
      `cd ${remotePath} && npm install`,
      `cd ${remotePath} && npm run build`,
      `pm2 stop aranyak-backend || true`,
      `cd ${remotePath} && pm2 start dist/main.js --name aranyak-backend`,
      `pm2 save`
    ];

    for (const cmd of buildCmds) {
      console.log(`Running: ${cmd}`);
      const res = await ssh.execCommand(cmd);
      if (res.stderr && !res.stderr.includes('npm WARN')) console.log(`Stderr: ${res.stderr}`);
    }

    console.log('Deployment complete!');
    process.exit(0);
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
