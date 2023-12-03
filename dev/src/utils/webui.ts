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

export const webuiLoaded = new Promise<void>((resolve) => {
  if (DEV) {
    if (window.__sd_portal_ui_loaded) {
      resolve()
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
  onUiLoaded(resolve)

  module.hot?.dispose(() => {
    pull(uiLoadedCallbacks, resolve)
  })
})

export function webui_onAfterUiUpdate(callback: () => void) {
  onAfterUiUpdate(callback)

  module.hot?.dispose(() => {
    pull(uiAfterUpdateCallbacks, callback)
  })
}
