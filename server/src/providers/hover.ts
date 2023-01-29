import {
    TextDocuments,
    TextDocumentPositionParams,
    Hover
} from 'vscode-languageserver/node'
import { Range, TextDocument } from 'vscode-languageserver-textdocument'
import MasterCSS, { render } from '@master/css'
import { css_beautify } from 'js-beautify'
import { getDefaultCSSDataProvider, MarkupKind } from 'vscode-css-languageservice'

import { masterCssKeyValues } from '../constant'



export function GetHoverInstance(textDocumentPosition: TextDocumentPositionParams, documents: TextDocuments<TextDocument>) {
    const documentUri = textDocumentPosition.textDocument.uri
    const language = documentUri.substring(documentUri.lastIndexOf('.') + 1)
    const position = textDocumentPosition.position

    const document = documents.get(documentUri)

    let instanceRange =
    {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 },
    }

    const line = document?.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line + 1, character: 0 },
    })

    let lineText: string = line == null ? '' : line

    const text = document?.getText({
        start: { line: 0, character: 0 },
        end: { line: position.line, character: position.character },
    })

    //#region is in class
    const lastClass = text?.lastIndexOf('class') ?? -1
    const lastclassName = text?.lastIndexOf('className') ?? -1
    const tsxclassName = text?.lastIndexOf('className={') ?? -1

    if (lastClass + lastclassName + tsxclassName == -1) {
        return { isInstance: false, instance: '', range: instanceRange, language: language }
    }

    const tsxclassNameMode = tsxclassName >= (lastClass > lastclassName ? lastClass : lastclassName)
    let textSub = text?.substring(lastClass > lastclassName ? lastClass : lastclassName)
    textSub = textSub == null ? '' : textSub


    let classQuoted = '', classIndexAddOne = '', classIndexAddTwo = ''


    if (tsxclassNameMode) {
        textSub = text?.substring(tsxclassName) == null ? '' : textSub
        if (InCurlyBrackets(textSub) == false) {
            return { isInstance: false, instance: '', range: instanceRange, language: language }
        }
    }
    else {
        if (lastClass > lastclassName) {
            classIndexAddOne = textSub.substring(5).trimStart().charAt(0)
            classIndexAddTwo = textSub.substring(5).trimStart().substring(1).trimStart().charAt(0)
        }
        else if (lastClass <= lastclassName) {
            classIndexAddOne = textSub.substring(9).trimStart().charAt(0)
            classIndexAddTwo = textSub.substring(9).trimStart().substring(1).trimStart().charAt(0)
        }
        classQuoted = classIndexAddOne + classIndexAddTwo
        if (classQuoted != '=\'' && classQuoted != '=`' && classQuoted != '="') {
            return { isInstance: false, instance: '', range: instanceRange, language: language }
        }
    }

    const quotedSingle = textSub.split('\'').length - 1
    const quotedDouble = textSub.split('"').length - 1
    const quotedTemplate = textSub.split('`').length - 1
    if (!tsxclassNameMode) {
        if (classQuoted == '=\'' && quotedSingle >= 2) {
            return { isInstance: false, instance: '', range: instanceRange, language: language }
        }
        else if (classQuoted == '="' && quotedDouble >= 2) {
            return { isInstance: false, instance: '', range: instanceRange, language: language }
        }
        else if (classQuoted == '=`' && quotedTemplate >= 2) {
            return { isInstance: false, instance: '', range: instanceRange, language: language }
        }
    }

    if (!((quotedSingle > 0 || quotedDouble > 0 || quotedTemplate > 0) && (quotedSingle % 2 != 0 || quotedDouble % 2 != 0 || quotedTemplate % 2 != 0))) {
        return { isInstance: false, instance: '', range: instanceRange, language: language }
    }
    //#endregion is in class
    lineText = lineText.replace('[^\\S\\r\\n]+', ' ')

    let instanceStart = lineText.substring(0, position.character).lastIndexOf(' ')
    let instanceEnd = lineText.indexOf(' ', position.character)
    instanceEnd = instanceEnd == -1 ? lineText.length - 1 : instanceEnd

    if (tsxclassNameMode) {
        instanceStart = instanceStart > lineText.substring(0, position.character).lastIndexOf('{') ? instanceStart : lineText.substring(0, position.character).lastIndexOf('{')
        instanceEnd = instanceEnd < lineText.indexOf('}', position.character) ? instanceEnd : (lineText.indexOf('}', position.character) == -1 ? instanceEnd : lineText.indexOf('}', position.character))
    }
    else {
        instanceStart = instanceStart > lineText.substring(0, position.character).lastIndexOf(classIndexAddTwo) ? instanceStart : lineText.substring(0, position.character).lastIndexOf(classIndexAddTwo)
        instanceEnd = instanceEnd > lineText.indexOf(classIndexAddTwo, position.character)
            && lineText.indexOf(classIndexAddTwo, position.character) != -1
            ? lineText.indexOf(classIndexAddTwo, position.character)
            : instanceEnd
    }


    instanceRange = {
        start: { line: position.line, character: instanceStart + 1 },
        end: { line: position.line, character: instanceEnd },
    }
    const instance = document?.getText(instanceRange) ?? ''

    return { isInstance: true, instance: instance, range: instanceRange, language: language }
}
function InCurlyBrackets(text: string): boolean {
    let curlybrackets = 0
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == '{') {
            curlybrackets += 1
        }
        else if (text.charAt(i) == '}') {
            curlybrackets -= 1
            if (curlybrackets <= 0) {
                return false
            }
        }
    }
    if (curlybrackets <= 0) {
        return false
    }
    return true
}

