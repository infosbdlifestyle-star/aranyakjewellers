const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  await ssh.connect({
    host: '117.252.16.132',
    username: 'root',
    password: 'b&Doe2K46e%1'
  });
  
  await ssh.putFile('../backend/src/upload/upload.controller.ts', '/root/aranyak-backend/src/upload/upload.controller.ts');
  
  const res = await ssh.execCommand('cd /root/aranyak-backend && npm run build && pm2 restart aranyak-backend');
  console.log(res.stdout);
  if (res.stderr) console.error(res.stderr);
  
  ssh.dispose();
}
run();
