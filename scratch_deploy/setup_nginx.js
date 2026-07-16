const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function setupNginx() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    console.log('Connected to VPS. Uploading Nginx config...');
    await ssh.putFile('nginx.conf', '/etc/nginx/conf.d/aranyak.conf');

    const commands = [
      'systemctl restart nginx',
      'certbot --nginx -d 79695968.grabercloud.com --non-interactive --agree-tos -m admin@aranyak.com || true'
    ];
    
    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const result = await ssh.execCommand(cmd);
      if (result.stdout) console.log(result.stdout);
      if (result.stderr && !result.stderr.includes('Created symlink') && !result.stderr.includes('Warning')) console.error(result.stderr);
    }
    
    console.log('Nginx setup complete!');
    ssh.dispose();
  } catch (error) {
    console.error('Nginx setup failed:', error.message);
    ssh.dispose();
  }
}

setupNginx();
