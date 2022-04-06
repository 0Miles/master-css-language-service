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

import {
    TextDocument
} from 'vscode-languageserver-textdocument';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
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
                triggerCharacters: [':'],
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
let masterStylesKeys = ['bg', 'bg-image', 'bg-position','backdrop-filter','backdrop'];
let masterStylesvalues = ['url(\'\')','center','cover'];
let masterStylesselsets = ['hover', 'link', 'scope'];


function getReturnItem(label:string[],kind:CompletionItemKind): CompletionItem[]{
	let masterStyleCompletionItem:CompletionItem[]=[];
	label.forEach(x => {
		masterStyleCompletionItem.push({
			label: x,
			kind: kind,
		})
	});
	return masterStyleCompletionItem;
}

connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		const documentUri = _textDocumentPosition.textDocument.uri;
		const position = _textDocumentPosition.position;

		let document = documents.get(documentUri);
		let line = document?.getText({
			start: { line: position.line, character: 0 },
			end: { line: position.line, character: position.character +1},
		  })
		  let text:string=line==null?'':line;

		  const classPattern = /(?:(?<=class=(?:")(?:[^"]|\s)*)(?:[^"\s])+(?=>\s|\b))|(?:(?<=class=[^"])[^\s]*)/g;
		  let classMatch: RegExpExecArray | null;
		   let lastKey='';

        if(classPattern.exec(text)===null){
            connection.window.showInformationMessage("Getkey: null");
              return []
          }

		  while ((classMatch = classPattern.exec(text)) !== null) {
			lastKey=classMatch[0];
		  }

		  let masterStyleCompletionItem:CompletionItem[]=[];
          connection.window.showInformationMessage("Getkey: "+lastKey);
          let haveValue=lastKey.split(':').length;
          lastKey=lastKey.split(':')[0];

          if(!masterStylesKeys.includes(lastKey)){
		  masterStyleCompletionItem=masterStyleCompletionItem.concat(getReturnItem(masterStylesKeys,CompletionItemKind.Text));
          }

		 if(masterStylesKeys.includes(lastKey)&&haveValue<=1){
			masterStyleCompletionItem=masterStyleCompletionItem.concat(getReturnItem(masterStylesvalues,CompletionItemKind.Text))
		 } 
         if(masterStylesKeys.includes(lastKey)){
			masterStyleCompletionItem=masterStyleCompletionItem.concat(getReturnItem(masterStylesselsets,CompletionItemKind.Text))
		 } 

		return masterStyleCompletionItem
	}
);


// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {
        if (item.data === 1) {
            item.detail = 'TypeScript details';
            item.documentation = 'TypeScript documentation';
        } else if (item.data === 2) {
            item.detail = 'JavaScript details';
            item.documentation = 'JavaScript documentation';
        }
        return item;
    }
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
