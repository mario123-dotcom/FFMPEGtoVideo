
import * as fs from 'fs';
import * as path from 'path';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import { VideoSettings } from './model/model';
import createVideo from './functions/createVideo';


// Promisify exec per l'utilizzo con  async/await
const exec = promisify(execCallback);

/*LA FUNZIONE MAIN E' LA FUNZIONE PRINCIPALE DALLA QUALE (IN PREVISIONE ANCHE DELL'INTERFACCIA) VENGONO ATTIVATE LE FUNZIONI PRINCIPALI DI LETTURA
 DEL FILE JSON E DI ESECUZIONE DEL COMANDO FFMPEG CREATO APPOSITAMENTE*/


async function main() {

  //array che conterrà i comandi ffmpeg da eseguire ( composizioni e comando finale)
  let command:string[]=[];


  //definizione del path del file JSON (sarà selezionabile dall'interfaccia successivamente) 
  const filePath = './src/template/templateDiem.json';

  try {
    //se il percorso del path specificato non esiste stampa un messaggio d'errore
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    //se il percorso risulta corretto definisce l'absolutePath
    const fileContent = fs.readFileSync(absolutePath, 'utf-8'); 

    // parsa il file json e lo inserisce nella variabile "jsonFile"
    const jsonFile: VideoSettings = JSON.parse(fileContent);    

    // chiamata alla funzione "createVideo" che analizzando il file json , produrrà i comandi ffmpeg finali da eseguire
    command = createVideo(jsonFile);

    //funzione che esegue i comandi presenti nell'array
    async function executeCommands(commands: string[]) {
      for (const cmd of commands) {
        try {
          console.log(`Executing command: ${cmd}`);
          const { stdout, stderr } = await exec(cmd);
          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }
          console.log(`stdout: ${stdout}`);
          console.log('Video generato con successo!');
        } catch (error) {
          console.error(`Error: ${error}`);
          break; 
        }
      }
    }

    // esegui i comandi ( attende il termine del comando precedente per passare al successivo)
    await executeCommands(command);


  } catch (error) {
    console.error('Errore:', error);
  }
}


main();
