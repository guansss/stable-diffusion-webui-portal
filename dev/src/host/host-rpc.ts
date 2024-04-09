import type { Simplify } from "type-fest"
import type { ClientFunctions } from "../client/client-rpc"
import { logged } from "../utils/log"
import { createRpc } from "../utils/rpc"
import { fireKeyboardEventOnGallery, sendImage, sendLivePreview } from "./gallery"
import type { WindowMetrics } from "./window"
import { saveWindowMetrics } from "./window"

// using a class since decorators can only be used in classes (currently)
const hostFunctions = new (class HostRpc {
  @logged()
  async initClient() {
    await hostRpc.ignoreTimeout.setAtom({
      connected: true,
    })

    await sendImage()
    await sendLivePreview()
  }

  @logged()
  async sendKeyboardEvent(type: string, init: KeyboardEventInit) {
    fireKeyboardEventOnGallery(type, init)
  }

  @logged()
  saveWindowMetrics(metrics: WindowMetrics) {
    saveWindowMetrics(metrics)
  }
})()

export type HostFunctions = Simplify<typeof hostFunctions>

export const hostRpc = createRpc<ClientFunctions, HostFunctions>(hostFunctions)
