import {
    TextDocuments,
    TextDocumentPositionParams,
    Position,
    TextDocumentIdentifier,
} from 'vscode-languageserver/node';
import { Range, TextDocument } from 'vscode-languageserver-textdocument';

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

/**
* Check the end of the string is in "MasterCss"
*/
export function IsMasterCss(document: string) {
    let result = { isMasterCss: false, attribute: '', inCurlyBraces: false, quoted: '', text: '' };
    let CurlyBracesMode = false;
    let textSub = '', textReplaceSpace = '';

    let lastClass = document.lastIndexOf('class') ?? -1;
    let lastClassName = document.lastIndexOf('className') ?? -1;
    let CurlyBracesClassName = document.lastIndexOf('className={') ?? -1;

    if (lastClass + lastClassName + CurlyBracesClassName <= -3) {
        return result;
    }

    CurlyBracesMode = CurlyBracesClassName >= (lastClass > CurlyBracesClassName ? lastClass : lastClassName);
    result.inCurlyBraces = CurlyBracesMode;
    result.attribute = lastClass > (lastClassName > CurlyBracesClassName ? lastClassName : CurlyBracesClassName) ? 'class' : 'className';

    if (CurlyBracesMode) {
        textSub = document?.substring(CurlyBracesClassName);
        textSub == null ? '' : textSub;
        textReplaceSpace = textSub.replace(/\s/g, "")
        let clsQuoted = '';


        if (InCurlyBrackets(textSub) == false) {
            return result;
        }
        const backtick = textReplaceSpace.match(/([`])/g);
        const cls = textReplaceSpace.match(/cls(['"`])/g);
        const clsx = textReplaceSpace.match(/clsx\((['"`])/g);
        const clsxClassList = textReplaceSpace.match(/clsx\('[^'.|\r|\n]*',{(['"`])/g);

        if (cls == null && clsx == null && clsxClassList == null && backtick == null) {
            return result;
        }
        if (cls != null) {
            clsQuoted = cls[0];
        }
        else if (clsx != null) {
            clsQuoted = clsx[0];
        }
        else if (clsxClassList != null) {
            clsQuoted = clsxClassList[0];
        }
        else if (backtick != null) {
            clsQuoted = backtick[0]
        }
        clsQuoted.charAt(clsQuoted.length - 1);
        if (textSub.split(clsQuoted).length - 1 >= 2) {
            return result;
        }
        result.quoted = clsQuoted;
        result.text = textSub;

    }
    else {
        textSub = document.substring(lastClass > lastClassName ? lastClass : lastClassName);
        textSub == null ? '' : textSub;
        textReplaceSpace = textSub.replace(/\s/g, "")
        let classQuoted = '', classEqual = '';


        if (lastClass > lastClassName) {
            classEqual = textReplaceSpace.charAt(5);
            classQuoted = textReplaceSpace.charAt(6);
        }
        else if (lastClass <= lastClassName) {
            classEqual = textReplaceSpace.charAt(9);
            classQuoted = textReplaceSpace.charAt(10);
        }

        if (classEqual + classQuoted != '=\'' && classEqual + classQuoted != '=\`' && classEqual + classQuoted != '=\"') {
            return result;
        }
        if (textSub.split(classQuoted).length - 1 >= 2) {
            return result;
        }

        result.quoted = classQuoted;
        result.text = textSub;
    }


    result.isMasterCss = true;
    return result;
}

export function IsClassList(document: string) {
    let result = { isClassList: false, method: '', quoted: '', text: '' };
    let classListMethods = [{ key: 'add', index: -1 }, { key: 'remove', index: -1 }, { key: 'replace', index: -1 }, { key: 'toggle', index: -1 }]
    classListMethods.map(x => { x.index = document.lastIndexOf(x.key) ?? -1; })

    let lastIndex = Math.max(...classListMethods.map(x => x.index));
    if (lastIndex == -1) {
        return result;
    }
    result.method = classListMethods.find(x => x.index == lastIndex)?.key ?? '';


    let textSub = document?.substring(lastIndex);
    textSub == null ? '' : textSub;
    let textReplaceSpace = textSub.replace(/\s/g, "");


    if (!(textReplaceSpace.charAt(result.method.length) == '(' && ['\`', '\"', '\''].includes(textReplaceSpace.charAt(result.method.length + 1)))) {
        return result;
    }
    else if (textSub.indexOf(')') != -1) {
        return result;
    }

    //add("foo", "bar", "baz"  textSub2=, "baz"
    let lastSeparate = textSub.lastIndexOf(',') == -1 ? textSub.lastIndexOf('(') : textSub.lastIndexOf(',');
    let textSub2 = textSub.substring(lastSeparate);
    textSub2 == null ? '' : textSub2;
    let textReplaceSpace2 = textSub2.replace(/\s/g, "");

    let quotedTemp = textReplaceSpace2.charAt(1);

    if (!['\`', '\"', '\''].includes(quotedTemp)) {
        return result;
    }
    else if (textReplaceSpace2.indexOf(quotedTemp, 2) != -1) {
        return result;
    }
    result.text = textSub2.substring(1);
    result.quoted = quotedTemp;
    result.isClassList = true;

    return result;

}

export function IsElement(document: string) {

    let result = { IsElement: false, quoted: '', text: '' };
    let reverseDocument = document.split("").reverse().join("");

    let elementPattern = /^`?([^`]+)`(?=\$|(?:[^\s.`]+\.[^\s=.`]+))/g;
    let elementMatch: RegExpMatchArray | null;
    elementMatch = reverseDocument.match(elementPattern);

    if (elementMatch == null) {
        return result;
    }

    result.IsElement = true;
    result.quoted = '`';
    result.text = elementMatch[0].split("").reverse().join("");
    return result;
}

export function GetMasterInstance(textDocumentPosition: TextDocumentPositionParams, documents: TextDocuments<TextDocument>) {

    const documentUri = textDocumentPosition.textDocument.uri;
    const position = textDocumentPosition.position;
    let document = documents.get(documentUri);
    let language = documentUri.substring(documentUri.lastIndexOf('.') + 1);

    // console.log( GetAllInstance(textDocumentPosition, documents)[0]);

    let instanceRange =
    {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 },
    };

    let line = document?.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line + 1, character: 0 },
    })

    let lineText: string = line == null ? '' : line;

    let text = document?.getText({
        start: { line: 0, character: 0 },
        end: { line: position.line, character: position.character },
    });

    //#region is in class
    let quoted: string = '';
    let dataIsMasterCss = IsMasterCss(text ?? '');
    let dataIsClassList = IsClassList(text ?? '');
    let dataIsElement = IsElement(text ?? '');

    if (!(language == 'tsx' || language == 'ts' || language == 'jsx' || language == 'js')) {
        dataIsClassList.isClassList = false;
    }

    if (dataIsMasterCss.isMasterCss == false && dataIsClassList.isClassList == false && dataIsElement?.IsElement == false) {
        return { isInstance: false, instance: '', range: instanceRange };
    }
    else if (dataIsMasterCss.isMasterCss == true) {
        quoted = dataIsMasterCss.quoted;
    }
    else if (dataIsClassList.isClassList == true) {
        quoted = dataIsClassList.quoted;
    }
    else if (dataIsElement?.IsElement == true) {
        quoted = dataIsElement.quoted;
    }

    //#endregion is in class
    lineText = lineText.replace("[^\\S\\r\\n]+", " ");

    let instanceStart = lineText.substring(0, position.character).lastIndexOf(" ");
    let instanceEnd = lineText.indexOf(" ", position.character);
    instanceEnd = instanceEnd == -1 ? lineText.length - 1 : instanceEnd;


    instanceStart = instanceStart > lineText.substring(0, position.character).lastIndexOf(quoted) ? instanceStart : lineText.substring(0, position.character).lastIndexOf(quoted);
    instanceEnd = instanceEnd > lineText.indexOf(quoted, position.character)
        && lineText.indexOf(quoted, position.character) != -1
        ? lineText.indexOf(quoted, position.character)
        : instanceEnd;

    instanceRange = {
        start: { line: position.line, character: instanceStart + 1 },
        end: { line: position.line, character: instanceEnd },
    }
    let instance = document?.getText(instanceRange) ?? '';

    return { isInstance: true, instance: instance, range: instanceRange };
}
export function GetAllInstance(textDocumentPosition: TextDocumentPositionParams, documents: TextDocuments<TextDocument>, classNameMatches: string[]) {
    let result: {
        classList: { range: Range, instance: string }[],
        classStartIndex: number,
        classEndIndex: number,
        classString: string
    }[] = [];



    const documentUri = textDocumentPosition.textDocument.uri;
    let document = documents.get(documentUri);
    let text = document?.getText() ?? '';

    let classPattern = new RegExp(classNameMatches[0], "g")
    let classPattern2 = /(?<=<\s?\w+\s+)(className\s?=\s?{[\w\s]+)((?:`[^`]+`)|(?:"[^"]+")|(?:'[^']+'))[^}]*}/g;
    let instancePattern = /[^\s:]+:\w*\(?((?<!\\)["'`])((?:\\\1|(?:(?!\1))[\S\s])*)((?<!\\)\1)\)?|[^\s"'`]+/g;

    let classMatch: RegExpExecArray | null;
    let classMatch2: RegExpExecArray | null;
    let instanceMatch: RegExpExecArray | null;

    while ((classMatch = classPattern.exec(text)) !== null) {
        let resultItem: {
            classList: { range: Range, instance: string }[],
            classStartIndex: number,
            classEndIndex: number,
            classString: string
        } = { classList: [], classStartIndex: classMatch.index, classEndIndex: classMatch.index + classMatch[0].length - 1, classString: classMatch[0] };

        while ((instanceMatch = instancePattern.exec(classMatch[2])) !== null) {
            resultItem.classList.push(
                {
                    range: {
                        start: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index) ?? Position.create(0, 0),
                        end: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index + instanceMatch[0].length) ?? Position.create(0, 0)
                    },
                    instance: instanceMatch[0]
                }
            );
        }
        result.push(resultItem);
    }



    console.log(text.charAt(5))
    console.log(text.charAt(171))
    console.log(result)
    return result;
}
export function PositionCheck(documentUri: string, position: Position, documents: TextDocuments<TextDocument>, RegExpList: string[]) {

    let result: {
        IsMatch: boolean,
        PositionIndex: number,
        classStartIndex: number,
        classEndIndex: number,
        classString: string,
        instance: { range: Range, instanceString: string },
        instanceList: { range: Range, instanceString: string }[],
    } = {
        IsMatch: false,
        PositionIndex: 0,
        classStartIndex: 0,
        classEndIndex: 0,
        classString: "",
        instance: { range: { start: Position.create(0, 0), end: Position.create(0, 0) }, instanceString: '' },
        instanceList: [],
    };

    let document = documents.get(documentUri);
    let text = document?.getText() ?? '';
    let positionIndex = document?.offsetAt(position) ?? 0;


    let instancePattern = /[^\s:]+:\w*\(?((?<!\\)["'`])((?:\\\1|(?:(?!\1))[\S\s])*)((?<!\\)\1)\)?|[^\s"'`]+/g;

    let instanceMatch: RegExpExecArray | null;
    let classMatch: RegExpExecArray | null;

    result.PositionIndex = positionIndex;

    RegExpList.forEach(x => {
        let classPattern = new RegExp(x, "g")

        while ((classMatch = classPattern.exec(text)) !== null) {
            if ((classMatch.index <= positionIndex && classMatch.index + classMatch[0].length - 1 >= positionIndex) == true) {
                result.IsMatch = true;
                result.PositionIndex = positionIndex;
                result.classStartIndex = classMatch.index;
                result.classEndIndex = classMatch.index + classMatch[0].length - 1;
                result.classString = classMatch[0];

                while ((instanceMatch = instancePattern.exec(classMatch[2])) !== null) {
                    result.instanceList.push(
                        {
                            range: {
                                start: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index) ?? Position.create(0, 0),
                                end: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index + instanceMatch[0].length) ?? Position.create(0, 0)
                            },
                            instanceString: instanceMatch[0]
                        }
                    );
                    if ((classMatch.index + classMatch[1].length + instanceMatch.index <= positionIndex && classMatch.index + classMatch[1].length + instanceMatch.index + instanceMatch[0].length >= positionIndex) == true) {
                        result.instance = {
                            range: {
                                start: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index) ?? Position.create(0, 0),
                                end: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index + instanceMatch[0].length) ?? Position.create(0, 0)
                            },
                            instanceString: instanceMatch[0]
                        }
                    }
                }

                return result;
            }
            else if (classMatch.index > positionIndex) {
                break;
            }
        }
    })

    return result;
}

