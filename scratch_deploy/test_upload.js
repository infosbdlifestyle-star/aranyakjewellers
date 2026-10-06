const fs = require('fs');
const http = require('http');
const FormData = require('form-data');

// We need a dummy image
fs.writeFileSync('test.jpg', 'fake image content');

const form = new FormData();
form.append('file', fs.createReadStream('test.jpg'));

const req = http.request({
  hostname: '117.252.16.132',
  port: 3001,
  path: '/api/upload',
  method: 'POST',
  headers: form.getHeaders()
}, (res) => {
  console.log('STATUS:', res.statusCode);
  res.setEncoding('utf8');
  res.on('data', (chunk) => console.log('BODY:', chunk));
});

req.on('error', (e) => console.error(e));
form.pipe(req);
