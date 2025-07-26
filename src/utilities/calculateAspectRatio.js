"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculateAspectRatio(width, height) {
    // Calcola il massimo comune divisore (GCD) per semplificare il rapporto
    function gcd(a, b) {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    // Trova il GCD delle due dimensioni
    const divisor = gcd(width, height);
    // Calcola il rapporto semplificato
    const simplifiedWidth = width / divisor;
    const simplifiedHeight = height / divisor;
    return `${simplifiedWidth}:${simplifiedHeight}`;
}
exports.default = calculateAspectRatio;
