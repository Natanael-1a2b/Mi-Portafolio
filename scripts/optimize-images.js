import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/assets/images');

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Omitir carpetas optimizadas
      if (entry.name !== 'optimized') {
        await processDirectory(fullPath);
      }
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const filenameWithoutExt = path.basename(entry.name, ext);
        const outputPath = path.join(dir, `${filenameWithoutExt}.webp`);
        
        // Skip if webp already exists
        if (fs.existsSync(outputPath)) {
          continue;
        }

        try {
          console.log(`Optimizing ${fullPath}...`);
          await sharp(fullPath)
            .resize({ width: 1200, withoutEnlargement: true }) // Reducir resolución máxima
            .webp({ quality: 80 }) // Convertir a WebP
            .toFile(outputPath);
          console.log(`Created: ${outputPath}`);
        } catch (err) {
          console.error(`Error optimizing ${fullPath}:`, err);
        }
      }
    }
  }
}

async function run() {
  console.log('Starting optimization for all images...');
  await processDirectory(baseDir);
  console.log('All images optimized to WebP!');
}

run();
