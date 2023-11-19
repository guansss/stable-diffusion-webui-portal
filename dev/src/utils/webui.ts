import { pull } from "lodash-es"
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

export function webui_onUiLoaded(callback: () => void) {
  if (DEV) {
    if (window.__sd_portal_ui_loaded) {
      callback()
      return
    }

    const internalCallback = () => {
      window.__sd_portal_ui_loaded = true
    }

    onUiLoaded(internalCallback)

    module.hot?.dispose(() => {
      pull(uiLoadedCallbacks, internalCallback)
    })
  }

  onUiLoaded(callback)

  module.hot?.dispose(() => {
    pull(uiLoadedCallbacks, callback)
  })
}

export function webui_onAfterUiUpdate(callback: () => void) {
  onAfterUiUpdate(callback)

  module.hot?.dispose(() => {
    pull(uiAfterUpdateCallbacks, callback)
  })
}
