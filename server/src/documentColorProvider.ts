import {
    masterCssColors
} from './constant'

import {
    TextDocuments,
    TextDocumentPositionParams,
    ColorInformation,
    Color,
    DocumentColorParams,
    Position
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';




export async function getDocumentColors( DocumentColor: DocumentColorParams,documents: TextDocuments<TextDocument> 
): Promise<ColorInformation[]> {
    let colors: ColorInformation[] = []

    const documentUri = DocumentColor.textDocument.uri;
    let document = documents.get(documentUri);
    let text=document?.getText()??'';

    if(typeof document==undefined){
        return [];
    }
    const classPattern = /(?:(?<=class=(?:"|')(?:[^"']|\s)*)(?:[^"'\s])+(?=>\s|\b))|(?:(?<=class=)[^\s]*)/g;
    let classMatch: RegExpExecArray | null;

    while ((classMatch = classPattern.exec(text)) !== null) {

        const colorPattern = /(?<=[:;])(?:\w*-[\d]{1,2}|(?:black)|(?:white)\b)/g;
        let colorMatch: RegExpExecArray | null;
        let colorName: string;
        let colorNumber: number;
        //check color

        while ((colorMatch = colorPattern.exec(classMatch[0]))!==null) {
            if(colorMatch[0]=='black')
            {
                const colorInformation: ColorInformation = {
                    range: {
                        start: document?.positionAt(classMatch.index+colorMatch.index)??Position.create(0,0),
                        end: document?.positionAt(classMatch.index+colorMatch.index + colorMatch[0].length)??Position.create(0,0)
                    },
                    color: {red:0,green:0,blue:0,alpha:1}
                };
                colors.push(colorInformation);
            }
            else if(colorMatch[0]=='white')
            {
                const colorInformation: ColorInformation = {
                    range: {
                        start: document?.positionAt(classMatch.index+colorMatch.index)??Position.create(0,0),
                        end: document?.positionAt(classMatch.index+colorMatch.index + colorMatch[0].length)??Position.create(0,0)
                    },
                    color: {red:1,green:1,blue:1,alpha:1}
                };
                colors.push(colorInformation);
            }
            else if(colorMatch[0].split('-').length!=2){
                continue;
            }
            
            colorName = colorMatch[0].split('-')[0];
            colorNumber = Number(colorMatch[0].split('-')[1]);
            if (masterCssColors.findIndex(x => x.key == colorName) != -1 && colorNumber > 0 && colorNumber < 100 && colorNumber % 2 == 0) {
                const colorInformation: ColorInformation = {
                    range: {
                        start: document?.positionAt(classMatch.index+colorMatch.index)??Position.create(0,0),
                        end: document?.positionAt(classMatch.index+colorMatch.index + colorMatch[0].length)??Position.create(0,0)
                    },
                    color: getColorsRGBA(colorName, colorNumber)
                };
                colors.push(colorInformation);
            }
        }
    }
    return colors;
}

function getColorsRGBA(colorName: string, colorNumber: number): Color {

    let colorString = masterCssColors.find(x => x.key == colorName)?.color ?? 'null';
    let i = colorNumber / 2;


    let r = parseInt(colorString.substring(0, 2), 16);
    let rx = i < 25 ? 255 - r : r;
    r += Math.round(rx * (25 - i) / 25);

    let g = Math.round(parseInt(colorString.substring(2, 4), 16));
    let gx = i < 25 ? 255 - g : g;
    g += Math.round(gx * (25 - i) / 25);
    let b = Math.round(parseInt(colorString.substring(4, 6), 16));
    let bx = i < 25 ? 255 - b : b;
    b += Math.round(bx * (25 - i) / 25);

    return {red:r/255,green:g/255,blue:b/255,alpha:1};
}

