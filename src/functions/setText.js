"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const textIntoLines_1 = __importDefault(require("../utilities/textIntoLines"));
const sizeToPixels_1 = __importDefault(require("../utilities/sizeToPixels"));
const setTextAlignment_1 = __importDefault(require("./setTextAlignment"));
const setTextAnimation_1 = __importDefault(require("./setTextAnimation"));
const fs = require('fs');
function setText(text, index, isLast, videoSettings, composition) {
    const inputStream = `[track${index}]`;
    const outputStream = isLast ? `[output]` : `[track${index + 1}]`;
    const textBoxDimensions = (0, textIntoLines_1.default)(text);
    const fontColor = text.font_color || 'white';
    const duration = text.duration;
    let finalTextCommand = '';
    let fadeCommand = '';
    if (text.fade) {
        fadeCommand += `:alpha='if(lt(t,${text.fade_duration + text.time || 1}),t/${text.fade_duration || 1},1)'`;
    }
    //IMPOSTA DEL FONT-FAMILY DEL TESTO
    let fontFamily = `./src/data/text/${text.font_family}.ttf`;
    if (!fs.existsSync(fontFamily)) {
        console.warn(`Warning: File not found: ${fontFamily}. Applying default font.`);
        fontFamily = './default-font.ttf'; // Sostituisci con il percorso del font di default
    }
    //ALLINEAMENTO DEL TESTO
    let { x, y, lineHeight } = (0, setTextAlignment_1.default)(videoSettings, textBoxDimensions, text);
    //AGGIUNTA OMBRE DEL TESTO
    const shadow = [
        text.shadow_x !== undefined && text.shadow_x !== null ? `:shadowx=${(0, sizeToPixels_1.default)(text.shadow_x, 100)}` : '',
        text.shadow_y !== undefined && text.shadow_y !== null ? `:shadowy=${(0, sizeToPixels_1.default)(text.shadow_y, 100)}` : '',
        text.shadow_color !== undefined && text.shadow_color !== null ? `:shadowcolor=${text.shadow_color}` : ''
    ].join('');
    if (text.animations) {
        //SE PRESENTE UN'ANIMAZIONE DEL TESTO ( WORD , LINE O FLASH) CHIAMA L'APPOSITA FUNZIONE
        finalTextCommand += (0, setTextAnimation_1.default)(text, textBoxDimensions, x, y, fontFamily, lineHeight, shadow);
    }
    else {
        //se non è presente l'animazione non la imposto
        textBoxDimensions.lines.forEach((line, lineIndex) => {
            let xPos;
            const lineWidth = textBoxDimensions.lineWidths[lineIndex];
            // imposto l'allineamento del testo all'interno del box
            if (text.text_alignment === 'center') {
                xPos = x + (textBoxDimensions.maxWidth - lineWidth) / 2;
            }
            else if (text.text_alignment === 'right') {
                xPos = x + (textBoxDimensions.maxWidth - lineWidth);
            }
            else {
                xPos = x;
            }
            const yPos = Math.round(y + (lineIndex * lineHeight));
            //imposto la stringa da inserire nel comando finale per il testo
            finalTextCommand += `${lineIndex > 0 ? ',' : ''}drawtext=fontfile=${fontFamily}:text='${line}':x=${xPos}:y=${yPos}:fontsize=${textBoxDimensions.fontSize}:
            fontcolor=${fontColor}${fadeCommand}${shadow}${fadeCommand}:enable='between(t,${text.time},${text.time + duration || composition.duration})'`;
        });
    }
    //restituisco il comando includendo lo stream di input e di output calcolato
    return `${inputStream}${finalTextCommand}${outputStream}`;
}
exports.default = setText;
