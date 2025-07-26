"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parsePercentage_1 = __importDefault(require("../utilities/parsePercentage"));
function addAudio(audio, index) {
    // Initialize filter strings
    let volumeFilter = "";
    let fadeFilter = "";
    let trimFilter = "";
    let delayFilter = "";
    let duckingFilters = [];
    const inputStream = `[${index}:a]`;
    const outputStream = `[atrack${audio.track}]`;
    // Process ducking filters
    if (audio.duckings) {
        audio.duckings.forEach(({ start, end, volume }) => {
            if (start === undefined || end === undefined) {
                throw new Error("Specify start and end times for ducking!");
            }
            duckingFilters.push(`,volume=enable='between(t,${start},${end || start + 3})':volume=${(0, parsePercentage_1.default)(volume) || 0.2}`);
        });
    }
    // Aggiugni filtro volume
    if (audio.volume) {
        volumeFilter = `,volume=${(0, parsePercentage_1.default)(audio.volume) || 1}`;
    }
    // ritaglia audio
    if (audio.duration) {
        trimFilter = `,atrim=duration=${audio.duration}`;
    }
    // aggiugni delay
    const delayMs = (audio.time || 0) * 1000;
    delayFilter = `adelay=${delayMs}|${delayMs}`;
    // aggiungi fade
    if (audio.afade_in) {
        fadeFilter += `,afade=t=in:st=${audio.afade_in || 0}:d=${audio.afade_in_duration || 0.5}`;
    }
    if (audio.afade_out) {
        fadeFilter += `,afade=t=out:st=${audio.afade_out || (audio.time || 0) + 5}:d=${audio.afade_out_duration || 0.5}`;
    }
    // costruisci la stringa finale relativa all'audio
    const filterString = `${inputStream}${delayFilter}${trimFilter}${fadeFilter}${volumeFilter}${duckingFilters.join("")}${outputStream}`;
    return [filterString, outputStream];
}
exports.default = addAudio;
