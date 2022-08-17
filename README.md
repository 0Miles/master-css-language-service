![image](https://raw.githubusercontent.com/master-co/css-language-service/alpha/images/cover.jpg)

The official [Master CSS](https://github.com/master-co/css) Language Service extension for Visual Studio Code upgrades your development experience, and provides many advanced features.

- [Introduction](https://css.master.co)
- [Setup](https://docs.master.co/css/setup)
- [Why Master CSS](https://docs.master.co/css/why-master-css)
- [Github Discussions](https://github.com/master-co/css/discussions)
- [Join Master Discord](https://discord.gg/sZNKpAAAw6)

##### On this page
- [Code-completion](#code-completion)
- [Syntax highlighting](#syntax-highlighting)
- [Generate preview](#generate-preview)
- [Settings](#settings)
  - [`editor.quickSuggestions`](#editorquicksuggestions)
  - [`masterCSS.proxyLanguages`](#mastercssproxylanguages)
  - [`masterCSS.files.exclude`](#mastercssfilesexclude)
  - [`masterCSS.classNameMatches`](#mastercssclassnamematches)
  - [`masterCSS.previewColor = true`](#mastercsspreviewcolor--true)
  - [`masterCSS.previewOnHover = true`](#mastercsspreviewonhover--true)
  - [`masterCSS.suggestions: true`](#mastercsssuggestions-true)

# Code-completion
Smart suggestions for style names, values, semantics and selectors.

![code-completion](https://user-images.githubusercontent.com/33840671/185128193-de6c0550-7fa6-4b2d-842c-72f6b79e6d8f.gif)

# Syntax highlighting
Highlight class names to make them easier to read and identify.

![syntax-highlighting](https://user-images.githubusercontent.com/33840671/185127233-1556414a-2859-425f-a421-4b30ff228b9e.jpg)

Master CSS has pioneered applying syntax highlighting to class names in markup, which solves the problem of unreadable classes that are too long.

# Generate preview
Hover over Master class names to see their CSS generation.

![rendering-preview](https://user-images.githubusercontent.com/33840671/185128766-614f302e-7cc3-4294-9179-76f29069d4a6.gif)

# Settings

## `editor.quickSuggestions`
By default VS Code will not trigger completions when editing "string" content, for example within JSX attribute values. Updating the editor.quickSuggestions setting may improve your experience:
```json
"editor.quickSuggestions": {
    "strings": true
},
```

## `masterCSS.proxyLanguages`
`html`, `css`, `javascript` ...

Proxy one language to another and simulate its behavior.
```json
"masterCSS.proxyLanguages": {
    "plaintext": "html"
},
```

## `masterCSS.files.exclude`
Configure glob patterns to exclude from all Master Language Service features.
```json
"masterCSS.files.exclude": [
    "**/.git/**",
    "**/node_modules/**",
    "**/.hg/**"
],
```

## `masterCSS.classNameMatches`
```json
"masterCSS.classNameMatches": [

],
```

## `masterCSS.previewColor = true`

## `masterCSS.previewOnHover = true`

## `masterCSS.suggestions: true`
