import {
    masterStylesKeyValues,
    masterStylesSelectors,
    masterStyleElements,
    masterStylesMedia,
    masterStylesBreakpoints,
    masterStylesOtherKeys,
    masterStylesColors,
    masterStylesType,
    masterStylesSemantic,
    masterStylesCommonValues
} from './constant'

import {
    TextDocuments,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    ColorInformation
} from 'vscode-languageserver/node';
import { Styles } from '@master/styles'
import { TextDocument } from 'vscode-languageserver-textdocument';

export function GetLastInstance(textDocumentPosition: TextDocumentPositionParams, documents: TextDocuments<TextDocument>) {
    const documentUri = textDocumentPosition.textDocument.uri;
    const position = textDocumentPosition.position;

    let classPattern = /(?:(?<=(?:class|className)=(?:'|")(?:[^"']|\s)*)(?:[^"\s])+(?=>\s|\b))|(?:(?<=(?:class|className)=[^"'])[^\s]*)/g;
    let classMatch: RegExpExecArray | null;
    let lastKey = '';

    let document = documents.get(documentUri);
    let line = document?.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line, character: position.character },
    })

    let lineText: string = line == null ? '' : line;
    lineText = lineText.trim();

    let text = document?.getText({
        start: { line: 0, character: 0 },
        end: { line: position.line, character: position.character },
    });
    let lastClass = text?.lastIndexOf('class') ?? -1;
    let lastclassName = text?.lastIndexOf('className') ?? -1;
    let tsxclassName = text?.lastIndexOf('className={') ?? -1;
    let tsxclassNameMode=tsxclassName> (lastClass > lastclassName ? lastClass : lastclassName);

    let textSub = text?.substring(lastClass > lastclassName ? lastClass : lastclassName);
    textSub = textSub == null ? '' : textSub;


    if (tsxclassNameMode) {
        textSub = text?.substring(tsxclassName)== null ? '' : textSub;
        if (InCurlyBrackets(textSub) == false) {
            return { isInstance: false, lastKey: '', triggerKey: '', isStart: false };
        }
        classPattern = /(?:[^"{'\s])+(?=>\s|\b)/g;
    }

    let quotedSingle = textSub.split('\'').length - 1;
    let quotedDouble = textSub.split('\"').length - 1;
    let quotedTemplate = textSub.split('\`').length - 1;
    
    if (!((quotedSingle > 0 || quotedDouble > 0 || quotedTemplate > 0) && (quotedSingle % 2 != 0 || quotedDouble % 2 != 0 || quotedTemplate % 2 != 0))) {
        return { isInstance: false, lastKey: '', triggerKey: '', isStart: false };
    }

    if (textSub.match(classPattern)===null) {
        return { isInstance: false, lastKey: '', triggerKey: '', isStart: false };
    }
    else {
        while ((classMatch = classPattern.exec(textSub)) !== null) {
            lastKey = classMatch[0];
        }
    }

    let triggerKey = lineText.charAt(lineText.length - 1);
    let isStart = position.character == 1 || lineText.charAt(lineText.length - 2) === ' ' || lineText.charAt(lineText.length - 2) === '' || lineText.charAt(lineText.length - 2) === "\"" || lineText.charAt(lineText.length - 2) === "\'" || lineText.charAt(lineText.length - 2) === '{';

    if (lineText.charAt(lineText.length - 2) === ':' && lineText.charAt(lineText.length - 1) === ':') {
        triggerKey = '::';
        isStart = false;
    }

    return { isInstance: true, lastKey: lastKey, triggerKey: triggerKey, isStart: isStart };
}
function InCurlyBrackets(text: string): boolean {
    let curlybrackets = 0;
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == '{') {
            curlybrackets += 1;
        }
        else if (text.charAt(i) == '}') {
            curlybrackets -= 1;
            if (curlybrackets <= 0) {
                return false;
            }
        }
    }
    if (curlybrackets <= 0) {
        return false;
    }
    return true;
}

