"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sizeToPixels_1 = __importDefault(require("./sizeToPixels"));
const { createCanvas } = require('canvas');
// Funzione per sostituire l'apice singolo con l'apice curvato
function replaceSingleQuote(text) {
    return text.replace(/'/g, '’');
}
function textIntoLines(textOptions) {
    let { text, width, height, font_size } = textOptions;
    // Sostituisci gli apici singoli con apici curvati
    text = replaceSingleQuote(text);
    const fontFamily = 'Arial'; // Imposta la famiglia di font desiderata
    let fontSize = textOptions.font_size;
    const canvas = createCanvas(0, 0);
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error("Impossibile ottenere il contesto 2D del canvas");
    }
    function calculateLineHeight(fontSize, leading) {
        return fontSize + leading;
    }
    function calcolaRigheTesto(fontSize) {
        context.font = `${fontSize}px ${fontFamily}`;
        const parole = text.split(' ');
        const righe = [];
        const lineWidths = [];
        let rigaCorrente = '';
        let maxWidth = 0;
        for (const parola of parole) {
            // Verifica la presenza di '/n' per andare a capo
            if (parola.includes('\n')) {
                const subRighe = parola.split('\n');
                subRighe.forEach((subRiga, index) => {
                    const rigaProva = rigaCorrente.length === 0 ? subRiga : `${rigaCorrente} ${subRiga}`;
                    const larghezzaRiga = context.measureText(rigaProva).width;
                    if (larghezzaRiga > width && index === 0) {
                        righe.push(rigaCorrente);
                        lineWidths.push(context.measureText(rigaCorrente).width);
                        maxWidth = Math.max(maxWidth, context.measureText(rigaCorrente).width);
                        rigaCorrente = subRiga;
                    }
                    else {
                        righe.push(rigaProva);
                        lineWidths.push(context.measureText(rigaProva).width);
                        maxWidth = Math.max(maxWidth, context.measureText(rigaProva).width);
                        rigaCorrente = '';
                    }
                });
            }
            else {
                const rigaProva = rigaCorrente.length === 0 ? parola : `${rigaCorrente} ${parola}`;
                const larghezzaRiga = context.measureText(rigaProva).width;
                if (larghezzaRiga > width) {
                    righe.push(rigaCorrente);
                    lineWidths.push(context.measureText(rigaCorrente).width);
                    maxWidth = Math.max(maxWidth, context.measureText(rigaCorrente).width);
                    rigaCorrente = parola;
                }
                else {
                    rigaCorrente = rigaProva;
                }
            }
            // Verifica se l'altezza del testo supera l'altezza massima
            if ((righe.length + 1) * fontSize > height) {
                break;
            }
        }
        if (rigaCorrente) {
            righe.push(rigaCorrente);
            const lastLineWidth = context.measureText(rigaCorrente).width;
            lineWidths.push(lastLineWidth);
            maxWidth = Math.max(maxWidth, lastLineWidth);
        }
        return { lines: righe, maxWidth, lineWidths };
    }
    // Riduci la dimensione del font finché il testo non si adatta sia in larghezza che in altezza
    while (fontSize > 0) {
        const { lines, maxWidth, lineWidths } = calcolaRigheTesto(fontSize);
        const altezzaTesto = lines.length * fontSize;
        // Se il testo si adatta sia in larghezza che in altezza, esci dal ciclo
        if (altezzaTesto <= height && maxWidth <= width) {
            return {
                fontSize,
                lines,
                maxWidth,
                totalHeight: altezzaTesto,
                lineWidths
            };
        }
        fontSize -= 1; // Riduci la dimensione del font se il testo non si adatta
    }
    // Se non è possibile adattare il testo, restituisci la dimensione del font più piccola e le righe
    const { lines, maxWidth, lineWidths } = calcolaRigheTesto(fontSize);
    const altezzaTesto = calculateLineHeight(fontSize, (0, sizeToPixels_1.default)(textOptions.line_height, textOptions.height));
    return {
        fontSize,
        lines,
        maxWidth,
        totalHeight: altezzaTesto,
        lineWidths
    };
}
exports.default = textIntoLines;