export function doHover(instance: string, range: Range, masterCss: MasterCSS = new MasterCSS()): Hover | null {
    const cssDataProvider = getDefaultCSSDataProvider()
    const cssProperties = cssDataProvider.provideProperties()
    
    const masterKey = instance.split(':')[0]

    let originalCssHoverInfo = null
    masterCssKeyValues.forEach(x => {
        const fullKey = x.key[0]
        const originalCssProperty = cssProperties.find(x => x.name == fullKey)
        if (x.key.includes(masterKey)) {
            originalCssHoverInfo = getEntryDescription(originalCssProperty)
        }
    })

    const renderText = render(instance.split(' '), masterCss.config)
    if (!renderText || renderText == ' ') {
        return null
    }

    const result = {
        contents: [{
            language: 'css',
            value: css_beautify(renderText, {
                newline_between_rules: true,
                end_with_newline: true
            })
        },
    ],
        range: range
    }

    if (originalCssHoverInfo) {
        result.contents.push(originalCssHoverInfo)
    }
    return result
}

export const browserNames = {
    E: 'Edge',
    FF: 'Firefox',
    S: 'Safari',
    C: 'Chrome',
    IE: 'IE',
    O: 'Opera'
};

export function getEntryDescription(entry: any) {

    return getEntryMarkdownDescription(entry);
}

function getEntryStatus(status: string) {
    switch (status) {
        case 'experimental':
            return '⚠️ Property is experimental. Be cautious when using it.️\n\n';
        case 'nonstandard':
            return '🚨️ Property is nonstandard. Avoid using it.\n\n';
        case 'obsolete':
            return '🚨️️️ Property is obsolete. Avoid using it.\n\n';
        default:
            return '';
    }
}
export function textToMarkedString(text: string) {
    text = text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function getBrowserLabel(browsers: string[] = []): string | null {
    if (browsers.length === 0) {
        return null;
    }

    return browsers
        .map(b => {
            let result = '';
            const matches = b.match(/([A-Z]+)(\d+)?/)!;

            const name = matches[1];
            const version = matches[2];

            if (name in browserNames) {
                result += browserNames[name as keyof typeof browserNames];
            }
            if (version) {
                result += ' ' + version;
            }
            return result;
        })
        .join(', ');
}
function getEntryMarkdownDescription(entry: any): string {
    if (!entry?.description || entry?.description === '') {
        return '';
    }

    let result: string = '';
    if (entry.status) {
        result += getEntryStatus(entry.status);
    }

    if (typeof entry.description === 'string') {
        result += textToMarkedString(entry.description);
    } else {
        result += entry.description.kind === MarkupKind.Markdown ? entry.description.value : textToMarkedString(entry.description.value);
    }

    const browserLabel = getBrowserLabel(entry.browsers);
    if (browserLabel) {
        result += '\n\n(' + textToMarkedString(browserLabel) + ')';
    }
    if ('syntax' in entry && entry.syntax) {
        result += `\n\nSyntax: ${textToMarkedString(entry.syntax)}`;
    }
    if (entry.references && entry.references.length > 0 ) {
        if (result.length > 0) {
            result += '\n\n';
        }
        result += entry.references.map((r: any) => {
            return `[${r.name}](${r.url})`;
        }).join(' | ');
    }

    return result;
}