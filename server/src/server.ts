import {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    InitializeResult,
    DocumentColorParams,
    ColorInformation,
    ColorPresentationParams} from 'vscode-languageserver/node';

import { Range, TextDocument } from 'vscode-languageserver-textdocument';
import {GetLastInstance,GetCompletionItem } from './completionProvider'
import {GetHoverInstance,doHover } from './hoverProvider'
import {getDocumentColors } from './documentColorProvider'



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
                triggerCharacters: [':', '@', '~']
            },
            colorProvider:{},
            hoverProvider:true
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
});

connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {

        let lastInstance=GetLastInstance(_textDocumentPosition,documents);

        if(lastInstance.isInstance ==true)
        {
            return GetCompletionItem(lastInstance.lastKey, lastInstance.triggerKey, lastInstance.isStart,lastInstance.language);
        }
        return [];
    }
);
connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {

        return item;
    }
);


connection.onDocumentColor( 
    async (documentColor: DocumentColorParams): Promise<ColorInformation[]> => {
        return await getDocumentColors(documentColor,documents);
    }
);

connection.onColorPresentation((params: ColorPresentationParams) => {
    return [];
});

connection.onHover(textDocumentPosition => {
    let HoverInstance=GetHoverInstance(textDocumentPosition,documents);
    if(HoverInstance.instance){
        console.log(HoverInstance.instance);

    return doHover(HoverInstance.instance,HoverInstance.range)
    }
    // let document = documents.get(textDocumentPosition.textDocument.uri);
    // const position = textDocumentPosition.position;
    // let line = document?.getText({
    //     start: { line: position.line, character: 0 },
    //     end: { line: position.line, character: position.character },
    // })
    // console.log(line+"12355");

    return null;
});
// s


// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
