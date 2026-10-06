const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  await ssh.connect({
    host: '117.252.16.132',
    username: 'root',
    password: 'b&Doe2K46e%1'
  });

  await ssh.execCommand('rm -rf /root/aranyak-backend/uploads');
  await ssh.execCommand('ln -sf /root/aranyak_uploads /root/aranyak-backend/uploads');
  await ssh.execCommand('pm2 restart aranyak-backend');
  console.log("Symlink fixed and PM2 restarted.");
  ssh.dispose();
}
run();
