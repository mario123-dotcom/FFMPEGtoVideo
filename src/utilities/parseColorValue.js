"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
SE DEVINITO IL COLOR_OVERLAY SULL'IMAGINE QUESTA FUNZIONE PRENDE IN INPUT IL FORMATO RGBA E LO NORMALIZZA NEL FORMATO UTILE AL FILTRO
"colorchannelmixer" DI FFMPEG ( VALORI COMPRESI TRA 0 E 1)
*/
function parseColorValue(color, channel) {
    // Regex per estrarre valori RGBA con spazi opzionali
    const match = color.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/i);
    if (match) {
        // Estrai i valori dai gruppi della regex
        const [r, g, b, a] = [
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            parseInt(match[3], 10),
            parseFloat(match[4])
        ];
        // Restituisci solo il valore richiesto
        switch (channel) {
            case 'r':
                return r / 255; // Ritorna il valore rosso
            case 'g':
                return g / 255; // Ritorna il valore verde
            case 'b':
                return b / 255; // Ritorna il valore blu
            case 'a':
                return a; // Ritorna il valore alfa
        }
    }
    // Se il colore non è valido, restituisci null
    return null;
}
exports.default = parseColorValue;
