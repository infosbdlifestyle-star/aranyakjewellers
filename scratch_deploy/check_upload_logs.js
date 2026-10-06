const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  await ssh.connect({
    host: '117.252.16.132',
    username: 'root',
    password: 'b&Doe2K46e%1',
    readyTimeout: 30000,
    keepaliveInterval: 10000
  });

  const res1 = await ssh.execCommand('pm2 logs aranyak-backend --lines 50 --nostream');
  console.log("=== PM2 LOGS ===");
  console.log(res1.stdout);
  if (res1.stderr) console.error(res1.stderr);

  const res2 = await ssh.execCommand('ls -la /root/aranyak-backend/uploads /root/aranyak_uploads');
  console.log("=== DIRECTORY PERMISSIONS ===");
  console.log(res2.stdout);
  if (res2.stderr) console.error(res2.stderr);

  ssh.dispose();
}
run();
