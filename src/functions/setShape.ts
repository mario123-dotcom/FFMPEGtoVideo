import { Shapes, VideoSettings } from "../model/model";
import setAnimation from "./setAnimation";
import sizeToPixels from "../utilities/sizeToPixels";
import SvgToPng from "../utilities/SvgToPng";

//QUESTA FUNZIONE IMPLEMENTA L'AGGIUNTA DELLE FORME NEL VIDEO
function setShape(shape:Shapes , index:number, last:boolean, videoSettings:VideoSettings,compositionName:string):string[] {

const inputStream = index=== 0? `[0:v]`:`[${index}:v]` ;
const outputStream =  `[track${index+1}]`;
let animation:string[]=[];
let overlay='';
let transition='';


//definisco un vettore che restituirà le seguenti stringhe:
// shapeFilters[0] --> percorso del file png che viene creato a partire dal path svg
// shapeFilters[1] --> filtri da applicare sul png generato a partire dal path svg
// shapeFilters[2] --> overlay
// shapeFilters[2] --> transizione (se presente)
let shapeFilters:string[]=['','','',''];  


//converto la forma in formato PNG (definita tramite path svg nel JSON)
let shapeInput = SvgToPng(shape,videoSettings,index,compositionName);


//aggiungo un pad trasparente definito con le dimensioni del video (cosi da evitare problemi con eventuali transizioni xfade)
let filters = 'pad=' + videoSettings.width + ':' + videoSettings.height;
if (shape.x!= undefined && shape.x!= null) {
    filters += `:x=${sizeToPixels(shape.x,videoSettings.width)}`;
}   
if (shape.y!= undefined && shape.y!= null) {
    filters += `:y=${sizeToPixels(shape.y,videoSettings.height)}`;
}
filters += ':color=black@0';



// se presenti animazioni , chiamo l'apposita funzione che restituisce i seguenti parametri
// animation[0] --> animazioni (pan)
// animation[1] --> transizioni (fade,circlecrop,wipe...)
animation=(setAnimation(shape,videoSettings));

//se è stata restituita una transizione imposto la stringa in maniera opportuna
if(animation[1]){
 
    if(index>0 && last){
        transition=`[track${index}][track${index+1}]${animation[1]}[output]`}
    else if(index>0){
        transition=`[track${index}][track${index+1}]${animation[1]}[track${index+1}]`}
}else{
if(index>0 && last){
    overlay=`[track${index}][track${index+1}]overlay=shortest=1[output]`}
else if(index>0){
    overlay=`[track${index}][track${index+1}]overlay=shortest=1[track${index+1}]`}
}



shapeFilters[0]=shapeInput;
shapeFilters[1]=inputStream+filters+outputStream ;
shapeFilters[2]=overlay;
shapeFilters[3]=transition;
    
 return shapeFilters ;
    


    
}
export default setShape;


