function calculateAspectRatio(width: number, height: number): string {
    // Calcola il massimo comune divisore (GCD) per semplificare il rapporto
    function gcd(a: number, b: number): number {
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

export default calculateAspectRatio;