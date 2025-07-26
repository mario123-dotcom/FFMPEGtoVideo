
import sizeOf from 'image-size';

// QUESTA FUNZIONE CALCOLA LE DIMENSIONI WIDTH ED HEIGHT DELL'IMMAGINE IN INPUT (path) //
function getImageDimensions(imagePath: string) {
    try {
        const dimensions = sizeOf(imagePath);
        console.log(`Larghezza: ${dimensions.width}, Altezza: ${dimensions.height}`);
        return dimensions;
    } catch (error) {
        console.error('Errore nel recuperare le dimensioni dell\'immagine:', error);
        throw error;
    }
}
export default getImageDimensions

