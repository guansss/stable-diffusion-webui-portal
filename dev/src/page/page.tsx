import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { log } from "../utils/log"
import { ImageViewer } from "./ImageViewer"
import { pageRpc } from "./page-rpc"
import "./page.css"

log("Starting page")

function Page() {
  return (
    <div className="flex w-screen h-screen">
      <ImageViewer className="w-full h-full" />
    </div>
  )
}

pageRpc.initPage()

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <Page />
  </StrictMode>,
)

module.hot?.dispose(() => {
  root.unmount()
})
