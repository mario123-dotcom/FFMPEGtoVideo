"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const createVideo_1 = __importDefault(require("./functions/createVideo"));
// Promisify exec per l'utilizzo con  async/await
const exec = (0, util_1.promisify)(child_process_1.exec);
/*LA FUNZIONE MAIN E' LA FUNZIONE PRINCIPALE DALLA QUALE (IN PREVISIONE ANCHE DELL'INTERFACCIA) VENGONO ATTIVATE LE FUNZIONI PRINCIPALI DI LETTURA
 DEL FILE JSON E DI ESECUZIONE DEL COMANDO FFMPEG CREATO APPOSITAMENTE*/
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //array che conterrà i comandi ffmpeg da eseguire ( composizioni e comando finale)
        let command = [];
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
            const jsonFile = JSON.parse(fileContent);
            // chiamata alla funzione "createVideo" che analizzando il file json , produrrà i comandi ffmpeg finali da eseguire
            command = (0, createVideo_1.default)(jsonFile);
            //funzione che esegue i comandi presenti nell'array
            function executeCommands(commands) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const cmd of commands) {
                        try {
                            console.log(`Executing command: ${cmd}`);
                            const { stdout, stderr } = yield exec(cmd);
                            if (stderr) {
                                console.error(`stderr: ${stderr}`);
                            }
                            console.log(`stdout: ${stdout}`);
                            console.log('Video generato con successo!');
                        }
                        catch (error) {
                            console.error(`Error: ${error}`);
                            break;
                        }
                    }
                });
            }
            // esegui i comandi ( attende il termine del comando precedente per passare al successivo)
            yield executeCommands(command);
        }
        catch (error) {
            console.error('Errore:', error);
        }
    });
}
main();
