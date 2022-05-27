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




export async function getDocumentColors(DocumentColor: DocumentColorParams, documents: TextDocuments<TextDocument>
): Promise<ColorInformation[]> {
    let colors: ColorInformation[] = []

    const documentUri = DocumentColor.textDocument.uri;
    let document = documents.get(documentUri);
    let text = document?.getText() ?? '';

    if (typeof document == undefined) {
        return [];
    }
    const classPattern = /class="([^"]*)"|class='([^']*)'/g;
    let classMatch: RegExpExecArray | null;

    while ((classMatch = classPattern.exec(text)) !== null) {

        const colorPattern = /(?<=[:|])(?:\w*(?:-[\d]{1,2})?(?:\/.?[\d])?\b)/g;
        let colorMatch: RegExpExecArray | null;
        let colorName: string;
        let colorNumber: number;
        let colorAlpha: number;
        //check color

        while ((colorMatch = colorPattern.exec(classMatch[0])) !== null) {
            colorAlpha = 1;
            if (colorMatch[0].split('/').length == 2) {
                colorAlpha = Number('0' + colorMatch[0].split('/')[1]);
            }


            if (colorMatch[0].split('-').length == 1)//:black  black/.5
            {
                colorName = colorMatch[0].split('/')[0];
                if (colorName == 'black') {
                    const colorInformation: ColorInformation = {
                        range: {
                            start: document?.positionAt(classMatch.index + colorMatch.index) ?? Position.create(0, 0),
                            end: document?.positionAt(classMatch.index + colorMatch.index + colorMatch[0].length) ?? Position.create(0, 0)
                        },
                        color: { red: 0, green: 0, blue: 0, alpha: colorAlpha }
                    };
                    colors.push(colorInformation);
                }
                else if (colorName == 'white') {
                    const colorInformation: ColorInformation = {
                        range: {
                            start: document?.positionAt(classMatch.index + colorMatch.index) ?? Position.create(0, 0),
                            end: document?.positionAt(classMatch.index + colorMatch.index + colorMatch[0].length) ?? Position.create(0, 0)
                        },
                        color: { red: 1, green: 1, blue: 1, alpha: colorAlpha }
                    };
                    colors.push(colorInformation);
                }
                else {
                    if (masterCssColors.findIndex(x => x.key == colorName) != -1) {
                        const colorInformation: ColorInformation = {
                            range: {
                                start: document?.positionAt(classMatch.index + colorMatch.index) ?? Position.create(0, 0),
                                end: document?.positionAt(classMatch.index + colorMatch.index + colorMatch[0].length) ?? Position.create(0, 0)
                            },
                            color: getColorsRGBA(colorName, 50, colorAlpha)
                        };
                        colors.push(colorInformation);
                    }
                }

            }
            else if (colorMatch[0].split('-').length == 2) { //:red-60 red-60/.5

                colorName = colorMatch[0].split('-')[0];
                colorNumber = Number(colorMatch[0].split('-')[1].split('/')[0]);


                if (masterCssColors.findIndex(x => x.key == colorName) != -1 && colorNumber > 0 && colorNumber < 100 && colorNumber % 2 == 0) {
                    const colorInformation: ColorInformation = {
                        range: {
                            start: document?.positionAt(classMatch.index + colorMatch.index) ?? Position.create(0, 0),
                            end: document?.positionAt(classMatch.index + colorMatch.index + colorMatch[0].length) ?? Position.create(0, 0)
                        },
                        color: getColorsRGBA(colorName, colorNumber, colorAlpha)
                    };
                    colors.push(colorInformation);
                }
            }

            else if (colorMatch[0].split('-').length != 2) {
                continue;
            }
        }
    }
    return colors;
}

function getColorsRGBA(colorName: string, colorNumber: number, colorAlpha: number = 1): Color {

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

    return { red: r / 255, green: g / 255, blue: b / 255, alpha: colorAlpha };
}

