interface MasterStylesKey {
    key: string[];
    type: string;
    colorful: boolean,
    values: string[];
}

enum MasterStyleKeyType {
    'color', 'other', 'reserved'
}

export const masterStylesSelectors = ['lang()', 'any-link', 'link', 'visited', 'target', 'scope', 'hover', 'active', 'focus', 'focus-visible', 'focus-within',
    'autofill', 'enabled', 'disabled', 'read-only', 'read-write', 'placeholder-shown', 'default', 'checked', 'indeterminate', 'valid', 'invalid', 'in-range',
    'out-of-range', 'required', 'optional', 'root', 'empty', 'nth-child()', 'nth-last-child()', 'first-child', 'last-child', 'only-child', 'nth-of-type()',
    'nth-last-of-type()', 'first-of-type', 'last-of-type', 'only-of-type', 'defined', 'first', 'fullscreen', 'host()', 'host-context()', 'is()', 'left', 'not()',
    'right', 'where()'
];
export const masterStyleElements = ['after', 'before', 'backdrop', 'cue', 'first-letter', 'first-line', 'file-selector-button', 'marker', 'part()', 'placeholder'
    , 'selection', 'slotted()', 'scrollbar', 'scrollbar-button', 'scrollbar-thumb', 'scrollbar-track', 'scrollbar-track-piece', 'scrollbar-corner', 'resizer',
    'search-cancel-button', 'search-results-button'
];
export const masterStylesMedia = ['all', 'print', 'screen', 'portrait', 'landscape', 'motion', 'reduced-motion', 'media()'];
export const masterStylesBreakpoints = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
export const masterStylesOtherKeys = ['cols', 'obj', 'ovf', 'border-left-color', 'border-right-color', 'border-left-color', 'border-top-color', 'border-bottom-color',
    'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
    'left', 'right', 'top', 'bottom', 'center', 'middle', 'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity',
    'saturate', 'sepia'
];
export const masterStylesColors = [
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
    { key: 'red', color: 'ed1c24' }
];

