import { useAtomValue } from "jotai"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { log } from "../utils/log"
import { ImageViewer } from "./components/ImageViewer"
import { Toaster } from "./components/ui/toast"
import "./page.css"
import { atoms } from "./store"
import { Connector } from "./components/Connector"

log("Starting page")

function Page() {
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
    <Page />
    <Toaster />
  </StrictMode>,
)

module.hot?.dispose(() => {
  root.unmount()
})
