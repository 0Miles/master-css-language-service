import {
    masterCssKeyValues,
    masterCssSelectors,
    masterStyleElements,
    masterCssMedia,
    masterCssOtherKeys,
    masterCssType,
    masterCssCommonValues
} from './constant'

import {
    TextDocuments,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import MasterCSS from '@master/css';

export function GetLastInstance(textDocumentPosition: TextDocumentPositionParams, documents: TextDocuments<TextDocument>) {
    const documentUri = textDocumentPosition.textDocument.uri;
    let language = documentUri.substring(documentUri.lastIndexOf('.') + 1);
    const position = textDocumentPosition.position;

    let classPattern = /(?:[^"{'\s])+(?=>\s|\b)/g;
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


    if (lineText.match(classPattern) === null) {
        return { isInstance: false, lastKey: '', triggerKey: '', isStart: false, language: language };
    }
    else {
        while ((classMatch = classPattern.exec(lineText)) !== null) {
            lastKey = classMatch[0];
        }
    }

    let triggerKey = lineText.charAt(lineText.length - 1);
    let isStart = position.character == 1 || lineText.charAt(lineText.length - 2) === ' ' || lineText.charAt(lineText.length - 2) === '' || lineText.charAt(lineText.length - 2) === "\"" || lineText.charAt(lineText.length - 2) === "\'" || lineText.charAt(lineText.length - 2) === '{';

    if (lineText.charAt(lineText.length - 2) === ':' && lineText.charAt(lineText.length - 1) === ':') {
        triggerKey = '::';
        isStart = false;
    }

    return { isInstance: true, lastKey: lastKey, triggerKey: triggerKey, isStart: isStart, language: language };
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

export function GetCompletionItem(instance: string, triggerKey: string, startWithSpace: boolean, language: string, masterCss: MasterCSS = new MasterCSS()) {

    let masterStyleCompletionItem: CompletionItem[] = [];
    let haveValue = instance.split(':').length;
    let key = instance.split(':')[0];
    key = key.trim();
    let first = instance.split(':')[1];
    let instanceLength = instance.split(':|@').length;
    let last = instance.split(':|@')[instanceLength - 1];

    const mediaPattern = /[^\\s"]+@+([^\\s:"@]+)/g;
    const elementsPattern = /[^\\s"]+::+([^\\s:"@]+)/g;
    let mediaMatch: RegExpExecArray | null;
    let elementsMatch: RegExpExecArray | null;

    let isColorful = false;
    let isMedia = !(mediaPattern.exec(instance) === null && triggerKey !== '@');
    let isElements = !(elementsPattern.exec(instance) === null && triggerKey !== '::');

    let masterCssKeys: Array<string | CompletionItem> = [];
    let masterCssValues: Array<string | CompletionItem> = [];
    masterCssKeys = masterCssKeys.concat(masterCssOtherKeys);

    // Styles.forEach(x => {
    //     const match = x.matches?.toString().match(/(?:\^([\w\-\@\~\\]+)?(?:\(([a-z]*)\|?.*\))?\??:)/);
    //     if (x.key) {
    //         masterCssKeys.push(x.key);
    //         if (x.key === key) {
    //             isColorful = x.colorful;
    //         }
    //     }

    //     if (match?.[1] !== null && !masterCssKeys.includes(match?.[1] ?? '')) {
    //         masterCssKeys.push(match?.[1]?.replace('\\', '') ?? '');
    //     } else if (match?.[2] !== null && !masterCssKeys.includes(match?.[2] ?? '')) {
    //         masterCssKeys.push(match?.[2]?.replace('\\', '') ?? '');
    //     }

    // });

    masterCssKeyValues.forEach(x => {
        masterCssKeys = masterCssKeys.concat(x.key);
        if (x.key.includes(key)) {
            masterCssValues = masterCssValues.concat(x.values.filter(y => !masterCssValues.find(z => (typeof z === 'string' ? z : z.label) === (typeof y === 'string' ? y : y.label))));
            if (x.colorful) {
                isColorful = true;
                const needPushList = masterCssType.find(y => y.type === 'color')?.values.filter(z => !masterCssValues.find(a => (typeof a === 'string' ? a : a.label) === (typeof z === 'string' ? z : z.label)));
                if (needPushList) {
                    masterCssValues = masterCssValues.concat(needPushList);
                }
            }
        }
    })

    masterCssKeys = [...new Set(masterCssKeys)];


    if (startWithSpace == true && triggerKey !== "@" && triggerKey !== ":") {  //ex " background"
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterCssKeys, CompletionItemKind.Property, ':'));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(Object.keys(masterCss.config.semantics ?? {}), CompletionItemKind.Property));

        if (language == 'tsx' || language == 'vue' || language == 'jsx') {
            return HaveDash(key, masterStyleCompletionItem);
        }
        return masterStyleCompletionItem;

    }
    else if (startWithSpace == true) {  //triggerKey==@|: //ex " :"
        return []
    }

    if (!masterCssKeys.includes(key) && triggerKey !== ":") {        //show key //ex "backgr"
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterCssKeys, CompletionItemKind.Property, ':'));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(Object.keys(masterCss.config.semantics ?? {}), CompletionItemKind.Property));
        if (language == 'tsx' || language == 'vue' || language == 'jsx') {
            return HaveDash(key, masterStyleCompletionItem);
        }
        return masterStyleCompletionItem;
    }

    if (masterCssKeys.includes(key) && key !== null && isElements === true) { //show elements
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStyleElements, CompletionItemKind.Property));
        if ((language == 'tsx' || language == 'vue' || language == 'jsx') && triggerKey !== "@" && triggerKey !== ":") {
            return HaveDash(last, masterStyleCompletionItem);
        }
        return masterStyleCompletionItem;
    }

    if (masterCssKeys.includes(key) && key !== null && isMedia === true) { //show media
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterCssMedia, CompletionItemKind.Property));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(Object.keys(masterCss.config.breakpoints ?? {}), CompletionItemKind.Property));
        if ((language == 'tsx' || language == 'vue' || language == 'jsx') && triggerKey !== "@" && triggerKey !== ":") {
            return HaveDash('@' + last, masterStyleCompletionItem);
        }
        return masterStyleCompletionItem;
    }

    if (Object.keys(masterCss.config.semantics ?? {}).includes(key) && !masterCssKeyValues.find(x => x.key.includes(key))) {
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterCssSelectors, CompletionItemKind.Property));
        if ((language == 'tsx' || language == 'vue' || language == 'jsx') && triggerKey !== "@" && triggerKey !== ":") {
            return HaveDash(last, masterStyleCompletionItem);
        }
        return masterStyleCompletionItem;

    }
    else if (masterCssKeys.includes(key) && haveValue <= 2 && !(haveValue == 2 && triggerKey === ':')) {  //show value
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterCssValues, CompletionItemKind.Enum));
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterCssCommonValues, CompletionItemKind.Enum));

        if (isColorful) {
            masterStyleCompletionItem = masterStyleCompletionItem.concat(getColorsItem(masterCss));
        }
        if ((language == 'tsx' || language == 'vue' || language == 'jsx') && triggerKey !== "@" && triggerKey !== ":") {
            return HaveDash(last, masterStyleCompletionItem);
        }
        return masterStyleCompletionItem;
    }

    if (masterCssKeys.includes(key) && (haveValue == 2 && triggerKey === ':' || haveValue >= 3) || masterCssKeyValues.find(x => x.values.includes(key))) { //show select
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterCssSelectors, CompletionItemKind.Function));
    }

    if ((language == 'tsx' || language == 'vue' || language == 'jsx') && triggerKey !== "@" && triggerKey !== ":") {
        return HaveDash(last, masterStyleCompletionItem);
    }
    return masterStyleCompletionItem;
}


