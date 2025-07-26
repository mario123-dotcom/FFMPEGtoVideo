import { Composition, Text, VideoSettings, Animation,TextBox } from "../model/model";
import textIntoLines from "../utilities/textIntoLines";
import sizeToPixels from "../utilities/sizeToPixels";
import setTextAlignment from "./setTextAlignment";
import setTextAnimation from "./setTextAnimation";
const fs = require('fs');

function setText(text: Text, index: number, isLast: boolean, videoSettings: VideoSettings, composition: Composition): string {
    
    
    const inputStream = `[track${index}]`;
    const outputStream = isLast ? `[output]` : `[track${index+1}]`;
    const textBoxDimensions:TextBox = textIntoLines(text);
    const fontColor = text.font_color||'white';
    const duration = text.duration;
    let finalTextCommand = '';
    
    let fadeCommand='';
    if(text.fade){
        fadeCommand+=`:alpha='if(lt(t,${text.fade_duration+text.time||1}),t/${text.fade_duration||1},1)'`;
    }
   

    //IMPOSTA DEL FONT-FAMILY DEL TESTO
    let fontFamily = `./src/data/text/${text.font_family}.ttf`;
    if (!fs.existsSync(fontFamily)) {
        console.warn(`Warning: File not found: ${fontFamily}. Applying default font.`);
        fontFamily = './default-font.ttf'; // Sostituisci con il percorso del font di default
    }
    

    //ALLINEAMENTO DEL TESTO
    let { x , y, lineHeight}=setTextAlignment(videoSettings,textBoxDimensions,text);
    

    //AGGIUNTA OMBRE DEL TESTO
    const shadow = [
        text.shadow_x !== undefined && text.shadow_x !== null ? `:shadowx=${sizeToPixels(text.shadow_x, 100)}` : '',
        text.shadow_y !== undefined && text.shadow_y !== null ? `:shadowy=${sizeToPixels(text.shadow_y, 100)}` : '',
        text.shadow_color !== undefined && text.shadow_color !== null ? `:shadowcolor=${text.shadow_color}` : ''
    ].join('');

    
    if (text.animations) {
        //SE PRESENTE UN'ANIMAZIONE DEL TESTO ( WORD , LINE O FLASH) CHIAMA L'APPOSITA FUNZIONE
        finalTextCommand+=setTextAnimation(text,textBoxDimensions,x,y,fontFamily,lineHeight,shadow);
        
    } else {
       //se non è presente l'animazione non la imposto
        textBoxDimensions.lines.forEach((line: string, lineIndex: number) => {
            let xPos: number;
                        const lineWidth = textBoxDimensions.lineWidths[lineIndex];
                        // imposto l'allineamento del testo all'interno del box
                        if (text.text_alignment === 'center') {
                            xPos =  x+(textBoxDimensions.maxWidth - lineWidth) / 2;
                        } else if (text.text_alignment === 'right') {
                            xPos = x+(textBoxDimensions.maxWidth - lineWidth);
                        } else {
                            xPos = x;
                        }

            const yPos = Math.round(y + (lineIndex * lineHeight));
            //imposto la stringa da inserire nel comando finale per il testo
            
            finalTextCommand += `${lineIndex > 0 ? ',' : ''}drawtext=fontfile=${fontFamily}:text='${line}':x=${xPos}:y=${yPos}:fontsize=${textBoxDimensions.fontSize}:
            fontcolor=${fontColor}${fadeCommand}${shadow}${fadeCommand}:enable='between(t,${text.time},${text.time+duration || composition.duration})'`;
        });
    }

    //restituisco il comando includendo lo stream di input e di output calcolato
    return `${inputStream}${finalTextCommand}${outputStream}`;
}

export default setText;