export function GetAllClassListInstance(textDocumentPosition: TextDocumentIdentifier, documents: TextDocuments<TextDocument>) {
    let result: {
        classList: { range: Range, instance: string }[],
        classIndex: number,
        classString: string
    }[] = [];

    const documentUri = textDocumentPosition.uri;
    let document = documents.get(documentUri);
    let text = document?.getText() ?? '';

    let classPattern = /(?:((?:add)|(?:remove)|(?:replace)|(?:toggle)))\(([^\)]+)\)/g;
    //let classPattern2 = /((?:`[^`]+`)|(?:"[^"]+")|(?:'[^']+'))+/g;
    let instancePattern = /[^\s:]+:\w*\(?((?<!\\)["'`])((?:\\\1|(?:(?!\1))[\S\s])*)((?<!\\)\1)\)?|[^\s"'`]+/g;

    let classMatch: RegExpExecArray | null;
    let classMatch2: RegExpExecArray | null;
    let instanceMatch: RegExpExecArray | null;

    while ((classMatch = classPattern.exec(text)) !== null) {
        let resultItem: {
            classList: { range: Range, instance: string }[],
            classIndex: number,
            classString: string
        } = { classList: [], classIndex: classMatch.index, classString: classMatch[0] };

        while ((instanceMatch = instancePattern.exec(classMatch[2])) !== null) {
            resultItem.classList.push(
                {
                    range: {
                        start: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index) ?? Position.create(0, 0),
                        end: document?.positionAt(classMatch.index + classMatch[1].length + instanceMatch.index + instanceMatch[0].length) ?? Position.create(0, 0)
                    },
                    instance: instanceMatch[0]
                }
            );
        }
        result.push(resultItem);
    }

    return result;
}


export function InTags(textDocumentPosition: TextDocumentPositionParams, documents: TextDocuments<TextDocument>) {
    let result = {
        inTag: false,
        tagAttrName: '',
        tagIndex: 0,
        tagRange: { start: Position.create(0, 0), end: Position.create(0, 0) },
        tagString: ''
    }
    const documentUri = textDocumentPosition.textDocument.uri;
    let document = documents.get(documentUri);
    let text = document?.getText() ?? '';

    let documentIndex = document?.getText({
        start: { line: 0, character: 0 },
        end: { line: textDocumentPosition.position.line, character: textDocumentPosition.position.character },
    }).length ?? 0;

    let tagPattern = /<\s?\w+(?:\s+(\w+)\s?=(?:'[^']{0,}')?(?:"[^"]{0,}")?(?:`[^`]{0,}`)?(?:{[\s\S]{0,}})?)+\s?>/g;
    let tagAttrNamePattern = /(?:\s?(\w+)\s?=(?:'[^']{0,}')?(?:"[^"]{0,}")?(?:`[^`]{0,}`)?(?:{[\s\S]{0,}})?)/g;
    let tagMatch: RegExpExecArray | null;
    let tagAttrNameMatch: RegExpExecArray | null;

    while ((tagMatch = tagPattern.exec(text)) !== null) {
        if (tagMatch.index <= documentIndex && tagMatch.index + tagMatch[0].length >= documentIndex) {
            while ((tagAttrNameMatch = tagAttrNamePattern.exec(tagMatch[0])) !== null) {
                if (tagMatch.index + tagAttrNameMatch.index <= documentIndex && tagMatch.index + tagAttrNameMatch.index + tagAttrNameMatch[0].length >= documentIndex) {
                    result.tagAttrName = tagAttrNameMatch[1];
                }
            }
            result.inTag = true;
            result.tagIndex = tagMatch.index;
            result.tagRange = {
                start: document?.positionAt(tagMatch.index) ?? Position.create(0, 0),
                end: document?.positionAt(tagMatch.index + tagMatch[0].length) ?? Position.create(0, 0)
            };
            result.tagString = tagMatch[0]

            return result;
        }
    }

    return result;
}


export function RgbToHex(r: number, g: number, b: number) {
    return '#' + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0")
}