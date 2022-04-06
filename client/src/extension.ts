import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, ExtensionContext, Disposable, CompletionItemKind, CompletionItem, TextDocument, Position, Range, languages } from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;


let masterStylesKeys = ['bg', 'bg-image', 'bg-position'];
const completionTriggerChars = ['"', " ", "\n", "b"];

const disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {

    // disposables.push(registerCompletionProvider('html', /class="([^"]*)/m));
    // context.subscriptions.push(...disposables);


    // The server is implemented in node
    const serverModule = context.asAbsolutePath(
        path.join('server', 'out', 'server.js')
    );
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for html documents
        documentSelector: [{ scheme: 'file', language: 'html' }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
        }
    };

    // Create the language client and start the client.
    client = new LanguageClient(
        'masterStyles',
        'Master Styles',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    unregisterProviders(disposables);

    if (!client) {
        return undefined;
    }
    return client.stop();
}

// const registerCompletionProvider = (
//     languageSelector: string,
//     classMatchRegex: RegExp,
//     classPrefix = "",
//     splitChar = " "
// ) => languages.registerCompletionItemProvider(languageSelector, {
//     provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
//         const start: Position = new Position(position.line, 0);
//         const range: Range = new Range(start, position);
//         const text: string = document.getText(range);

//         // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
//         const rawClasses: RegExpMatchArray | null = text.match(classMatchRegex);
//         if (!rawClasses || rawClasses.length === 1) {
//             return [];
//         }

//         // Will store the classes found on the class attribute
//         const classesOnAttribute = rawClasses[1].split(splitChar);

//         // Creates a collection of CompletionItem based on the classes already cached
//         const completionItems = masterStylesKeys.map((masterStylesKey) => {
//             const completionItem = new CompletionItem(masterStylesKey, CompletionItemKind.Variable);

//             completionItem.filterText = masterStylesKey;
//             completionItem.insertText = masterStylesKey;

//             return completionItem;
//         });

//         // Removes from the collection the classes already specified on the class attribute
//         for (const classOnAttribute of classesOnAttribute) {
//             for (let j = 0; j < completionItems.length; j++) {
//                 if (completionItems[j].insertText === classOnAttribute) {
//                     completionItems.splice(j, 1);
//                 }
//             }
//         }

//         return completionItems;
//     },
// }, ...completionTriggerChars);

function unregisterProviders(disposables: Disposable[]) {
    disposables.forEach(disposable => disposable.dispose());
    disposables.length = 0;
}
