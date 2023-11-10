import { createBirpc } from "birpc"
import { Simplify } from "type-fest"
import { PageFunctions } from "../page/page-rpc"
import { ignoreError, isBirpcTimeoutError } from "../utils/error"
import { logged } from "../utils/log"
import { sendImage, sendLivePreview } from "./image"

// using a class since decorators can only be used in classes (currently)
const hostFunctions = new (class HostRpc {
  @logged()
  @ignoreError(isBirpcTimeoutError)
  async initPage() {
    await hostRpc.setAtom({
      connected: true,
    })

    await sendImage()
    await sendLivePreview()
  }
})()

export type HostFunctions = Simplify<typeof hostFunctions>

const channel = new BroadcastChannel("sd-portal-channel")

export const hostRpc = createBirpc<PageFunctions, HostFunctions>(hostFunctions, {
  on: (on) => (channel.onmessage = (e) => on(e.data)),
  post: (msg) => channel.postMessage(msg),
  timeout: 1000,
})

module.hot?.dispose(() => {
  channel.close()
})
