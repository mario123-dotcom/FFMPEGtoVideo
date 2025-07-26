//ALL'INTERNO DI QUESTO FILE .TS SONO DEFINITE LE INTERFACCE NECESSARIE ALLA LETTURA DEL FILE JSON IN INPUT

export interface VideoSettings {
  output_format: string; //Formato di output del video
  name: string;
  width: number; //Larghezza del video
  height: number; //Altezza del video 
  duration: number; //Durata
  fill_color: string; // Colore di riempimento dell'elemento (RGBA)
  elements: ElementType[]; // Array di elementi ( Composition , Audio...)
}
export interface Composition {
  name: string; //Nome dell'elemento.
  type: string; //Tipo dell'elemento (in questo caso, 'audio').
  track: number; //Traccia audio su cui si trova l'elemento.
  time: number; //Tempo di inizio dell'elemento nel video (in secondi).
  duration: number; //Durata dell'elemento (null indica durata automatica).
  elements: ElementType[]; //Array di elementi contenuti nella composizione.
}
export interface Audio {
  id: string; //Identificatore univoco dell'elemento.
  name: string; //Nome dell'elemento.
  type: string; //Tipo dell'elemento (in questo caso, 'audio').
  track: number; //Traccia audio su cui si trova l'elemento.
  time: number; //Tempo di inizio dell'elemento nel video (in secondi).
  duration: number; //Durata dell'elemento (null indica durata automatica).
  source: string; //Identificatore della fonte audio.
  volume: string; //Volume dell'elemento audio (in percentuale).
  afade_in: number; //tempo inizio fade-in
  afade_in_duration: number; //durata fade-in
  afade_out: number; //tempo  fade-out
  afade_out_duration: number; //durate fade_out
  duckings: Ducking[];
}
export interface Shapes {
  type: string; //Tipo dell'elemento (in questo caso, 'audio').
  track: number; //Traccia audio su cui si trova l'elemento.
  time: number; //Tempo di inizio dell'elemento nel video (in secondi).
  width: number; // larghezza espressa in pixel della figura
  height: number; //altezza espressa in pixel della figura
  x: string; //Coordinata X dell'elemento (percentuale rispetto alla larghezza del video).
  y: string; //Coordinata Y dell'elemento (percentuale rispetto all'altezza del video).
  fill_color: string; //Colore di riempimento dell'elemento (in formato RGBA).
  path: string; //Percorso SVG che definisce la forma dell'elemento.
  animations: Animation[];
}
export interface Image {
  name: string; //Nome dell'elemento.
  type: string; //Tipo dell'elemento (in questo caso, 'immagine').
  track: number; //Traccia  su cui si trova l'elemento.
  time: number; //Tempo di inizio dell'elemento nel video (in secondi).
  duration: number;
  fit: "contain" | "fixed"; //Indica come deve essere ridimensionata l'immagine .
  width: number;//larghezza
  height: number;//altezza
  color_overlay: string; //Colore di overlay sull'immagine (in formato RGBA).
  source: string; //Identificatore percorso del file.
  animations: Animation[];
}
export interface Text {
  name: string; //Nome dell'elemento.
  type: string; //Tipo dell'elemento (in questo caso, 'testo').
  track: number; //Traccia audio su cui si trova l'elemento.
  time: number; //Tempo di inizio dell'elemento nel video (in secondi).
  duration: number;
  x: string; //Coordinata X dell'elemento.
  y: string; //Coordinata Y dell'elemento.
  width: number; //Larghezza del box di testo.
  height: number; //Altezza del box di testo.
  color_overlay: string;
  source: string;
  fade:boolean;
  fade_duration:number;
  text_box_alignment: string; // Allineamento di tutto il testo rispetto lo schermo
  text_alignment: string; //Allineamento orizzontale del testo.
  font_color: string; //Colore di riempimento del testo.
  shadow_color: string; //Colore dell'ombra del testo.
  shadow_blur: string; //Sfocatura dell'ombra (misura in 'vmin').
  shadow_x: string; //Spostamento orizzontale dell'ombra (misura in 'vmin').
  shadow_y: string; //Spostamento verticale dell'ombra (misura in 'vmin').
  animations: Animation[]; //Array di animazioni applicate al testo.
  text: string; //Testo da visualizzare.
  font_family: string; //Famiglia di font utilizzata.
  font_size: number; //Famiglia di font utilizzata.
  line_height: string; //Altezza della linea (percentuale).
}
export interface TextBox {
  fontSize: number;
  lines: string[];
  maxWidth: number;
  totalHeight: number;
  lineWidths: number[];
}
export interface Composition {
  source(source: any): unknown;
  id: string; //Identificatore univoco dell'elemento.
  name: string; //Nome dell'elemento.
  type: string; //Tipo dell'elemento (in questo caso, 'audio').
  track: number; //Traccia audio su cui si trova l'elemento.
  time: number; //Tempo di inizio dell'elemento nel video (in secondi).
  duration: number; //Durata dell'elemento (null indica durata automatica).
  dynamic: boolean; //Indica se l'elemento è dinamico (booleano).
  elements: ElementType[]; //Array di elementi contenuti nella composizione.
}
export interface Animation {
  time: number; //Tempo di inizio dell'elemento nel video (in secondi).
  duration: number; //Durata dell'elemento (null indica durata automatica).
  type: string; //Tipo animazione 
  transition: boolean;
  scope: string; //Ambito dell'animazione (es. 'split-clip',element,composition).
  split: string; //Metodo di suddivisione del testo (es. 'line').
  direction: string; //Direzione dell'animazione
  start_x: string;// coordinata x iniziale
  start_y: string;// coordinata y iniziale
  end_x: string;// coordinata x finale
  end_y: string;// coordinata y finale
  start_scale: string;// percentuale scaling iniziale
  end_scale: string;// percentuale scaling finale
  reversed: boolean;
}
export interface Ducking {
  volume: number; // Volume da applicare durante il periodo di ducking
  start: number; // Tempo di inizio del ducking (in secondi)
  end: number; // Tempo di fine del ducking (in secondi)
}
export interface ElementType {
  type: "image" | "audio" | "animation" | "composition" | "text" | "shape";
}