export const masterStylesKeyValues: MasterStylesKey[] = [
    //APPEARANCE
    {
        key: ['font-color', 'font', 'f'],
        type: 'color',
        colorful: true,
        values: []
    },
    {
        key: ['accent-color', 'accent'],
        type: 'color',
        colorful: true,
        values: []
    },
    {
        key: ['appearance'],
        type: 'other',
        colorful: false,
        values: ['none', 'auto', 'menulist-button', 'textfield', 'button', 'searchfield', 'textarea', 'push-button', 'slider-horizontal', 'checkbox', 'radio', 'square-button', 'menulist', 'listbox', 'meter', 'progress-bar']
    },
    {
        key: ['caret-color', 'caret'],
        type: 'color',
        colorful: true,
        values: ['transparent']
    },
    {
        key: ['cursor'],
        type: 'other',
        colorful: false,
        values: ['auto', 'alias', 'all-scroll', 'cell', 'col-resize', 'context-menu', 'copy', 'crosshair', 'default', 'e-resize', 'ew-resize', 'grab', 'grabbing', 'help', 'move', 'n-resize', 'ne-resize', 'nesw-resize', 'no-drop', 'none', 'not-allowed', 'ns-resize', 'nw-resize', 'nwse-resize', 'pointer', 'progress', 'row-resize', 's-resize', 'se-resize', 'sw-resize', 'text', 'vertical-text', 'w-resize', 'wait', 'zoom-in', 'zoom-out']
    },


    //LAYOUT
    {
        key: ['box-decoration-break', 'box'],
        type: 'other',
        colorful: false,
        values: ['slice', 'clone']
    },
    {
        key: ['break-after', 'break-before'],
        type: 'other',
        colorful: false,
        values: ['avoid-column', 'column', 'left', 'page', 'recto', 'right', 'recto', 'verso', 'auto', 'avoid', 'avoid-column', 'avoid-page', 'revert']
    },
    {
        key: ['break-inside'],
        type: 'other',
        colorful: false,
        values: ['auto', 'avoid', 'avoid-column', 'avoid-page', 'revert']
    },
    {
        key: ['clear'],
        type: 'other',
        colorful: false,
        values: ['both', 'left', 'none', 'right']
    },
    {
        key: ['columns', 'cols'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['column-span', 'col-span'],
        type: 'other',
        colorful: false,
        values: ['all', 'none']
    },
    {
        key: ['direction'],
        type: 'other',
        colorful: false,
        values: ['ltr', 'rtl']
    },
    {
        key: ['display', 'd'],
        type: 'other',
        colorful: false,
        values: ['flex', 'grid', 'inline', 'none', 'block', 'table', 'contents', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table', 'table-cell', 'table-caption', 'flow-root', 'list-item', 'table-row', 'table-column', 'table-row-group', 'table-column-group', 'table-header-group', 'table-footer-group']
    },
    {
        key: ['float'],
        type: 'other',
        colorful: false,
        values: ['left', 'none', 'right']
    },
    {
        key: ['inset'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['isolation'],
        type: 'other',
        colorful: false,
        values: ['auto', 'isolate']
    },
    {
        key: ['overflow', 'overflow-x', 'overflow-y'],
        type: 'other',
        colorful: false,
        values: ['auto', 'hidden', 'overlay', 'scroll', 'visible', 'clip']
    },
    {
        key: ['position'],
        type: 'other',
        colorful: false,
        values: ['relative', 'absolute', 'static', 'fixed', 'sticky']
    },
    {
        key: ['z-index', 'z'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    //FLEX
    {
        key: ['flex'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['flex-basis'],
        type: 'other',
        colorful: false,
        values: ['100%', 'full', 'fit', 'fit-content', 'max', 'max-content', 'min', 'min-content']
    },
    {
        key: ['flex-direction', 'flex'],
        type: 'other',
        colorful: false,
        values: ['column', 'row', 'column-reverse', 'row-reverse']
    },
    {
        key: ['flex-grow', 'flex-shrink'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['flex-wrap', 'flex'],
        type: 'other',
        colorful: false,
        values: ['wrap', 'wrap-reverse', 'nowrap']
    },
    //GRID
    {
        key: ['grid'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['grid-auto-columns', 'grid-auto-cols'],
        type: 'other',
        colorful: false,
        values: ['auto', 'min-content', 'max-content', 'minmax(,)']
    },
    {
        key: ['grid-auto-flow'],
        type: 'other',
        colorful: false,
        values: ['row', 'column', 'dense', 'row;dense', 'column;dense']
    },
    {
        key: ['grid-auto-rows'],
        type: 'other',
        colorful: false,
        values: ['auto', 'min-content', 'max-content', 'minmax(,)']
    },
    {
        key: ['grid-column', 'grid-col'],
        type: 'other',
        colorful: false,
        values: ['row', 'column', 'dense', 'row;dense', 'column;dense']
    },
    {
        key: ['grid-columns', 'grid-cols'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['grid-row', 'grid-row-span', 'grid-row-start', 'grid-row-end'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['grid-rows'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['grid-template'],
        type: 'other',
        colorful: false,
        values: ['none']
    },
    {
        key: ['grid-template-areas'],
        type: 'other',
        colorful: false,
        values: ['none']
    },
    {
        key: ['grid-template-columns', 'grid-template-cols'],
        type: 'other',
        colorful: false,
        values: ['none', 'max', 'max-content', 'min', 'min-content', 'repeat(,)', 'fit-content()', 'minmax()']
    },
    {
        key: ['grid-template-rows'],
        type: 'other',
        colorful: false,
        values: ['none', 'max', 'max-content', 'min', 'min-content', 'repeat(,)', 'fit-content()', 'minmax()']
    },
    //GRID AND FLEXBOX
    {
        key: ['align-content'],
        type: 'other',
        colorful: false,
        values: ['space-around', 'space-between', 'space-evenly', 'normal', 'baseline', 'center', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['align-items'],
        type: 'other',
        colorful: false,
        values: ['self-start', 'self-end', 'normal', 'baseline', 'center', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['align-self'],
        type: 'other',
        colorful: false,
        values: ['auto', 'self-start', 'self-end', 'normal', 'baseline', 'center', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['justify-content'],
        type: 'other',
        colorful: false,
        values: ['space-around', 'space-between', 'space-evenly', 'normal', 'left', 'center', 'right', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['justify-items'],
        type: 'other',
        colorful: false,
        values: ['self-start', 'self-end', 'normal', 'left', 'center', 'right', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['justify-self'],
        type: 'other',
        colorful: false,
        values: ['auto', 'self-start', 'self-end', 'normal', 'left', 'center', 'right', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['order', 'o'],
        type: 'other',
        colorful: false,
        values: ['first', 'last']
    },
    {
        key: ['place-content-content'],
        type: 'other',
        colorful: false,
        values: ['space-around', 'space-between', 'space-evenly', 'normal', 'baseline', 'center', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['place-content-items'],
        type: 'other',
        colorful: false,
        values: ['self-start', 'self-end', 'normal', 'baseline', 'center', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    {
        key: ['place-content-self'],
        type: 'other',
        colorful: false,
        values: ['auto', 'self-start', 'self-end', 'normal', 'baseline', 'center', 'stretch', 'start', 'end', 'flex-start', 'flex-end']
    },
    //TABLES
    {
        key: ['border-collapse', 'border'],
        type: 'other',
        colorful: false,
        values: ['collapse', 'separate']
    },
    {
        key: ['table-layout'],
        type: 'other',
        colorful: false,
        values: ['auto', 'fixed']
    },
    //MEDIA
    {
        key: ['object-fit'],
        type: 'other',
        colorful: false,
        values: ['none']
    },
    {
        key: ['object-fit', 'object', 'obj'],
        type: 'other',
        colorful: false,
        values: ['contain', 'cover', 'fill', 'scale-down']
    },
    {
        key: ['object-position', 'object', 'obj'],
        type: 'other',
        colorful: false,
        values: ['top', 'bottom', 'left', 'right', 'center']
    },
    //FONT
    {
        key: ['font', 'f'],
        type: 'other',
        colorful: false,
        values: ['caption', 'icon', 'menu', 'message-box', 'small-caption', 'status-bar']
    },
    {
        key: ['font-color', 'font', 'f'],
        type: 'color',
        colorful: true,
        values: []
    },
    {
        key: ['font-family', 'font', 'f'],
        type: 'other',
        colorful: false,
        values: ['serif', 'mono', 'sans']
    },
    {
        key: ['font-size', 'font', 'f'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['font-style'],
        type: 'other',
        colorful: false,
        values: ['oblique;deg']
    },
    {
        key: ['font-style', 'font', 'f'],
        type: 'other',
        colorful: false,
        values: ['normal', 'italic', 'oblique']
    },
    {
        key: ['font-variant-numeric', 'font', 'f'],
        type: 'other',
        colorful: false,
        values: ['normal', 'ordinal', 'slashed-zero', 'lining-nums', 'oldstyle-nums', 'proportional-nums', 'tabular-nums', 'diagonal-fractions', 'stacked-fractions']
    },
    {
        key: ['font-weight', 'font', 'f'],
        type: 'other',
        colorful: false,
        values: ['thin', 'extralight', 'light', 'regular', 'medium', 'semibold', 'bold', 'extrabold', 'heavy', 'normal', 'lighter', 'border']
    },
    {
        key: ['font', 'f'],
        type: 'other',
        colorful: false,
        values: ['antialiased', 'subpixel-antialiased']
    },
    //TEXT
    {
        key: ['text-align', 'text', 't'],
        type: 'other',
        colorful: false,
        values: ['start', 'end', 'left', 'right', 'center', 'justify']
    },
    {
        key: ['text-decoration', 'text', 't'],
        type: 'other',
        colorful: false,
        values: ['underline;', 'line-through;', 'overline;']
    },
    {
        key: ['text-decoration-color', 'text-decoration'],
        type: 'color',
        colorful: true,
        values: []
    },
    {
        key: ['text-decoration-line', 'text', 't'],
        type: 'other',
        colorful: false,
        values: ['none', 'underline', 'overline', 'line-through']
    },
    {
        key: ['text-decoration-style', 'text', 't'],
        type: 'other',
        colorful: false,
        values: ['dashed', 'dotted', 'double', 'solid', 'wavy']
    },
    {
        key: ['text-decoration-thickness'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['text-fill-color', 'text-fill'],
        type: 'color',
        colorful: true,
        values: []
    },
    {
        key: ['text-indent'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['text-orientation', 'text', 't'],
        type: 'other',
        colorful: false,
        values: ['mixed', 'sideways', 'sideways-right', 'upright', 'use-glyph-orientation']
    },
    {
        key: ['text-overflow', 'text', 't'],
        type: 'other',
        colorful: false,
        values: ['clip', 'ellipsis']
    },
    {
        key: ['text-shadow'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['text', 't'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['text-stroke'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['text-stroke-color', 'text-stroke'],
        type: 'color',
        colorful: true,
        values: []
    },
    {
        key: ['text-stroke-width', 'text-stroke'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['text-transform'],
        type: 'other',
        colorful: false,
        values: ['none']
    },
    {
        key: ['text-transform', 'text', 't'],
        type: 'other',
        colorful: false,
        values: ['capitalize', 'lowercase', 'uppercase']
    },
    {
        key: ['text-underline-offset'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['text-rendering'],
        type: 'other',
        colorful: false,
        values: ['auto']
    },
    {
        key: ['text-rendering', 't'],
        type: 'other',
        colorful: false,
        values: ['optimizeSpeed', 'optimizeLegibility', 'geometricPrecision']
    },
    //LIST STYLE
    {
        key: ['list-style'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['list-style-image', 'list-style'],
        type: 'other',
        colorful: false,
        values: ['url()', 'linear-gradient()', 'radial-gradient()', 'repeating-linear-gradient()', 'repeating-radial-gradient()', 'conic-gradient()']
    },
    {
        key: ['list-style-position', 'list-style'],
        type: 'other',
        colorful: false,
        values: ['inside', 'outside']
    },
    {
        key: ['list-style-type'],
        type: 'other',
        colorful: false,
        values: ['circle', 'square', 'decimal-leading-zero', 'lower-roman', 'lower-greek', 'lower-alpha', 'lower-latin', 'upper-roman', 'upper-alpha', 'upper-latin', 'arabic-indic', 'armenian', 'bengali', 'cambodian/khmer', 'cjk-earthly-branch', 'cjk-heavenly-stem', 'devanagari', 'georgian', 'gurmukhi', 'kannada', 'lao', 'malayalam', 'myanmar', 'oriya', 'telugu', 'thai']
    },
    {
        key: ['list-style-type', 'list-style'],
        type: 'other',
        colorful: false,
        values: ['none', 'disc', 'decimal']
    },
    //TYPOGRAPHY
    {
        key: ['letter-spacing', 'ls'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['lines'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['line-height', 'lh'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['content'],
        type: 'other',
        colorful: false,
        values: ['normal', 'none', 'no-open-quote', 'no-close-quote', 'url()', 'linear-gradient()', 'image-set()', 'counter()', 'attr()']
    },
    {
        key: ['vertical-align', 'v'],
        type: 'other',
        colorful: false,
        values: ['baseline', 'bottom', 'middle', 'sub', 'super', 'text-bottom', 'text-top', 'top']
    },
    {
        key: ['white-space'],
        type: 'other',
        colorful: false,
        values: ['break-spaces', 'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap']
    },
    {
        key: ['word-break'],
        type: 'other',
        colorful: false,
        values: ['normal', 'break-all', 'keep-all']
    },
    {
        key: ['word-spacing'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['writing-mode'],
        type: 'other',
        colorful: false,
        values: ['horizontal-tb', 'vertical-rl', 'vertical-lr', 'lr', 'lr-tb', 'rl', 'rl-tb', 'tb', 'tb-rl']
    },
    //BACKGROUND
    {
        key: ['background', 'bg'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['backdrop-filter', 'bd'],
        type: 'other',
        colorful: false,
        values: ['none', 'url()', 'blur()', 'brightness()', 'contrast()', 'grayscale()', 'hue-rotate(degree)', 'invert()', 'sepia()', 'saturate()', 'opacity()', 'drop-shadow()']
    },
    {
        key: ['background-attachment', 'background', 'bg'],
        type: 'other',
        colorful: false,
        values: ['fixed', 'local', 'scroll']
    },
    {
        key: ['background-blend-mode'],
        type: 'other',
        colorful: false,
        values: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
    },
    {
        key: ['background-clip'],
        type: 'other',
        colorful: false,
        values: ['border-box', 'content-box', 'padding-box']
    },
    {
        key: ['background-clip', 'bg'],
        type: 'other',
        colorful: false,
        values: ['text']
    },
    {
        key: ['background-color', 'background', 'bg'],
        type: 'color',
        colorful: true,
        values: ['transparent']
    },
    {
        key: ['background-image', 'background', 'bg'],
        type: 'other',
        colorful: false,
        values: ['url()', 'linear-gradient()', 'radial-gradient()', 'repeating-linear-gradient()', 'repeating-radial-gradient()', 'conic-gradient()']
    },
    {
        key: ['background-origin', 'bg'],
        type: 'other',
        colorful: false,
        values: ['border-box', 'content-box', 'padding-box']
    },
    {
        key: ['background-position', 'bg'],
        type: 'other',
        colorful: false,
        values: ['top', 'bottom', 'left', 'right', 'center']
    },
    {
        key: ['background-repeat', 'bg'],
        type: 'other',
        colorful: false,
        values: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y']
    },
    {
        key: ['background', 'bg'],
        type: 'other',
        colorful: false,
        values: ['auto', 'cover', 'contain']
    },
    {
        key: ['mix-blend-mode', 'blend'],
        type: 'other',
        colorful: false,
        values: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
    },
    //BORDER
    {
        key: ['border', 'border-top', 'border-bottom', 'border-left', 'border-right', 'b', 'bt', 'bb', 'bl', 'br', 'bx', 'by'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['border-color','border', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color', 'b', 'bt', 'bb', 'bl', 'br', 'bx', 'by'],
        type: 'other',
        colorful: true,
        values: []
    },
    {
        key: ['border-radius', 'r', 'rt', 'rb', 'rl', 'rr', 'border-top-left-radius', 'rlt', 'rtl', 'border-top-right-radius', 'rrt', 'rtr'
            , 'border-bottom-left-radius', 'rlb', 'rbl', 'border-bottom-right-radius', 'rbr', 'rrb'
        ],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['border-style', 'border', 'b', 'border-top-style', 'border-top', 'bt', 'border-bottom-style', 'border-bottom', 'bb', 'border-left-style', 'border-left', 'bl', 'border-right-style', 'border-right', 'br', 'bx', 'by'],
        type: 'other',
        colorful: false,
        values: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    {
        key: ['border-width', 'border', 'b', 'border-top-width', 'border-top', 'bt', 'border-bottom-width', 'border-bottom', 'bb', 'border-left-width', 'border-left', 'bl', 'border-right-width', 'border-right', 'br', 'bx', 'by'],
        type: 'reserved',
        colorful: false,
        values: []
    },

    //OUTLINE
    {
        key: ['outline'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['outline-color', 'outline'],
        type: 'color',
        colorful: true,
        values: []
    },
    {
        key: ['outline-offset'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['outline-style', 'outline'],
        type: 'other',
        colorful: false,
        values: ['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    {
        key: ['outline-width', 'outline'],
        type: 'other',
        colorful: false,
        values: ['medium', 'thick', 'thin']
    },
    //SHAPE
    {
        key: ['shape-image-threshold'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['shape-margin', 'shape'],
        type: 'other',
        colorful: false,
        values: ['max()', 'min()', 'calc()', 'clamp()']
    },
    {
        key: ['shape-outside'],
        type: 'other',
        colorful: false,
        values: ['none']
    },
    {
        key: ['shape-outside', 'shape'],
        type: 'other',
        colorful: false,
        values: ['margin', 'content', 'border', 'padding', 'inset()', 'circle()', 'ellipse()', 'polygon()', 'url()', 'linear-gradient()']
    },
    {
        key: ['	clip-path', 'clip'],
        type: 'other',
        colorful: false,
        values: ['none', 'margin', 'border', 'padding', 'content', 'fill', 'stroke', 'view', 'inset()', 'circle()', 'ellipse()', 'polygon()', 'path()', 'url()']
    },
    //SIZING
    {
        key: ['aspect-ratio', 'ratio'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['box-sizing', 'box'],
        type: 'other',
        colorful: false,
        values: ['content-box', 'content', 'border-box', 'border']
    },
    {
        key: ['width', 'w'],
        type: 'other',
        colorful: false,
        values: ['full', 'fit-content', 'fit', 'max-content', 'max', 'min-content', 'min']
    },
    {
        key: ['min-width', 'min-w'],
        type: 'other',
        colorful: false,
        values: ['full', 'fit-content', 'fit', 'max-content', 'max', 'min-content', 'min']
    },
    {
        key: ['max-width', 'max-w'],
        type: 'other',
        colorful: false,
        values: ['full', 'fit-content', 'fit', 'max-content', 'max', 'min-content', 'min']
    },
    {
        key: ['height', 'h'],
        type: 'other',
        colorful: false,
        values: ['full', 'fit-content', 'fit', 'max-content', 'max', 'min-content', 'min']
    },
    {
        key: ['min-height', 'min-h'],
        type: 'other',
        colorful: false,
        values: ['full', 'fit-content', 'fit', 'max-content', 'max', 'min-content', 'min']
    },
    {
        key: ['max-height', 'max-h'],
        type: 'other',
        colorful: false,
        values: ['full', 'fit-content', 'fit', 'max-content', 'max', 'min-content', 'min']
    },
    //TYPOGRAPHY
    {
        key: ['letter-spacing', 'ls'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['margin-top', 'mt', 'margin-bottom', 'mb', 'margin-left', 'ml', 'margin-right', 'mr', 'margin', 'm', 'mx', 'my'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['padding-top', 'pt', 'padding-bottom', 'pb', 'padding-left', 'pl', 'padding-right', 'pr', 'padding', 'p', 'px', 'py'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['word-spacing'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    //TRANSITION
    {
        key: ['transition'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['transition-delay', '~delay'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['transition-duration', '~duration'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['transition-property', '~property'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['transition-timing-function', '~easing'],
        type: 'other',
        colorful: false,
        values: ['ease', 'ease-in', 'ease-out', 'linear', 'step-start', 'step-end', 'steps(,)', 'cubic-bezier(,,,)', 'frames()']
    },
    //TRANSFORM
    {
        key: ['transform'],
        type: 'other',
        colorful: false,
        values: ['translate()', 'translate3d()', 'translateX()', 'translateY()', 'translateZ()', 'scale()', 'scale3d()', 'scaleX()', 'scaleY()', 'scaleZ()', 'skew()', 'skewX()', 'skewY()', 'rotate()', 'rotate3d()', 'rotateX()', 'rotateY()', 'rotateZ()', 'perspective()', 'matrix()', 'matrix3d()']
    },
    {
        key: ['transform-box', 'transform'],
        type: 'other',
        colorful: false,
        values: ['content', 'fill', 'stroke', 'view', 'border', 'content-box', 'fill-box', 'stroke-box', 'view-box', 'border-box']
    },
    {
        key: ['transform-origin', 'transform'],
        type: 'other',
        colorful: false,
        values: ['top', 'bottom', 'right', 'left', 'center']
    },
    {
        key: ['transform-style', 'transform'],
        type: 'other',
        colorful: false,
        values: ['flat', 'preserve-3d']
    },
    //ANIMATION
    {
        key: ['animation'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['animation-delay', '@delay'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['animation-direction', '@direction'],
        type: 'other',
        colorful: false,
        values: ['normal', 'reverse', 'alternate', 'alternate-reverse']
    },
    {
        key: ['animation-duration', '@duration'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['animation-fill-mode', '@fill-mode'],
        type: 'other',
        colorful: false,
        values: ['none', 'forwards', 'backwards', 'both']
    },
    {
        key: ['animation-iteration-count', '@iteration-count'],
        type: 'other',
        colorful: false,
        values: ['infinite']
    },
    {
        key: ['animation-name', '@name'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['animation-play-state', '@play-state'],
        type: 'other',
        colorful: false,
        values: ['running', 'paused']
    },
    {
        key: ['animation-timing-function', '@easing'],
        type: 'other',
        colorful: false,
        values: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end', 'steps(,)', 'cubic-bezier(,,,)', 'frames()']
    },
    //SVG
    {
        key: ['fill'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['stroke'],
        type: 'reserved',
        colorful: true,
        values: []
    },
    {
        key: ['stroke-width'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    //VISIBILITY
    {
        key: ['opacity'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['visibility'],
        type: 'other',
        colorful: false,
        values: ['visible', 'invisible','collapse']
    },
    //BACKGROUND

    {
        key: ['backdrop-filter','bd'],
        type: 'other',
        colorful: false,
        values: ['none','url(svg)','blur()','brightness()','contrast()','grayscale()','hue-rotate(degree)','invert()','sepia()','saturate()','opacity()','drop-shadow()']
    },
    {
        key: ['background-blend-mode'],
        type: 'other',
        colorful: false,
        values: ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity']
    },
    {
        key: ['box-shadow','shadow'],
        type: 'other',
        colorful: false,
        values: ['inset']
    },
    {
        key: ['filter'],
        type: 'other',
        colorful: false,
        values: ['none','url()','blur()','brightness()','contrast()','drop-shadow()','grayscale()','hue-rotate(degree)','invert()','opacity()','saturate()','sepia()']
    },
    {
        key: ['mask-image'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['mix-blend-mode','blend'],
        type: 'other',
        colorful: false,
        values: ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity']
    },
    {
        key: ['text-shadow'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    //SCROLL
    {
        key: ['overscroll-behavior','overscroll-behavior-x','overscroll-behavior-y'],
        type: 'other',
        colorful: false,
        values: ['auto','none','contain']
    },
    {
        key: ['scroll-behavior'],
        type: 'other',
        colorful: false,
        values: ['auto','smooth']
    },
    {
        key: ['scroll-margin','m','scroll-margin','scroll-margin-top','mt','scroll-margin-bottom','mb','scroll-margin-left','ml','scroll-margin-right','mr','scroll-mx','scroll-my'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['scroll-padding','p','scroll-padding','scroll-padding-top','pt','scroll-padding-bottom','pb','scroll-padding-left','pl','scroll-padding-right','pr','scroll-px','scroll-py'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    {
        key: ['scroll-snap-align','scroll-snap'],
        type: 'other',
        colorful: false,
        values: ['center','end','start','none']
    },
    {
        key: ['scroll-snap-stop','scroll-snap'],
        type: 'other',
        colorful: false,
        values: ['always','normal']
    },
    {
        key: ['scroll-snap-type'],
        type: 'other',
        colorful: false,
        values: ['none']
    },
    {
        key: ['scroll-snap-type','scroll-snap'],
        type: 'other',
        colorful: false,
        values: ['x','y','both','block','inline','x;mandatory','y;proximity','both;mandatory']
    },
    //INTERACTIVITY

    {
        key: ['pointer-events'],
        type: 'other',
        colorful: false,
        values: ['auto','none','visiblePainted','visibleFill','visibleStroke','visible','painted','fill','stroke','all','bounding-box']
    },
    {
        key: ['resize'],
        type: 'other',
        colorful: false,
        values: ['auto','none','both','horizontal','vertical','block','inline']
    },
    {
        key: ['touch-action'],
        type: 'other',
        colorful: false,
        values: ['auto','none','pan-x','pan-left','pan-right','pan-y','pan-up','pan-down','pinch-zoom','manipulation']
    },
    {
        key: ['user-drag'],
        type: 'other',
        colorful: false,
        values: ['auto','none','element']
    },
    {
        key: ['user-select'],
        type: 'other',
        colorful: false,
        values: ['all','auto','none','text']
    },
    //OPTIMIZATION
    {
        key: ['contain'],
        type: 'other',
        colorful: false,
        values: ['none','strict','content','size','layout','style','paint']
    },
    {
        key: ['font','f'],
        type: 'other',
        colorful: false,
        values: ['antialiased','subpixel-antialiased']
    },
    {
        key: ['text-rendering'],
        type: 'other',
        colorful: false,
        values: ['auto']
    },
    {
        key: ['text-rendering','t'],
        type: 'other',
        colorful: false,
        values: ['optimizeSpeed','optimizeLegibility','geometricPrecision']
    },
    {
        key: ['will-change'],
        type: 'reserved',
        colorful: false,
        values: []
    },
    //VARIABLE
    {
        key: ['$'],
        type: 'reserved',
        colorful: false,
        values: []
    }
]

export const masterStylesType = [
    {
        type: 'color',
        values: ['#', 'rgb()', 'hsl()']
    }
]

export const masterStylesSemantic = [
    {
        key: 'display',
        values: ['hide', 'hidden', 'block', 'table', 'contents', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table']
    },
    {
        key: 'isolation',
        values: ['isolate']
    },
    {
        key: 'position',
        values: ['rel', 'abs', 'static', 'fixed', 'sticky']
    },
    {
        key: 'white-space',
        values: ['break-spaces']
    },
    {
        key: 'word-break',
        values: ['break-word']
    },
    {
        key: 'border-radius',
        values: ['round', 'rounded']
    },
    {
        key: 'aspect-ratio',
        values: ['square', 'video']
    },
    {
        key: 'transform',
        values: ['translate()', 'translate3d()', 'translateX()', 'translateY()', 'translateZ()', 'scale()', 'scale3d()', 'scaleX()', 'scaleY()', 'scaleZ()', 'skew()', 'skewX()', 'skewY()', 'rotate()', 'rotate3d()', 'rotateX()', 'rotateY()', 'rotateZ()', 'perspective()', 'matrix()', 'matrix3d()']
    },
    {
        key: 'visibility',
        values: ['visible', 'invisible','collapse']
    },
    {
        key: 'filter',
        values: ['blur()','brightness()','contrast()','drop-shadow()','grayscale()','hue-rotate(degree)','invert()','opacity()','saturate()','sepia()']
    }
]