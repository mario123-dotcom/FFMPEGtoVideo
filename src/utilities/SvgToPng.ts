import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import sharp from 'sharp';
import { VideoSettings,Shapes } from '../model/model';
import path from 'path';

function SvgToPng (s : Shapes , videoSettings:VideoSettings,index:number,composition:string):string{

//DICHIARAZIONE VARIABILI//
const width = (s.width && s.width < videoSettings.width) ? s.width : videoSettings.width;
const height = (s.height && s.height < videoSettings.height) ? s.height : videoSettings.height;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
const svgPath = s.path;
const fillColor = s.fill_color;
const outputDir = `./src/data/shapes`;
const outputFile = path.join(outputDir,  `shape${index}_${composition}.png`);
const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}" fill="${fillColor}" /></svg>`;

//CONTROLLA CHE LA DIRECTORY DI OUTPUT ESISTA//
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

//TRASFORMa IL FILE SVG DICHIARATO NEL PATH IN IMMAGINE .PNG//
  sharp(Buffer.from(svgContent))
    .png()
    .toFile(outputFile)
    .then(() => {
      console.log('Immagine PNG generata con successo!');
    })
    .catch((err) => {
      console.error('Errore durante la generazione del PNG:', err);
    });

  return "-i " + outputFile+' ';

}

export default SvgToPng;