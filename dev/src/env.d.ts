/// <reference types="webpack" />
/// <reference types="webpack/module" />
/// <reference types="webpack-dev-server" />

// use it when there's an unavoidable any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IKnowWhatIAmDoing = any

// use it when you are angry
type WhateverTheFuck = unknown
type WhateverTheFuckFunction = (...args: WhateverTheFuck) => void

let gradio_config: { title: string } | undefined
let gradioApp: () => HTMLElement
