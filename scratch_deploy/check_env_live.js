const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({
    host: '117.252.16.132',
    username: 'root',
    password: 'b&Doe2K46e%1'
  });
  const res = await ssh.execCommand('pm2 env aranyak-backend | grep FRONTEND_URL');
  console.log('PM2 ENV:', res.stdout);
  
  const res2 = await ssh.execCommand('cat /root/aranyak-backend/.env | grep FRONTEND_URL');
  console.log('FILE ENV:', res2.stdout);
  ssh.dispose();
}
run();
