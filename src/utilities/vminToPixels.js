"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sizeToPixels_1 = __importDefault(require("./sizeToPixels"));
//PERMETTE DI CALCOLARE I VALORI CORRISPONDENTI IN PIXEL PARTENDO DA STRINGHE DEL TIPO ' xxvmin '
function vminToPixels(vminString, text, config) {
    // Rimuove eventuali spazi e estrai il valore numerico dalla stringa
    const cleanedString = vminString.trim().toLowerCase();
    const vminValue = parseFloat(cleanedString);
    let x = (0, sizeToPixels_1.default)(text.x, config.width);
    let y = (0, sizeToPixels_1.default)(text.y, config.height);
    if (isNaN(vminValue)) {
        throw new Error('Valore di `vmin` non valido');
    }
    // Ottieni la larghezza e l'altezza del viewport
    const viewportWidth = x;
    const viewportHeight = y;
    // Calcola il lato più corto del viewport
    const minSide = Math.min(viewportWidth, viewportHeight);
    // Calcola la dimensione in pixel
    return Math.round((vminValue * minSide) / 100);
}
exports.default = vminToPixels;
