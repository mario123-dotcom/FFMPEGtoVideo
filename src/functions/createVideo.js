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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const addAudio_1 = __importDefault(require("./addAudio"));
const createComposition_1 = __importDefault(require("./createComposition"));
// QUESTA FUNZIONE SI OCCUPA DI CREARE IL COMANDO PER LA GENERAZIONE DEL VIDEO FINALE CHE COMPRENDE TUTTE LE COMPOSIZIONI E AUDIO
function createVideo(videoSettings) {
    var _a;
    // Imposta il nome e il formato del video di output
    const outputName = `${videoSettings.name || 'output'}.${videoSettings.output_format || 'mp4'}`;
    const outputSettings = `-c:v libx264 -pix_fmt yuv420p -y ./public/videos/${outputName}`;
    const videoInputs = [];
    const videoFilters = [];
    const audioInputs = [];
    const audioFilters = [];
    let command = [];
    let audioStreams = '';
    let cmpIndex = 1;
    let settings = '';
    // controllo le dimensioni del video di output
    if (!videoSettings.width || !videoSettings.height) {
        console.error("ERRORE: Dimensioni video (WxH) non impostate.");
    }
    // Imposta il colore di riempimento e la durata del video
    settings += ` -f lavfi -i color=c=${videoSettings.fill_color || 'black'}
    :s=${videoSettings.width}x${videoSettings.height}:d=${videoSettings.duration || 5}`;
    // controllo tutti gli elementi presenti nel JSON
    (_a = videoSettings.elements) === null || _a === void 0 ? void 0 : _a.forEach((element, index) => {
        const isLast = index === (videoSettings.elements.length - 1);
        // se si tratta di una composizione avvio la funzione addetta alla creazione
        if (element.type === 'composition') {
            const composition = element;
            // indice della composizione
            const formattedIndex = cmpIndex.toString().padStart(2, '0');
            const [compositionPath, createCommand] = (0, createComposition_1.default)(composition, videoSettings, formattedIndex);
            // aggiungo il comando di creazione della composizione all'array di comandi finali
            command.push(`${createCommand}\n`);
            // controllo che il file della composizione esista
            if (!fs.existsSync(compositionPath)) {
                console.error(`Error: File not found: ${compositionPath}`);
                return;
            }
            // aggiungo la stringa di input al vettore di input
            videoInputs.push(`-i ${compositionPath}`);
            // aggiungo la stringa dei filtri al vettore dei filtri
            videoFilters.push(setCompositionFilter(index));
            cmpIndex++;
            // se si tratta di un audio avvio la funzione addetta alla creazione della stringa
        }
        else if (element.type === 'audio') {
            const audio = element;
            // controllo che il percorso del file audio specificato esista
            const absolutePath = path.resolve(audio.source);
            if (!fs.existsSync(absolutePath)) {
                console.error(`Error: File not found: ${absolutePath}`);
                return;
            }
            // aggiungo la stringa di input dell'audio al vettore degli input
            audioInputs.push(`-i ${audio.source}`);
            const [audioFilter, audioStream] = (0, addAudio_1.default)(audio, index);
            // aggiungo i filtri audio al vettore
            audioFilters.push(audioFilter);
            // aggiungo gli stream dell'audio audio al vettore
            audioStreams += audioStream;
        }
        else {
            console.warn('Warning: NESSUN ELEMENTO PRESENTE NEL JSON!', element.type);
        }
    });
    // Assemble final FFmpeg command
    const vInput = videoInputs.join(' ');
    const aInput = audioInputs.join(' ');
    const vFilter = videoFilters.join('');
    const aFilter = audioFilters.join(';');
    command.push(`ffmpeg -hide_banner ${aInput} ${vInput} -filter_complex "${vFilter}concat=n=${videoFilters.length}:v=1[vout];${aFilter};${audioStreams}amix=inputs=${audioFilters.length}[audio_mix];[audio_mix]atrim=0:${videoSettings.duration}[a]" -map "[vout]" -map "[a]" ${outputSettings}`);
    return command;
}
;
// SETTA LO STREAM DI INPUT VIDEO DELLE COMPOSIZIONI
function setCompositionFilter(index) {
    return `[${index}:v]`;
}
exports.default = createVideo;
module.exports = createVideo;
