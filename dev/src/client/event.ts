import { log } from "../utils/log"
import { clientRpc } from "./client-rpc"

const syncedKeyboardKeys = ["ArrowLeft", "ArrowRight", "s"]

// TODO: test this feature
export function watchControls(element: HTMLElement) {
  element.addEventListener("keydown", (e: KeyboardEvent) => {
    if (syncedKeyboardKeys.includes(e.key)) {
      e.preventDefault()

      clientRpc.ignoreTimeout
        .sendKeyboardEvent(e.type, {
          key: e.key,
          code: e.code,
          keyCode: e.keyCode,
          repeat: e.repeat,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
        })
        .catch(log.bind(null, "Failed to send keyboard event"))
    }
  })
}
