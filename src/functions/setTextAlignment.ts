import { TextBox, VideoSettings,Text } from "../model/model";
import sizeToPixels from "../utilities/sizeToPixels";


//QUESTA FUNZIONE PERMETTE DI SETTARE L'ALLINEAMENTO DEL BOX DI TESTO TRAMITE LE COORDINATE X Y



function setTextAlignment( videoSettings: VideoSettings, textBoxDimensions:TextBox , text:Text):{ x: number, y: number , lineHeight: number }{
   let x=0 , y=0 ;
   const lineHeight = parseFloat(text.line_height) / 100 * text.height;

   // SE NEL JSON NON E' IMPOSTATA LA VARIABILE "text_box_alignment" ALLORA SI FA RIFERIMENTO AI VALORI DI X E Y 
   //DEFINITI NEL JSON. 
    switch (text.text_box_alignment) {
        case 'center':
            x = (videoSettings.width - textBoxDimensions.maxWidth) / 2;
            y = (videoSettings.height - textBoxDimensions.totalHeight) / 2 - textBoxDimensions.totalHeight/2;
            break;
        case 'left':
            x = 0;
            y = (videoSettings.height - textBoxDimensions.totalHeight) / 2;
            break;
        case 'right':
            x = videoSettings.width - textBoxDimensions.maxWidth;
            y = (videoSettings.height - textBoxDimensions.totalHeight) / 2;
            break;
        case 'top left':
            x = 0;
            y = 0;
            break;
        case 'top right':
            x = videoSettings.width - textBoxDimensions.maxWidth;
            y = 0;
            break;
        case 'bottom left':
            x = 0;
            y = videoSettings.height - textBoxDimensions.totalHeight + (lineHeight * textBoxDimensions.lines.length);
            break;
        case 'bottom right':
            x = videoSettings.width - textBoxDimensions.maxWidth;
            y = videoSettings.height - (textBoxDimensions.totalHeight + (lineHeight * (textBoxDimensions.lines.length - 3)));
            break;
        case 'top center':
            x = (videoSettings.width - textBoxDimensions.maxWidth) / 2;
            y = 20;
            break;
        case 'bottom center':
            x = (videoSettings.width - textBoxDimensions.maxWidth) / 2;
            y = videoSettings.height - textBoxDimensions.totalHeight + (sizeToPixels(text.line_height, 100) * textBoxDimensions.lines.length);
            break;
        default:
            
            x = sizeToPixels(text.x, videoSettings.width);
            y = sizeToPixels(text.y, videoSettings.height);
            break;
    }




    return { x , y , lineHeight};


}

export default setTextAlignment;