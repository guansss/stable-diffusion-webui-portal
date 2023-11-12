import { DEV } from "../constants"

declare global {
  let uiLoadedCallbacks: (() => void)[]
  let uiAfterUpdateCallbacks: (() => void)[]

  function onUiLoaded(callback: () => void): void
  function onAfterUiUpdate(callback: () => void): void

  interface Window {
    __sd_portal_ui_loaded?: boolean
  }
}

if (DEV) {
  webui_onUiLoaded(() => {
    window.__sd_portal_ui_loaded = true
  })
}

export function webui_onUiLoaded(callback: () => void) {
  if (DEV) {
    if (window.__sd_portal_ui_loaded) {
      callback()
      return
    }
  }

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
