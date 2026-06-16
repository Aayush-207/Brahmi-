const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'bramhi_lipi_final.html');
const outputPath = path.join(__dirname, 'public', 'mascot', 'guruji.png');

try {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const match = htmlContent.match(/src="data:image\/png;base64,([^"]+)"/);
  
  if (match && match[1]) {
    const base64Data = match[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, buffer);
    console.log('Successfully extracted Guruji image to:', outputPath);
  } else {
    console.error('Could not find base64 image data in bramhi_lipi_final.html');
  }
} catch (error) {
  console.error('Error extracting image:', error);
}
