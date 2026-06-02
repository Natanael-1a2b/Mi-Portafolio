const fs = require('fs');
const pcDir = 'public/assets/images/Gestor de tareas/pc';
const mobDir = 'public/assets/images/Gestor de tareas/Movile';

const pcFiles = fs.readdirSync(pcDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')).sort();
pcFiles.forEach((f, i) => fs.renameSync(`${pcDir}/${f}`, `${pcDir}/${i + 1}.png`));

const mobFiles = fs.readdirSync(mobDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')).sort();
mobFiles.forEach((f, i) => fs.renameSync(`${mobDir}/${f}`, `${mobDir}/${i + 1}.jpeg`));
