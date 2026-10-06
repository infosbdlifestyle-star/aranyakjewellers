const https = require('https');
const crypto = require('crypto');

// Generate 5MB of random data
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const header = '--' + boundary + '\r\nContent-Disposition: form-data; name="file"; filename="large.jpg"\r\nContent-Type: image/jpeg\r\n\r\n';
const footer = '\r\n--' + boundary + '--\r\n';
const fakeData = crypto.randomBytes(5 * 1024 * 1024); // 5MB

const req = https.request('https://aranyakjewellers.vercel.app/api/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': Buffer.byteLength(header) + fakeData.length + Buffer.byteLength(footer)
  }
}, (res) => {
  console.log('5MB POST Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});

req.write(header);
req.write(fakeData);
req.write(footer);
req.end();
