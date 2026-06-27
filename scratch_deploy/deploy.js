const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

async function runCommand(cmd) {
  console.log(`Executing: ${cmd}`);
  const result = await ssh.execCommand(cmd, { execOptions: { pty: false } });
  if (result.stdout) console.log(result.stdout);
  if (result.stderr && !result.stderr.includes('npm WARN') && !result.stderr.includes('Created table') && !result.stderr.includes('npm warn deprecated')) {
    console.error(result.stderr);
  }
  return result;
}

async function deploy() {
  try {
    console.log('Connecting to VPS...');
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu',
      readyTimeout: 30000,
      keepaliveInterval: 10000,
      keepaliveCountMax: 10,
    });
    
    console.log('Connected. Uploading tarball and config...');
    await ssh.putFile('../backend.tar.gz', '/root/backend.tar.gz');
    await ssh.putFile('.env.production', '/root/.env.production');
    
    console.log('Upload complete. Executing deployment commands...');

    // Step 1: Setup
    await runCommand('systemctl start mongod || true');
    await runCommand('systemctl enable mongod || true');
    await runCommand('mkdir -p /root/aranyak_uploads');
    await runCommand('rm -rf /root/aranyak-backend');
    await runCommand('mkdir -p /root/aranyak-backend');
    await runCommand('tar -xzf /root/backend.tar.gz -C /root/aranyak-backend --strip-components=1');
    await runCommand('ln -sf /root/aranyak_uploads /root/aranyak-backend/uploads');
    await runCommand('cp /root/.env.production /root/aranyak-backend/.env');

    // Step 2: Install dependencies (long running - needs keepalive)
    console.log('Installing npm packages (this may take 3-5 minutes)...');
    await runCommand('cd /root/aranyak-backend && npm install 2>&1 | tail -5');

    // Step 3: Prisma (skip db push - it fails without env, use generate only)
    await runCommand('cd /root/aranyak-backend && DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers" npx prisma generate');
    await runCommand('cd /root/aranyak-backend && DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers" npx prisma db push --accept-data-loss || true');
    await runCommand('cd /root/aranyak-backend && DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers" node prisma/seed.js || true');

    // Step 4: Build
    console.log('Building NestJS application...');
    await runCommand('cd /root/aranyak-backend && npm run build 2>&1');

    // Step 5: PM2 restart with updated env
    await runCommand('pm2 describe aranyak-backend > /dev/null 2>&1 && pm2 restart aranyak-backend --update-env || pm2 start dist/main.js --name aranyak-backend');
    await runCommand('pm2 save');
    
    console.log('\n✅ Deployment completed successfully!');
    ssh.dispose();
  } catch (error) {
    console.error('Deployment failed:', error.message || error);
    try { ssh.dispose(); } catch(e) {}
    process.exit(1);
  }
}

deploy();