export function GetCompletionItem(instance: string, triggerKey: string, startWithSpace: boolean) {

    let masterStyleCompletionItem: CompletionItem[] = [];
    let haveValue = instance.split(':').length;
    let key = instance.split(':')[0];
    key=key.trim();
    //console.log(instance+"key "+key);
    let first = instance.split(':')[1];

    const mediaPattern = /[^\\s"]+@+([^\\s:"@]+)/g;
    const elementsPattern = /[^\\s"]+::+([^\\s:"@]+)/g;
    let mediaMatch: RegExpExecArray | null;
    let elementsMatch: RegExpExecArray | null;

    let isColorful = false;
    let isMedia = !(mediaPattern.exec(instance) === null && triggerKey !== '@');
    let isElements = !(elementsPattern.exec(instance) === null && triggerKey !== '::');

    let masterStylesKeys: Array<string | CompletionItem> = [];
    let masterStylesSemanticKeys: Array<string | CompletionItem> = [];
    let masterStylesValues: Array<string | CompletionItem> = [];
    masterStylesKeys = masterStylesKeys.concat(masterStylesOtherKeys);

    Styles.forEach(x => {
        const match = x.matches?.toString().match(/(?:\^([\w\-\@\~\\]+)?(?:\(([a-z]*)\|?.*\))?\??:)/);
        if (x.key) {
            masterStylesKeys.push(x.key);
            if (x.key === key) {
                isColorful = x.colorful;
            }
        }
        if (match?.[1] !== null && !masterStylesKeys.includes(match?.[1] ?? '')) {
            masterStylesKeys.push(match?.[1]?.replace('\\', '') ?? '');
        } else if (match?.[2] !== null && !masterStylesKeys.includes(match?.[2] ?? '')) {
            masterStylesKeys.push(match?.[2]?.replace('\\', '') ?? '');
        }

    });

    masterStylesSemantic.forEach(x => {
        //masterStylesKeys = masterStylesKeys.concat(x.values);
        masterStylesSemanticKeys = masterStylesSemanticKeys.concat(x.values);
    })
    masterStylesKeys = [...new Set(masterStylesKeys)];

    masterStylesKeyValues.forEach(x => {
        if (x.key.includes(key)) {
            masterStylesValues = masterStylesValues.concat(x.values);
            if (!(x.type == 'other' || x.type == 'reserved')) {
                masterStylesType.map(y => {
                    y.type == x.type;
                    masterStylesValues = masterStylesValues.concat(y.values);
                })
            }
        }
    })
    masterStylesValues = [...new Set(masterStylesValues)];




    if (startWithSpace == true && triggerKey !== "@" && triggerKey !== ":") {  //ex " background"
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesKeys, CompletionItemKind.Property, ':'));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesSemanticKeys, CompletionItemKind.Property));
        return masterStyleCompletionItem;
    }
    else if (startWithSpace == true) {  //triggerKey==@|: //ex " :"
        return []
    }

    if (!masterStylesKeys.includes(key) && triggerKey !== ":") {        //show key //ex "backgr"
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesKeys, CompletionItemKind.Property, ':'));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesSemanticKeys, CompletionItemKind.Property));
        return masterStyleCompletionItem;
    }

    if (masterStylesKeys.includes(key) && key !== null && isElements === true) { //show elements
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStyleElements, CompletionItemKind.Property));
        return masterStyleCompletionItem;
    }

    if (masterStylesKeys.includes(key) && key !== null && isMedia === true) { //show media
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesMedia, CompletionItemKind.Property));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesBreakpoints, CompletionItemKind.Property));
        return masterStyleCompletionItem;
    }

    if (masterStylesSemanticKeys.includes(key)) {
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesSelectors, CompletionItemKind.Property));
        return masterStyleCompletionItem;

    }
    else if (masterStylesKeys.includes(key) && haveValue <= 2 && !(haveValue == 2 && triggerKey === ':')) {  //show value
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesValues, CompletionItemKind.Enum));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesCommonValues, CompletionItemKind.Enum));

        if (isColorful) {
            masterStyleCompletionItem = masterStyleCompletionItem.concat(getColorsItem(masterStylesColors));
        }
        return masterStyleCompletionItem;
    }

    if (masterStylesKeys.includes(key) && (haveValue == 2 && triggerKey === ':' || haveValue >= 3) || masterStylesKeyValues.find(x => x.values.includes(key))) { //show select
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesSelectors, CompletionItemKind.Function));
    }
    return masterStyleCompletionItem;
}


function getReturnItem(items: Array<string | CompletionItem>, kind: CompletionItemKind, insertText = ''): CompletionItem[] {
    let masterStyleCompletionItem: CompletionItem[] = [];

    items.forEach(x => {
        if (typeof x === 'string') {
            masterStyleCompletionItem.push({
                label: x,
                kind: kind,
                insertText: x + insertText,
                insertTextMode: 2,
                command: insertText === ':'
                    ? {
                        title: 'triggerSuggest',
                        command: 'editor.action.triggerSuggest'
                    }
                    : undefined
            });
        } else {
            masterStyleCompletionItem.push({
                insertText: x.label + insertText,
                insertTextMode: 2,
                command: insertText === ':'
                    ? {
                        title: 'triggerSuggest',
                        command: 'editor.action.triggerSuggest'
                    }
                    : undefined
                ,
                ...x
            });
        }
    });

    return masterStyleCompletionItem;
}

function getColorsItem(colors: { key: string; color: string; }[]): CompletionItem[] {
    let masterStyleCompletionItem: CompletionItem[] = [];
    colors.forEach(x => {
        for (let i = 1; i <= 49; i++) {
            let r = parseInt(x.color.substring(0, 2), 16);
            let rx = i < 25 ? 255 - r : r;
            r += Math.round(rx * (25 - i) / 25);

            let g = Math.round(parseInt(x.color.substring(2, 4), 16));
            let gx = i < 25 ? 255 - g : g;
            g += Math.round(gx * (25 - i) / 25);
            let b = Math.round(parseInt(x.color.substring(4, 6), 16));
            let bx = i < 25 ? 255 - b : b;
            b += Math.round(bx * (25 - i) / 25);

            masterStyleCompletionItem.push({
                label: x.key + (i === 25 ? '' : '-' + (i*2).toString()),
                documentation: '#' + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0"),
                kind: CompletionItemKind.Color
            })
        }
    });
    masterStyleCompletionItem.push({
        label: 'whtie',
        documentation: '#ffffff',
        kind: CompletionItemKind.Color
    })
    masterStyleCompletionItem.push({
        label: 'black',
        documentation: '#000000',
        kind: CompletionItemKind.Color
    })

    return masterStyleCompletionItem;
}

