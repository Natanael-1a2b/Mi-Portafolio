import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = path.resolve('public/assets/images/certificaciones');
const outputDir = path.resolve('public/assets/images/certificaciones/optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(inputDir, file);
      const filenameWithoutExt = path.basename(file, ext);
      const outputPath = path.join(outputDir, `${filenameWithoutExt}.webp`);
      
      try {
        console.log(`Optimizing ${file}...`);
        await sharp(inputPath)
          .resize({ width: 1200, withoutEnlargement: true }) // Reducir resolución máxima
          .webp({ quality: 80 }) // Convertir a WebP con buena compresión
          .toFile(outputPath);
        console.log(`Done: ${filenameWithoutExt}.webp`);
        
        // Opcional: reemplazar el original o moverlo
        fs.copyFileSync(outputPath, path.join(inputDir, `${filenameWithoutExt}.webp`));
      } catch (err) {
        console.error(`Error optimizing ${file}:`, err);
      }
    }
  }
  
  // Limpiar carpeta temporal si se desea
  console.log('All images optimized!');
}

optimizeImages();
