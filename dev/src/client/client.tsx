import { Provider, useAtomValue } from "jotai"
import { DevTools } from "jotai-devtools"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { log } from "../utils/log"
import { AppMenu } from "./AppMenu"
import { clientRpc } from "./client-rpc"
import "./client.css"
import { Connector } from "./components/Connector"
import { ImageViewer } from "./components/ImageViewer"
import { Toaster } from "./components/ui/toast"
import { atoms, store } from "./store"

function client() {
  log("Starting client")

  watchWindowMetrics()

  const root = createRoot(document.getElementById("root")!)
  root.render(
    <StrictMode>
      <Provider store={store}>
        <DevTools store={store} />
        <App />
        <Toaster />
      </Provider>
    </StrictMode>,
  )

  module.hot?.dispose(() => {
    root.unmount()
  })
}

function watchWindowMetrics() {
  let currentX = window.screenX
  let currentY = window.screenY
  let currentWidth = window.outerWidth
  let currentHeight = window.outerHeight

  const timer = setInterval(() => {
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
    clearInterval(timer)
  })
}

function App() {
  const connected = useAtomValue(atoms.connected)

  return (
    <div className="relative flex w-screen h-screen">
      <Connector />
      {connected && <ImageViewer className="w-full h-full" />}
      <AppMenu />
    </div>
  )
}

client()
