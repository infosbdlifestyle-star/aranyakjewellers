const https = require('https');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const payload = '--' + boundary + '\r\nContent-Disposition: form-data; name="file"; filename="small.jpg"\r\nContent-Type: image/jpeg\r\n\r\nfakeimage\r\n--' + boundary + '--\r\n';

const req = https.request('https://aranyakjewellers.vercel.app/api/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  console.log('Small POST Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});

req.write(payload);
req.end();
