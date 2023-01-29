import MasterCSSCompiler from '@master/css-compiler'
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
    ColorPresentationParams
} from 'vscode-languageserver/node'

import { WorkspaceFolder } from 'vscode-languageserver'
import MasterCSS from '@master/css'

import * as minimatch from 'minimatch'

import { TextDocument } from 'vscode-languageserver-textdocument'
import { GetLastInstance, GetCompletionItem, GetConfigColorsCompletionItem } from './providers/completion'
import { doHover } from './providers/hover'
import { PositionCheck } from './position-check'
import { GetDocumentColors, GetColorPresentation, GetConfigFileColorRender } from './providers/color'
import * as path from 'path'



const connection = createConnection(ProposedFeatures.all)
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

let hasConfigurationCapability = false
let hasWorkspaceFolderCapability = false
let hasDiagnosticRelatedInformationCapability = false
let settings: MasterCSSSettings

let MasterCSSObject: MasterCSS | undefined
let configFileLocation: string = ''

// The example settings
interface MasterCSSSettings {
    // eslint-disable-next-line @typescript-eslint/ban-types
    languages: {},
    classNameMatches: string[],
    files: { exclude: string[] },
    suggestions: boolean,
    PreviewOnHovers: boolean,
    PreviewColor: boolean,
    configFileLocation: string
}
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: MasterCSSSettings = {
    languages: [
        'html',
        'php',
        'javascript',
        'typescript',
        'javascriptreact',
        'typescriptreact',
        'vue',
        'svelte',
        'rust'
    ],
    classNameMatches: [
        '(class(?:Name)?\\s?=\\s?)((?:\"[^\"]+\")|(?:\'[^\']+\')|(?:`[^`]+`))',
        '(class(?:Name)?={)([^}]*)}',
        '(?:(\\$|(?:(?:element|el|style)\\.[^\\s.`]+)`)([^`]+)`)',
        '(classList.(?:add|remove|replace|replace|toggle)\\()([^)]*)\\)',
        '(template\\s*\\:\\s*)((?:\"[^\"]+\")|(?:\'[^\']+\')|(?:`[^`]+`))',
        '(?<=classes\\s*(?:=|:)\\s*{[\\s\\S]*)([^\']*)(\'[^\']*\')',
        '(?<=classes\\s*(?:=|:)\\s*{[\\s\\S]*)([^\"]*)(\"[^\"]*\")',
        '(?<=classes\\s*(?:=|:)\\s*{[\\s\\S]*)([^`]*)(`[^`]*`)'
    ],
    files: { exclude: ['**/.git/**', '**/node_modules/**', '**/.hg/**'] },
    suggestions: true,
    PreviewOnHovers: true,
    PreviewColor: true,
    configFileLocation: ''
}
let globalSettings: MasterCSSSettings = defaultSettings

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<MasterCSSSettings>> = new Map()

connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear()
    } else {
        globalSettings = <MasterCSSSettings>(
            (change.settings.masterCSS || defaultSettings)
        )
    }

    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument)
})

async function getDocumentSettings(resource: string): Promise<MasterCSSSettings> {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings)
    }
    let result = documentSettings.get(resource)

    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'masterCSS'
        })
        documentSettings.set(resource, result)
    }    
    return result
}

// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri)
})

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidOpen(change => {
    validateTextDocument(change.document)
})

documents.onDidSave(async change => {
    if (path.parse(change.document.uri).name === 'master.css') {
        await loadMasterCssConfig(change.document.uri)
    }
})

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    // In this simple example we get the settings for every validate run.
    settings = await getDocumentSettings(textDocument.uri)
    await loadMasterCssConfig(textDocument.uri)
}

async function loadMasterCssConfig(resource: string) {
    const workspaceFolders = await connection.workspace.getWorkspaceFolders()
    let root: WorkspaceFolder | undefined
    if (workspaceFolders?.length === 1) {
        root = workspaceFolders[0]
    } else {
        root = workspaceFolders?.find(x => resource.includes(x.uri))
    }
    if (root?.uri) {
        try {
            try {
                const uri2path = await import('file-uri-to-path')
                configFileLocation = path.join(uri2path(root.uri.replace('%3A', ':')), settings.configFileLocation)
                const compiler = await new MasterCSSCompiler({ cwd: configFileLocation })
                const config: any = compiler.readConfig()
                MasterCSSObject = new MasterCSS({ config })
            } catch (_) {
                MasterCSSObject = new MasterCSS()
            }
        } catch (_) { /* empty */ }
    }
}

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities


    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    )
    hasWorkspaceFolderCapability = !!(
        capabilities.workspace && !!capabilities.workspace.workspaceFolders
    )
    hasDiagnosticRelatedInformationCapability = !!(
        capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation
    )

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,

            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true,
                workDoneProgress: false,
                triggerCharacters: [':', '@', '~', '\'']
            },
            colorProvider: {},
            hoverProvider: true
        }
    }
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        }
    }
    return result
})

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(DidChangeConfigurationNotification.type, undefined)
    }
})

connection.onCompletion(
    (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
        if (settings.suggestions == true && CheckFilesExclude(textDocumentPosition.textDocument.uri)) {

            const inMasterCSS = PositionCheck(textDocumentPosition.textDocument.uri, textDocumentPosition.position, documents, settings.classNameMatches).IsMatch

            const lastInstance = GetLastInstance(textDocumentPosition, documents)
            if (lastInstance.isInstance == true && inMasterCSS == true) {
                return GetCompletionItem(lastInstance.lastKey, lastInstance.triggerKey, lastInstance.isStart, lastInstance.language, MasterCSSObject)
            } else if (lastInstance.isInstance == true && lastInstance.isConfigColorsBlock == true) {
                return GetConfigColorsCompletionItem(MasterCSSObject)
            }
        }
        return []
    }
)
connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {

        return item
    }
)


connection.onDocumentColor(
    async (documentColor: DocumentColorParams): Promise<ColorInformation[]> => {
        if (settings == null) {
            return []
        }
        if (settings.PreviewColor == true && CheckFilesExclude(documentColor.textDocument.uri)) {
            let colorInformation = await GetDocumentColors(documentColor, documents, settings.classNameMatches, MasterCSSObject)        
            colorInformation = colorInformation.concat(await GetConfigFileColorRender(documentColor, documents, MasterCSSObject))

            return colorInformation
        }
        return []
    })

connection.onColorPresentation((params: ColorPresentationParams) => {
    if (settings.PreviewColor == true && CheckFilesExclude(params.textDocument.uri)) {
        const colorRender = ['(?<=colors:\\s*{\\s*.*)([^}]*)}']
        const isColorRender = PositionCheck(params.textDocument.uri, params.range.start, documents, colorRender)

        return GetColorPresentation(params, isColorRender.IsMatch)
    }
    return []
})

connection.onHover(textDocumentPosition => {
    if (settings.PreviewOnHovers == true && CheckFilesExclude(textDocumentPosition.textDocument.uri)) {
        const HoverInstance = PositionCheck(textDocumentPosition.textDocument.uri, textDocumentPosition.position, documents, settings.classNameMatches)
        if (HoverInstance.IsMatch) {
            return doHover(HoverInstance.instance.instanceString, HoverInstance.instance.range, MasterCSSObject)
        }
    }
    return null
})

function CheckFilesExclude(path: string): boolean {
    for (const exclude of settings.files.exclude) {
        if (minimatch(path, exclude)) {
            return false
        }
    }
    return true
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection)

// Listen on the connection
connection.listen()
