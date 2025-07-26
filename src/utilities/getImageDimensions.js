"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_size_1 = __importDefault(require("image-size"));
// QUESTA FUNZIONE CALCOLA LE DIMENSIONI WIDTH ED HEIGHT DELL'IMMAGINE IN INPUT (path) //
function getImageDimensions(imagePath) {
    try {
        const dimensions = (0, image_size_1.default)(imagePath);
        console.log(`Larghezza: ${dimensions.width}, Altezza: ${dimensions.height}`);
        return dimensions;
    }
    catch (error) {
        console.error('Errore nel recuperare le dimensioni dell\'immagine:', error);
        throw error;
    }
}
exports.default = getImageDimensions;
