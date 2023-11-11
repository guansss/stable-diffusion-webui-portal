import type { Simplify } from "type-fest"
import type { PageFunctions } from "../page/page-rpc"
import { logged } from "../utils/log"
import { createRpc } from "../utils/rpc"
import { sendImage, sendLivePreview } from "./image"

// using a class since decorators can only be used in classes (currently)
const hostFunctions = new (class HostRpc {
  @logged()
  async initPage() {
    await hostRpc.ignoreTimeout.setAtom({
      connected: true,
    })

    await sendImage()
    await sendLivePreview()
  }
})()

export type HostFunctions = Simplify<typeof hostFunctions>

export const hostRpc = createRpc<PageFunctions, HostFunctions>(hostFunctions)
