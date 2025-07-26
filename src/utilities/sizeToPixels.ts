//PRENDE IN INPUT UN STRINGA CHE TERMINA IN % O px TRASFORMANDOLA IN NUMERO 
// APPLICANDO LE CORRETTE FORMULE DI TRASFORMAZIONE                      
// IL PRIMO INPUT CONTIENE LA STRINGA DA TRASFORMARE
// IL SECONDO INPUT CONTIENE IL VALORE IN BASE AL QUALE CONTARE LA PERCENTUALE

function sizeToPixels(sizeString: any, totalSize: number): number {
    if (typeof sizeString !== 'string') {
        console.error('sizeString is not a string:', sizeString);
        return 0; // O restituisci un valore di fallback
    }

    sizeString = sizeString.trim().toLowerCase();

    // Gestisce le dimensioni espresse in pixel
    if (sizeString.endsWith('px')) {
        return Math.round(parseFloat(sizeString));
    }

    // Gestisce le dimensioni espresse in percentuale
    if (sizeString.endsWith('%')) {
        const percentage = parseFloat(sizeString);
        if (isNaN(percentage)) {
            throw new Error('Valore di percentuale non valido');
        }
        return Math.round((percentage / 100) * totalSize);
    }

    return 0; // Valore di fallback
}
export default sizeToPixels