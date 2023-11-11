declare global {
  let uiLoadedCallbacks: (() => void)[]
  let uiAfterUpdateCallbacks: (() => void)[]

  function onUiLoaded(callback: () => void): void
  function onAfterUiUpdate(callback: () => void): void
}

export function webui_onUiLoaded(callback: () => void) {
  onUiLoaded(callback)

  module.hot?.dispose(() => {
    const index = uiLoadedCallbacks.indexOf(callback)
    if (index >= 0) uiLoadedCallbacks.splice(index, 1)
  })
}

export function webui_onAfterUiUpdate(callback: () => void) {
  onAfterUiUpdate(callback)

  module.hot?.dispose(() => {
    const index = uiAfterUpdateCallbacks.indexOf(callback)
    if (index >= 0) uiAfterUpdateCallbacks.splice(index, 1)
  })
}
