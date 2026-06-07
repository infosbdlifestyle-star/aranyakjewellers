const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function getLogs() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    const res = await ssh.execCommand('pm2 logs aranyak-backend --lines 50 --nostream');
    console.log(res.stdout);
    console.log(res.stderr);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getLogs();
