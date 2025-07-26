"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
function SvgToPng(s, videoSettings, index, composition) {
    //DICHIARAZIONE VARIABILI//
    const width = (s.width && s.width < videoSettings.width) ? s.width : videoSettings.width;
    const height = (s.height && s.height < videoSettings.height) ? s.height : videoSettings.height;
    const canvas = (0, canvas_1.createCanvas)(width, height);
    const ctx = canvas.getContext('2d');
    const svgPath = s.path;
    const fillColor = s.fill_color;
    const outputDir = `./src/data/shapes`;
    const outputFile = path_1.default.join(outputDir, `shape${index}_${composition}.png`);
    const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}" fill="${fillColor}" /></svg>`;
    //CONTROLLA CHE LA DIRECTORY DI OUTPUT ESISTA//
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    //TRASFORMa IL FILE SVG DICHIARATO NEL PATH IN IMMAGINE .PNG//
    (0, sharp_1.default)(Buffer.from(svgContent))
        .png()
        .toFile(outputFile)
        .then(() => {
        console.log('Immagine PNG generata con successo!');
    })
        .catch((err) => {
        console.error('Errore durante la generazione del PNG:', err);
    });
    return "-i " + outputFile + ' ';
}
exports.default = SvgToPng;