function getReturnItem(items: Array<string | CompletionItem>, kind: CompletionItemKind, insertText = ''): CompletionItem[] {
    let masterStyleCompletionItem: CompletionItem[] = [];

    items.forEach(x => {
        if (typeof x === 'string') {
            masterStyleCompletionItem.push({
                label: x + insertText,
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




function getColorsItem(masterCss: MasterCSS = new MasterCSS()): CompletionItem[] {

    let masterStyleCompletionItem: CompletionItem[] = [];

    Object.keys(masterCss.colorsThemesMap)
        .forEach((colorName: string) => {
            const colors = masterCss.colorsThemesMap[colorName];
            Object.keys(colors)
                .forEach((level: string) => {
                    const colorValue: any = masterCss.colorsThemesMap[colorName][level];
                    try {
                        if (level === '') {
                            masterStyleCompletionItem.push({
                                label: colorName,
                                documentation: Object.values<string>(colorValue)[0],
                                kind: CompletionItemKind.Color,
                                sortText: `${colorName}`
                            });
                        } else if (!isNaN(+level)) {
                            masterStyleCompletionItem.push({
                                label: colorName + '-' + level,
                                documentation: Object.values<string>(colorValue)[0],
                                kind: CompletionItemKind.Color,
                                sortText: `${colorName}-${(level).toString().padStart(2, '0')}`
                            });
                        }
                    } catch (_) { }
                });
        });

    return masterStyleCompletionItem;
}

function HaveDash(str: string, itemList: CompletionItem[]): CompletionItem[] {
    let completionItem: CompletionItem[] = [];
    if (str.split('-').length - 1 <= 0) {
        return itemList;
    }
    else {
        let start = str.split('-')[0] + '-';
        itemList.map(x => {
            if (x.label.includes(start)) {
                completionItem.push({
                    label: x.label,
                    kind: x.kind,
                    insertText: x.insertText?.substring(start.length),
                    insertTextMode: x.insertTextMode,
                    command: x.command
                }
                );
            }
        });
        return completionItem;
    }
}

