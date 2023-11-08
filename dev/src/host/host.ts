import { hostRpc } from "./host-rpc"

hostRpc.$functions.initPage()

const a = document.createElement("a")
a.innerText = "Open Page1"
a.href = "/page.html"
a.target = "_blank"
document.body.appendChild(a)

module.hot?.dispose(() => {
  a.remove()
})
