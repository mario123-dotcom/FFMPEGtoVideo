import { Text, VideoSettings } from "../model/model";
import sizeToPixels from "./sizeToPixels";

//PERMETTE DI CALCOLARE I VALORI CORRISPONDENTI IN PIXEL PARTENDO DA STRINGHE DEL TIPO ' xxvmin '

function vminToPixels(vminString: string, text:Text,config:VideoSettings): number {
    // Rimuove eventuali spazi e estrai il valore numerico dalla stringa
    const cleanedString = vminString.trim().toLowerCase();
    const vminValue = parseFloat(cleanedString);
    let x = sizeToPixels(text.x, config.width);
    let y = sizeToPixels(text.y, config.height);
    if (isNaN(vminValue)) {
        throw new Error('Valore di `vmin` non valido');
    }
    
    // Ottieni la larghezza e l'altezza del viewport
    const viewportWidth: number = x;
    const viewportHeight: number = y;

    // Calcola il lato più corto del viewport
    const minSide: number = Math.min(viewportWidth, viewportHeight);

    // Calcola la dimensione in pixel
    return Math.round((vminValue * minSide) / 100);
}

export default vminToPixels