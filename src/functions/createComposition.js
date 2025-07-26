"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setImgFilter_1 = __importDefault(require("./setImgFilter"));
const calculateAspectRatio_1 = __importDefault(require("../utilities/calculateAspectRatio"));
const setShape_1 = __importDefault(require("./setShape"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const setText_1 = __importDefault(require("./setText"));
// QUESTA FUNZIONE SI OCCUPA DI GENERARE LE COMPOSIZIONI DA INSERIRE NEL VIDEO DI OUTPUT FINALE
function createComposition(composition, videoSettings, index) {
    var _a;
    // Calcola l'aspect ratio della composizione
    const aspect = (0, calculateAspectRatio_1.default)(videoSettings.width, videoSettings.height);
    const inputs = [];
    const filters = [];
    const overlays = [];
    // Processa gli elementi della composizione
    (_a = composition.elements) === null || _a === void 0 ? void 0 : _a.forEach((element, idx) => {
        const isLast = idx === composition.elements.length - 1;
        switch (element.type) {
            case 'image': {
                const image = element;
                const absolutePath = path.resolve(image.source);
                if (fs.existsSync(absolutePath)) {
                    inputs.push(`-loop 1 -i ${image.source}`);
                    const [filter, overlay] = (0, setImgFilter_1.default)(image, videoSettings, idx, isLast);
                    filters.push(filter);
                    overlays.push(overlay);
                }
                else {
                    console.error(`Error: File not found: ${absolutePath}`);
                }
                break;
            }
            case 'shape': {
                const shape = element;
                const [input, filter, overlay, transition] = (0, setShape_1.default)(shape, idx, isLast, videoSettings, composition.name);
                inputs.push(`-loop 1 ${input}`);
                filters.push(filter);
                overlays.push(`${overlay}${transition}`);
                break;
            }
            case 'text': {
                const text = (0, setText_1.default)(element, idx, isLast, videoSettings, composition);
                overlays.push(text);
                break;
            }
            default:
                console.warn('Tipo di elemento non riconosciuto:', element.type);
        }
    });
    // Crea il comando FFmpeg per la composizione
    const filterComplex = `${filters.join(';')}${overlays.join(';')}`;
    const outputPath = `./src/data/tmp/cmp${index}.mp4`;
    const command = `ffmpeg -hide_banner ${inputs.join(' ')} -filter_complex "${filterComplex}" -map "[output]" -t ${composition.duration} -r 30 -aspect ${aspect} -s ${videoSettings.width}x${videoSettings.height} -y ${outputPath}`;
    return [outputPath, command];
}
exports.default = createComposition;
