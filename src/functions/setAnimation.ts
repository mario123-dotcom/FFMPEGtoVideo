import { Image, Animation, Shapes,VideoSettings } from "../model/model";
import parsePercentage from "../utilities/parsePercentage";
// QUESTA FUNZIONE IMPOSTA LE STRINGHE RELATIVE ALLE ANIMAZIONI
function setAnimation(image: Image | Shapes,videoSettings: VideoSettings): string[] {
    let animation: any[] = ['', ''];

    if (image.animations) {
        image.animations.forEach((element: Animation) => {

            //definisco le variabili relative all'animazione
            let a = element as Animation;
            let duration = a.duration || 2;
            let startTime = a.time || 0.0;

            //durata fotogrammi pan
            let dpan = 60*duration;

            //se il valore "transitions" è false o non è definito imposto l'animazione
            if (a.transition === false || a.transition === undefined) {
                switch (a.type) {
                    case 'pan':
                        {
                            if(a.reversed===false || a.reversed ===undefined){
                            let zoom=parsePercentage(a.end_scale);
                            animation[0]=`,zoompan=z='zoom+0.001':x='if(gte(zoom,${zoom||1.5}),x,x+0)':y='y':d=${dpan},scale=${videoSettings.width}:${videoSettings.height}`;}
                            else{
                            let zoom=parsePercentage(a.start_scale);
                            animation[0]=`,zoompan=z='if(eq(on,1),${zoom||1.5},zoom-0.002)':d=${dpan},scale=${videoSettings.width}:${videoSettings.height}`;
                            }
                        }
                        break;
                }
            //altrimenti imposto la transizione (xfade)
            } else {
                const directionMap: { [key: string]: string } = {
                    'right': 'right',
                    'left': 'left',
                    'up': 'up',
                    'down': 'down',
                    'tl': 'tl',
                    'tr': 'tr',
                    'bl': 'bl',
                    'br': 'br',
                    'crop': 'crop',
                    'open': 'open',
                    'close': 'close',
                    'hl': 'hl',
                    'hr': 'hr',
                    'vu': 'vu',
                    'vd': 'vd',
                };

                switch (a.type) {
                    case 'fade':
                        if (!a.reversed) {
                            animation[1] = `xfade=transition=fade:duration=${duration}:offset=${startTime}`;
                        }
                        break;
                    case 'wipe':
                    case 'slide':
                    case 'smooth':
                    case 'circle':
                    case 'diag':
                    case 'slice':
                    case 'wind':
                    case 'cover':
                    case 'reveal':
                        animation[1] = `xfade=transition=${a.type}${directionMap[a.direction] || ''}:duration=${duration}:offset=${startTime}`;
                        break;
                    case 'rectcrop':
                    case 'dissolve':
                    case 'pixelize':
                    case 'radial':
                    case 'hblur':
                    case 'squeezev':
                    case 'squeezeh':
                    case 'zoomin':
                        animation[1] = `xfade=transition=${a.type}:duration=${duration}:offset=${startTime}`;
                        break;
                    case 'horz':
                    case 'vert':
                        animation[1] = `xfade=transition=${a.type}${directionMap[a.direction] || ''}:duration=${duration}:offset=${startTime}`;
                        break;
                }
            }
        });
    }
    return animation;
}

export default setAnimation;

