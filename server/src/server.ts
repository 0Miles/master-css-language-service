import {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    InitializeResult} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import {GetLastInstance,GetCompletionItem } from './completionProvider'



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
});

connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {

        let lastInstance=GetLastInstance(_textDocumentPosition,documents);

        if(lastInstance.isInstance ==true)
        {
            return GetCompletionItem(lastInstance.lastKey, lastInstance.triggerKey, lastInstance.isStart);
        }
        return [];
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
