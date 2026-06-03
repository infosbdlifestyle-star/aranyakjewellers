const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'frontend', 'public');

const imagesToCompress = [
  { name: 'bridal-edit.png', width: 2000, quality: 80, isPng: false }, // converting to jpg internally or just optimizing png
  { name: 'md.jpg', width: 2000, quality: 80, isPng: false },
  { name: 'showroom.jpg', width: 2500, quality: 80, isPng: false }
];

async function compressImages() {
  for (const img of imagesToCompress) {
    const inputPath = path.join(publicDir, img.name);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${img.name} (not found)`);
      continue;
    }
    
    console.log(`Compressing ${img.name}...`);
    const outputPath = path.join(publicDir, `optimized-${img.name.replace('.png', '.jpg')}`);
    
    try {
      if (img.name.endsWith('.png')) {
        await sharp(inputPath)
          .resize({ width: img.width, withoutEnlargement: true })
          .png({ quality: img.quality, compressionLevel: 9 })
          .toFile(outputPath);
      } else {
        await sharp(inputPath)
          .resize({ width: img.width, withoutEnlargement: true })
          .jpeg({ quality: img.quality, progressive: true })
          .toFile(outputPath);
      }
      
      const originalSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      
      // Replace original with optimized
      fs.unlinkSync(inputPath);
      fs.renameSync(outputPath, inputPath);
      
      console.log(`✅ ${img.name}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024 / 1024).toFixed(2)}MB`);
    } catch (err) {
      console.error(`❌ Failed to compress ${img.name}:`, err.message);
    }
  }
}

compressImages();
