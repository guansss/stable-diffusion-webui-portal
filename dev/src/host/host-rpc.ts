import { createBirpc } from "birpc"
import { Simplify } from "type-fest"
import { ClientFunctions } from "../page/page-rpc"
import { ignoreError, isBirpcTimeoutError } from "../utils/error"
import { sendImage, sendLivePreview } from "./image"

// using a class since decorators can only be used in classes (currently)
const serverFunctions = new (class {
  @ignoreError(isBirpcTimeoutError)
  async initPage() {
    await sendImage()
    await sendLivePreview()
  }
})()

export type ServerFunctions = Simplify<typeof serverFunctions>

const channel = new BroadcastChannel("sd-portal-channel")

export const hostRpc = createBirpc<ClientFunctions, ServerFunctions>(serverFunctions, {
  on: (on) => (channel.onmessage = (e) => on(e.data)),
  post: (msg) => channel.postMessage(msg),
  timeout: 1000,
})

module.hot?.dispose(() => {
  channel.close()
})
