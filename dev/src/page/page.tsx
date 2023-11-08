import { Provider, useAtomValue } from "jotai"
import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { pageRpc } from "./page-rpc"
import "./page.css"
import { atoms, store } from "./store"

function Page() {
  const images = useAtomValue(atoms.images)

  useEffect(() => {
    pageRpc.initPage()
  }, [])

  return (
    <div className="bg-slate-400">
      <h1>Hello, world!</h1>
    </div>
  )
}

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <Provider store={store}>
      <Page />
    </Provider>
  </StrictMode>,
)

module.hot?.dispose(() => {
  root.unmount()
})
