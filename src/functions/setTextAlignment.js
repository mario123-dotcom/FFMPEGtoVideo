"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sizeToPixels_1 = __importDefault(require("../utilities/sizeToPixels"));
//QUESTA FUNZIONE PERMETTE DI SETTARE L'ALLINEAMENTO DEL BOX DI TESTO TRAMITE LE COORDINATE X Y
function setTextAlignment(videoSettings, textBoxDimensions, text) {
    let x = 0, y = 0;
    const lineHeight = parseFloat(text.line_height) / 100 * text.height;
    // SE NEL JSON NON E' IMPOSTATA LA VARIABILE "text_box_alignment" ALLORA SI FA RIFERIMENTO AI VALORI DI X E Y 
    //DEFINITI NEL JSON. 
    switch (text.text_box_alignment) {
        case 'center':
            x = (videoSettings.width - textBoxDimensions.maxWidth) / 2;
            y = (videoSettings.height - textBoxDimensions.totalHeight) / 2 - textBoxDimensions.totalHeight / 2;
            break;
        case 'left':
            x = 0;
            y = (videoSettings.height - textBoxDimensions.totalHeight) / 2;
            break;
        case 'right':
            x = videoSettings.width - textBoxDimensions.maxWidth;
            y = (videoSettings.height - textBoxDimensions.totalHeight) / 2;
            break;
        case 'top left':
            x = 0;
            y = 0;
            break;
        case 'top right':
            x = videoSettings.width - textBoxDimensions.maxWidth;
            y = 0;
            break;
        case 'bottom left':
            x = 0;
            y = videoSettings.height - textBoxDimensions.totalHeight + (lineHeight * textBoxDimensions.lines.length);
            break;
        case 'bottom right':
            x = videoSettings.width - textBoxDimensions.maxWidth;
            y = videoSettings.height - (textBoxDimensions.totalHeight + (lineHeight * (textBoxDimensions.lines.length - 3)));
            break;
        case 'top center':
            x = (videoSettings.width - textBoxDimensions.maxWidth) / 2;
            y = 20;
            break;
        case 'bottom center':
            x = (videoSettings.width - textBoxDimensions.maxWidth) / 2;
            y = videoSettings.height - textBoxDimensions.totalHeight + ((0, sizeToPixels_1.default)(text.line_height, 100) * textBoxDimensions.lines.length);
            break;
        default:
            x = (0, sizeToPixels_1.default)(text.x, videoSettings.width);
            y = (0, sizeToPixels_1.default)(text.y, videoSettings.height);
            break;
    }
    return { x, y, lineHeight };
}
exports.default = setTextAlignment;
