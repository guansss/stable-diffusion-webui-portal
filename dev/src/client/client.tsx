import { Provider, useAtomValue } from "jotai"
import { DevTools } from "jotai-devtools"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { log } from "../utils/log"
import { Connector } from "./components/Connector"
import { ImageViewer } from "./components/ImageViewer"
import { Toaster } from "./components/ui/toast"
import "./client.css"
import { atoms, store } from "./store"

log("Starting client")

function Client() {
  const connected = useAtomValue(atoms.connected)

  return (
    <div className="relative flex w-screen h-screen">
      <Connector />
      {connected && <ImageViewer className="w-full h-full" />}
    </div>
  )
}

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <Provider store={store}>
      <DevTools store={store} />
      <Client />
      <Toaster />
    </Provider>
  </StrictMode>,
)

module.hot?.dispose(() => {
  root.unmount()
})
