import { createBirpc } from "birpc"
import { ClientFunctions } from "../page/page-rpc"
import { ignoreError } from "../utils/error"

// using a class since decorators can only be used in classes (currently)
const serverFunctions = new (class {
  @ignoreError("[birpc] timeout")
  async initPage() {
    await hostRpc.setAtom({
      images: [
        {
          filename: "test",
          path: "test",
        },
      ],
    })
  }
})()

export type ServerFunctions = typeof serverFunctions

const channel = new BroadcastChannel("sd-portal-channel")

export const hostRpc = createBirpc<ClientFunctions, ServerFunctions>(serverFunctions, {
  on: (on) => (channel.onmessage = (e) => on(e.data)),
  post: (msg) => channel.postMessage(msg),
  timeout: 1000,
})

module.hot?.dispose(() => {
  channel.close()
})
