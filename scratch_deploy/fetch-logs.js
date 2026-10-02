const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu',
      readyTimeout: 10000
    });
    
    console.log('Connected. Fetching logs...');
    const result = await ssh.execCommand('pm2 logs aranyak-backend --lines 50 --nostream');
    console.log(result.stdout);
    if (result.stderr) console.error(result.stderr);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
