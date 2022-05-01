import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    InitializeResult
} from 'vscode-languageserver/node';

import { Styles } from '@master/styles'

import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;


    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
    hasWorkspaceFolderCapability = !!(
        capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );
    hasDiagnosticRelatedInformationCapability = !!(
        capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation
    );

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,

            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true,
                workDoneProgress: false,
                triggerCharacters: [':', '@', '~'],
                allCommitCharacters: ['.'],
            }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }

});

// The example settings
interface ExampleSettings {
    maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    } else {
        globalSettings = <ExampleSettings>(
            (change.settings.languageServerExample || defaultSettings)
        );
    }

    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'languageServerExample'
        });
        documentSettings.set(resource, result);
    }
    return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {

    // The validator creates diagnostics for all uppercase words length 2 and more
    const text = textDocument.getText();
    const classPattern = /(?:(?<=class=(?:"|')(?:[^"']|\s)*)(?:[^"'\s])+(?=>\s|\b))|(?:(?<=class=)[^\s]*)/g;
    let classMatch: RegExpExecArray | null;

    const diagnostics: Diagnostic[] = [];
    // while (classMatch = classPattern.exec(text)) {

    //     // check problems

    //     // if (classMatch[0].match(/\b[A-Z]+\b/)) {
    //     //     const diagnostic: Diagnostic = {
    //     //         severity: DiagnosticSeverity.Warning,
    //     //         range: {
    //     //             start: textDocument.positionAt(classMatch.index),
    //     //             end: textDocument.positionAt(classMatch.index + classMatch[0].length)
    //     //         },
    //     //         message: `${classMatch[0]} is all uppercase.`,
    //     //         source: 'ex'
    //     //     };
    //     //     if (hasDiagnosticRelatedInformationCapability) {
    //     //         diagnostic.relatedInformation = [
    //     //             {
    //     //                 location: {
    //     //                     uri: textDocument.uri,
    //     //                     range: Object.assign({}, diagnostic.range)
    //     //                 },
    //     //                 message: 'Spelling matters'
    //     //             },
    //     //             {
    //     //                 location: {
    //     //                     uri: textDocument.uri,
    //     //                     range: Object.assign({}, diagnostic.range)
    //     //                 },
    //     //                 message: 'Particularly for names'
    //     //             }
    //     //         ];
    //     //     }
    //     //     diagnostics.push(diagnostic);
    //     // }
    // }

    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
let masterStylesKeys: string[] = [];
let masterStylesOtherKeys = ['cols', 'obj', 'ovf', 'border-left-color', 'border-right-color', 'border-left-color', 'border-top-color', 'border-bottom-color',
    'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
    'left', 'right', 'top', 'bottom', 'center', 'middle', 'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity',
    'saturate', 'sepia'
];

let masterStylesValues: string[] = [];
let masterStylesSelsets = ['lang()', 'any-link', 'link', 'visited', 'target', 'scope', 'hover', 'active', 'focus', 'focus-visible', 'focus-within',
    'autofill', 'enabled', 'disabled', 'read-only', 'read-write', 'placeholder-shown', 'default', 'checked', 'indeterminate', 'valid', 'invalid', 'in-range',
    'out-of-range', 'required', 'optional', 'root', 'empty', 'nth-child()', 'nth-last-child()', 'first-child', 'last-child', 'only-child', 'nth-of-type()',
    'nth-last-of-type()', 'first-of-type', 'last-of-type', 'only-of-type', 'defined', 'first', 'fullscreen', 'host()', 'host-context()', 'is()', 'left', 'not()',
    'right', 'where()'];
let masterStylesMedia = ['all', 'print', 'screen', 'portrait', 'landscape', 'motion', 'reduced-motion', 'media()'];
let masterStylesBreakpoints = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
let masterStyleElements = ['after', 'before', 'backdrop', 'cue', 'first-letter', 'first-line', 'file-selector-button', 'marker', 'part()', 'placeholder'
    , 'selection', 'slotted()', 'scrollbar', 'scrollbar-button', 'scrollbar-thumb', 'scrollbar-track', 'scrollbar-track-piece', 'scrollbar-corner', 'resizer',
    'search-cancel-button', 'search-results-button'];

let masterStylesColors: { key: string; color: string; }[] = [
    // {key:'black',color: '000000'},
    // {key:'white',color: 'ffffff'},
    { key: 'fade', color: '71798e' },
    { key: 'gray', color: '7c7c7e' },
    { key: 'brown', color: '936753' },
    { key: 'orange', color: 'ff6600' },
    { key: 'gold', color: 'ff9d00' },
    { key: 'yellow', color: 'ffc800' },
    { key: 'grass', color: '85d016' },
    { key: 'green', color: '2fb655' },
    { key: 'beryl', color: '00cc7e' },
    { key: 'teal', color: '00ccaa' },
    { key: 'cyan', color: '12d0ed' },
    { key: 'sky', color: '00a6ff' },
    { key: 'blue', color: '0f62fe' },
    { key: 'indigo', color: '4f46e5' },
    { key: 'violet', color: '6316e9' },
    { key: 'purple', color: '8318e7' },
    { key: 'fuchsia', color: 'cc22c9' },
    { key: 'pink', color: 'd92671' },
    { key: 'crimson', color: 'dc143c' },
    { key: 'red', color: 'ed1c24' }];


    
function getReturnItem(label: string[], kind: CompletionItemKind): CompletionItem[] {
    let masterStyleCompletionItem: CompletionItem[] = [];
    label.forEach(x => {
        masterStyleCompletionItem.push({
            label: x,
            kind: kind,
        })
    });
    return masterStyleCompletionItem;
}

function getColorsItem(colors: { key: string; color: string; }[]): CompletionItem[] {
    let masterStyleCompletionItem: CompletionItem[] = [];
    colors.forEach(x => {
        for (let i = 1; i <= 99; i++) {
            let r = parseInt(x.color.substring(0, 2), 16);
            let rx = i < 50 ? 255 - r : r;
            r += Math.round(rx * (50 - i) / 50);

            let g = Math.round(parseInt(x.color.substring(2, 4), 16));
            let gx = i < 50 ? 255 - g : g;
            g += Math.round(gx * (50 - i) / 50);
            let b = Math.round(parseInt(x.color.substring(4, 6), 16));
            let bx = i < 50 ? 255 - b : b;
            b += Math.round(bx * (50 - i) / 50);

            masterStyleCompletionItem.push({
                label: x.key + (i === 50 ? '' : '-' + i.toString()),
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

function doCompletion(instance: string, triggerKey: string, startWithSpace: boolean): CompletionItem[] {

    let masterStyleCompletionItem: CompletionItem[] = [];
    let haveValue = instance.split(':').length;
    let key = instance.split(':')[0];
    let first = instance.split(':')[1];

    const mediaPattern = /[^\\s"]+@+([^\\s:"@]+)/g;
    const elementsPattern = /[^\\s"]+::+([^\\s:"@]+)/g;
    let mediaMatch: RegExpExecArray | null;
    let elementsMatch: RegExpExecArray | null;

    let isColorful = false;
    let isMedia = !(mediaPattern.exec(instance) === null && triggerKey !== '@');
    let isElements = !(elementsPattern.exec(instance) === null && triggerKey !== '::');


    masterStylesKeys = [];
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
    masterStylesKeys = masterStylesKeys.concat(masterStylesOtherKeys);

    if (startWithSpace == true && triggerKey !== "@" && triggerKey !== ":") {
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesKeys, CompletionItemKind.Property));
        return masterStyleCompletionItem;
    }
    else if (startWithSpace == true) {
        return []
    }

    if (!masterStylesKeys.includes(key) && triggerKey !== ":") {        //show key
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesKeys, CompletionItemKind.Property));
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


    if (masterStylesKeys.includes(key) && haveValue <= 2 && !(haveValue == 2 && triggerKey === ':')) {  //show value
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesValues, CompletionItemKind.Property));
        if (isColorful) {
            masterStyleCompletionItem = masterStyleCompletionItem.concat(getColorsItem(masterStylesColors));
        }
    }
    connection.window.showInformationMessage("haveValue: " + haveValue );
    if (masterStylesKeys.includes(key) && !masterStylesSelsets.includes(first) &&( (haveValue == 2 && triggerKey === ':') || (haveValue == 3 && triggerKey !== ':'))) { //show select
        masterStyleCompletionItem = masterStyleCompletionItem.concat(getReturnItem(masterStylesSelsets, CompletionItemKind.Property));
    }


    return masterStyleCompletionItem;
}
 
connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
        const documentUri = _textDocumentPosition.textDocument.uri;
        const position = _textDocumentPosition.position;

        let document = documents.get(documentUri);
        let line = document?.getText({
            start: { line: position.line, character: 0 },
            end: { line: position.line, character: position.character },
        })
        let text: string = line == null ? '' : line;

        const classPattern = /(?:(?<=class=(?:")(?:[^"]|\s)*)(?:[^"\s])+(?=>\s|\b))|(?:(?<=class=[^"])[^\s]*)/g;
        let classMatch: RegExpExecArray | null;
        let lastKey = '';

        if (classPattern.exec(text) === null) {
            return []
        }

        while ((classMatch = classPattern.exec(text)) !== null) {
            lastKey = classMatch[0];
        }

        if (text.charAt(text.length - 2) === ':') {
            return doCompletion(lastKey, text.substring(text.length - 2, text.length), text.charAt(text.length - 3) === ' ')
        }
        return doCompletion(lastKey, text.charAt(text.length - 1), text.charAt(text.length - 2) === ' ')
    }
);

connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {

        return item;
    }
);
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
