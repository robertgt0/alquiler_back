// Script para procesar y mover las imágenes
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImages = [
  {
    name: 'boda-elegante.jpg',
    description: 'Decoración de boda con vista panorámica y mesa elegante'
  },
  {
    name: 'babyshower-oso.jpg',
    description: 'Decoración de baby shower con temática de ositos'
  },
  {
    name: 'frozen-party.jpg',
    description: 'Decoración temática de Frozen'
  },
  {
    name: 'rosegold-party.jpg',
    description: 'Decoración con arco de globos rose gold'
  }
];

async function processImages() {
  const outputDir = path.join(__dirname, '..', '..', 'alquiler_front', 'public', 'images', 'portfolio', 'decoracion');
  
  // Asegurarse que el directorio existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const image of sourceImages) {
    try {
      await sharp(path.join(__dirname, 'source', image.name))
        .resize(800, 600, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(path.join(outputDir, image.name));
      
      console.log(`Processed: ${image.name}`);
    } catch (err) {
      console.error(`Error processing ${image.name}:`, err);
    }
  }
}

processImages().catch(console.error);