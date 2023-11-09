/// <reference types="webpack" />
/// <reference types="webpack/module" />
/// <reference types="webpack-dev-server" />

type IKnowWhatIAmDoing = any

interface Window {
  gradio_config?: any
}

const gradioApp: () => HTMLDivElement
