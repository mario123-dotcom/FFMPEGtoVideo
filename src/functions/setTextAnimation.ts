
import { Text, TextBox ,Animation} from "../model/model";
import calculateTextWidth from "../utilities/calculateTextWidth";


function setTextAnimation(text: Text,textBoxDimensions: TextBox, x: number,y: number,fontFamily: string,lineHeight: number,shadow: string): string {
   
   
    let textWithAnimation = '';
    let currentTime = text.time;
    const { lines,fontSize, maxWidth,lineWidths} = textBoxDimensions;
    const { text_alignment, font_color } = text;

    //CALCOLA LA COORDINATA X DI PARTENZA DAL QUALE INIZIARE A MOSTRARE IL TESTO
    const calculateXPos = (alignment: string, lineWidth: number, cumulativeWidth: number) => {
        let baseXPos = x + (maxWidth - lineWidth) / 2;
        if (alignment === 'left') return x + cumulativeWidth;
        if (alignment === 'right') return x + (maxWidth - lineWidth) + cumulativeWidth;
        return baseXPos + cumulativeWidth;  };
    //CALCOLA LA COORDINATA Y DI PARTENZA DAL QUALE INIZIARE A MOSTRARE IL TESTO
    const calculateYPos = (lineIndex: number) => Math.round(y + (lineIndex * lineHeight));

    


    text.animations.forEach((animation: Animation) => {
        if (animation.type === "Text-Reveal") {

            //IMPOSTA L'ANIMAZIONE "WORD" (IL TESTO COMPARE PAROLA DOPO PAROLA)
            if (animation.split === "word") {
                // Calcolo il tempo durata dell'animazione per la singola parola 
                const allWords = lines.flatMap(line => line.match(/(.+?)(?=\s|$)/g) || []);
                const totalWordCount = allWords.length;
                const timePerWord = animation.duration / totalWordCount;
            
                let currentStartTime = text.time;  // Tempo di inizio corrente della riga
            
                // Divido ogni singola riga per parole
                lines.forEach((line, lineIndex) => {
                    const words = line.match(/(.+?)(?=\s|$)/g) || [];
                    let cumulativeWidth = 0;
            
                    // Per ogni parola
                    words.forEach((word, wordIndex) => {
                        // Calcolo la larghezza in px della parola
                        const wordWidth = calculateTextWidth(word, fontSize);
                        // Imposto le coordinate di inizio della parola
                        const xPos = calculateXPos(text_alignment, lineWidths[lineIndex], cumulativeWidth);
                        const yPos = calculateYPos(lineIndex);
                        // Imposto l'istante di tempo in cui iniziare a mostrare la parola
                        const startTime = currentStartTime + (wordIndex * timePerWord);
                        // Imposto la stringa da inserire nel comando finale per il testo
                        textWithAnimation += `${wordIndex > 0 || lineIndex > 0 ? ',' : ''}drawtext=fontfile=${fontFamily}:text='${word}':x=${xPos}:y=${yPos}:fontsize=${fontSize}:fontcolor=${font_color||'white'}${shadow}:enable='between(t,${startTime.toFixed(2)},${text.duration})'`;
                        // Aggiungo alla "cumulativeWidth" la larghezza della parola appena analizzata
                        cumulativeWidth += wordWidth;
                    });
            
                    // Aggiorno il tempo di inizio corrente per la prossima riga
                    currentStartTime += words.length * timePerWord;  // Passa alla riga successiva dopo la durata totale delle parole della riga corrente
                });
            
                // IMPOSTA L'ANIMAZIONE "LINE" (IL TESTO COMPARE RIGA DOPO RIGA)
            } else if (animation.split === "line") {
                //calcolo il tempo di animazione per ogni riga
                const timePerLine = animation.duration / lines.length;

                lines.forEach((line, lineIndex) => {
                    //imposto le coordinate di inizio della riga
                    const xPos = calculateXPos(text_alignment, lineWidths[lineIndex], 0);
                    const yPos = calculateYPos(lineIndex);
                    //imposto l'istante di tempo in cui iniziare a mostrare la riga
                    const startTime = currentTime + lineIndex * timePerLine;
                    //imposto la stringa da inserire nel comando finale per il testo
                    textWithAnimation += `${lineIndex > 0 ? ',' : ''}drawtext=fontfile=${fontFamily}:text='${line}':x=${xPos}:y=${yPos}:fontsize=${fontSize}:fontcolor=${font_color}${shadow}:enable='between(t,${startTime.toFixed(2)},${text.duration})'`;
                });
            }

          //DA TESTARE 
        //IMPOSTA L'ANIMAZIONE "FLASH" (LA PAROLA SUCCESSIVA SOSTITUISCE LA PRECEDENTE)
        } else if (animation.type === "Text-Flash") {
            //divido la riga in parole
            const words = text.text.split(' ');
            //calcolo il tempo della durata di ogni parola 
            const timePerWord = animation.duration / words.length;
            words.forEach((word, wordIndex) => {
                // definisco il tempo di inizo e di fine visualizzazione parola
                const startTime = text.time + wordIndex * timePerWord;
                const endTime = startTime + timePerWord;
                //imposto la stringa da inserire nel comando finale per il testo
                textWithAnimation += `${wordIndex > 0 ? ',' : ''}drawtext=fontfile=${fontFamily}:text='${word}':x=${x}:y=${y}:fontsize=${text.font_size}:fontcolor=${font_color}${shadow}:enable='between(t,${startTime},${endTime})'`;
                currentTime = endTime;
            });
        }
    });

    return textWithAnimation;
}

export default setTextAnimation;


