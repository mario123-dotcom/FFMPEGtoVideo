// FUNZIONE UTILE PER IL SETTAGGIO DEL TESTO , PERMETTE DI CALCOLARE LA LARGHEZZA DEL TESTO IN INPUT
 //IN BASE ALLA DIMENSIONE DEL FONT//


function calculateTextWidth(text: string, fontSize: number): number {
    // Stima della larghezza di un carattere basata sul font size
    // Supponiamo che la larghezza media di un carattere sia circa 0,6 volte il font size
    const averageCharWidth = 0.6 * fontSize;

    // Calcola la larghezza totale del testo come somma delle larghezze dei singoli caratteri
    const textWidth = text.length * averageCharWidth;

    return textWidth;
}
export default calculateTextWidth;