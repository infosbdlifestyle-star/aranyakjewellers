const https = require('https');
const payload = '----WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="file"; filename="small.jpg"\r\nContent-Type: image/jpeg\r\n\r\nfakeimage\r\n----WebKitFormBoundary7MA4YWxkTrZu0gW--\r\n';
const req = https.request('https://www.aranyakjewellers.com/api/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});
req.write(payload);
req.end();
