/// <reference types="webpack" />
/// <reference types="webpack/module" />
/// <reference types="webpack-dev-server" />

type IKnowWhatIAmDoing = any

var gradio_config: { title: string } | undefined
var gradioApp: () => HTMLElement

function onUiLoaded(callback: () => void): void
