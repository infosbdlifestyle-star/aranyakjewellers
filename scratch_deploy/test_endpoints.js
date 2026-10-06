const https = require('https');

https.get('https://aranyakjewellers.vercel.app/uploads/hero-banner.png', (res) => {
  console.log('GET Image Status:', res.statusCode);
});

const req = https.request('https://aranyakjewellers.vercel.app/api/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  }
}, (res) => {
  console.log('POST Upload Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});

req.write('------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="file"; filename="test.jpg"\r\nContent-Type: image/jpeg\r\n\r\nfakeimage\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--\r\n');
req.end();
