import { Image, VideoSettings,  Text, Composition, Shapes } from "../model/model";
import setImgFilter from "./setImgFilter";
import calculateAspectRatio from "../utilities/calculateAspectRatio";
import setShape from "./setShape";
import * as fs from 'fs';
import * as path from 'path';
import setText from './setText';

// QUESTA FUNZIONE SI OCCUPA DI GENERARE LE COMPOSIZIONI DA INSERIRE NEL VIDEO DI OUTPUT FINALE
function createComposition(composition: Composition, videoSettings: VideoSettings, index: string): string[] {

    // Calcola l'aspect ratio della composizione
    const aspect = calculateAspectRatio(videoSettings.width, videoSettings.height);
    const inputs: string[] = [];
    const filters: string[] = [];
    const overlays: string[] = [];

    // Processa gli elementi della composizione
    composition.elements?.forEach((element, idx) => {
        const isLast = idx === composition.elements.length - 1;

        switch (element.type) {
            case 'image': {
                const image = element as Image;
                const absolutePath = path.resolve(image.source);
                if (fs.existsSync(absolutePath)) {
                    inputs.push(`-loop 1 -i ${image.source}`);
                    const [filter, overlay] = setImgFilter(image, videoSettings, idx, isLast);
                    filters.push(filter);
                    overlays.push(overlay);
                } else {
                    console.error(`Error: File not found: ${absolutePath}`);
                }
                break;
            }
            case 'shape': {
                const shape = element as Shapes;
                const [input, filter, overlay, transition] = setShape(shape, idx, isLast, videoSettings, composition.name);
                inputs.push(`-loop 1 ${input}`);
                filters.push(filter);
                overlays.push(`${overlay}${transition}`);
                break;
            }
            case 'text': {
                const text = setText(element as Text, idx, isLast, videoSettings, composition);
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

export default createComposition;
