import { log } from "../utils/log"
import { clientRpc } from "./client-rpc"

let watchingTimer = -1

export function watchWindowMetrics() {
  let currentX = window.screenX
  let currentY = window.screenY
  let currentWidth = window.outerWidth
  let currentHeight = window.outerHeight

  watchingTimer = window.setInterval(() => {
    if (
      currentX !== window.screenX ||
      currentY !== window.screenY ||
      currentWidth !== window.outerWidth ||
      currentHeight !== window.outerHeight
    ) {
      currentX = window.screenX
      currentY = window.screenY
      currentWidth = window.outerWidth
      currentHeight = window.outerHeight

      clientRpc
        .saveWindowMetrics({
          x: window.screenX,
          y: window.screenY,
          width: window.outerWidth,
          height: window.outerHeight,
        })
        .catch(log.bind(null, "Failed to save window metrics"))
    }
  }, 1000)

  module.hot?.dispose(() => {
    clearInterval(watchingTimer)
  })
}

export function stopWatchingWindowMetrics() {
  clearInterval(watchingTimer)

  clientRpc.saveWindowMetrics(null).catch(log.bind(null, "Failed to clear window metrics"))
}
