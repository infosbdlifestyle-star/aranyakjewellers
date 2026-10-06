const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/admin/products/page.tsx', 'utf8');
content = content.replace(/Max 6MB/g, 'Max 4MB');
content = content.replace(/alert\('Failed to upload image'\);/g, "alert('Failed to upload image: ' + (err.message || 'Unknown error. Check file size.'));");
fs.writeFileSync('frontend/src/app/admin/products/page.tsx', content);

let content2 = fs.readFileSync('frontend/src/app/admin/categories/page.tsx', 'utf8');
content2 = content2.replace(/Max 6MB/g, 'Max 4MB');
content2 = content2.replace(/alert\('Failed to upload image'\);/g, "alert('Failed to upload image: ' + (err.message || 'Unknown error. Check file size.'));");
fs.writeFileSync('frontend/src/app/admin/categories/page.tsx', content2);

let content3 = fs.readFileSync('frontend/src/app/admin/banners/page.tsx', 'utf8');
content3 = content3.replace(/Max 6MB/g, 'Max 4MB');
content3 = content3.replace(/alert\('Failed to upload image'\);/g, "alert('Failed to upload image: ' + (err.message || 'Unknown error. Check file size.'));");
fs.writeFileSync('frontend/src/app/admin/banners/page.tsx', content3);
