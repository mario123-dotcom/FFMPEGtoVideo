import * as fs from 'fs';
import * as path from 'path';
import { VideoSettings, Composition, Audio } from "../model/model";
import addAudio from './addAudio';
import createComposition from './createComposition';

// QUESTA FUNZIONE SI OCCUPA DI CREARE IL COMANDO PER LA GENERAZIONE DEL VIDEO FINALE CHE COMPRENDE TUTTE LE COMPOSIZIONI E AUDIO
function createVideo(videoSettings: VideoSettings):  string[] {

    // Imposta il nome e il formato del video di output
    const outputName = `${videoSettings.name || 'output'}.${videoSettings.output_format || 'mp4'}`;
    const outputSettings = `-c:v libx264 -pix_fmt yuv420p -y ./public/videos/${outputName}`;
    const videoInputs: string[] = [];
    const videoFilters: string[] = [];
    const audioInputs: string[] = [];
    const audioFilters: string[] = [];
    let command: string[] = [];
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
    videoSettings.elements?.forEach((element, index) => {
        const isLast = index === (videoSettings.elements.length - 1);

        // se si tratta di una composizione avvio la funzione addetta alla creazione
        if (element.type === 'composition') {
            const composition = element as Composition;
            // indice della composizione
            const formattedIndex = cmpIndex.toString().padStart(2, '0');
            const [compositionPath, createCommand] = createComposition(composition, videoSettings, formattedIndex);
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
        } else if (element.type === 'audio') {
            const audio = element as Audio;
            // controllo che il percorso del file audio specificato esista
            const absolutePath = path.resolve(audio.source);
            if (!fs.existsSync(absolutePath)) {
                console.error(`Error: File not found: ${absolutePath}`);
                return;
            }
            // aggiungo la stringa di input dell'audio al vettore degli input
            audioInputs.push(`-i ${audio.source}`);
            const [audioFilter, audioStream] = addAudio(audio, index);
            // aggiungo i filtri audio al vettore
            audioFilters.push(audioFilter);
            // aggiungo gli stream dell'audio audio al vettore
            audioStreams += audioStream;
        } else {
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
    };

// SETTA LO STREAM DI INPUT VIDEO DELLE COMPOSIZIONI
function setCompositionFilter(index: number): string {
    return `[${index}:v]`;
}

export default createVideo;
module.exports = createVideo;
