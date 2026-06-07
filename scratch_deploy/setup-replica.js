const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixMongo() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: '$9T%Lk057bzu'
    });
    
    const conf = `
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

storage:
  dbPath: /var/lib/mongo

processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid
  timeZoneInfo: /usr/share/zoneinfo

net:
  port: 27017
  bindIp: 127.0.0.1

replication:
  replSetName: "rs0"
`;

    console.log('Writing mongod.conf...');
    let res = await ssh.execCommand(`echo "${conf}" > /etc/mongod.conf`);
    console.log(res.stdout || res.stderr);
    
    console.log('Restarting mongod...');
    res = await ssh.execCommand('systemctl restart mongod');
    console.log(res.stdout || res.stderr);
    
    console.log('Waiting for mongod to start...');
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('Initiating replica set...');
    res = await ssh.execCommand('mongosh --eval "rs.initiate()"');
    console.log(res.stdout || res.stderr);
    
    console.log('Restarting backend...');
    res = await ssh.execCommand('pm2 restart aranyak-backend');
    console.log(res.stdout || res.stderr);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixMongo();
