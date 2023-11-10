import { createBirpc } from "birpc"
import { getDefaultStore } from "jotai"
import { HostFunctions } from "../host/host-rpc"
import { AtomArgs, atoms } from "./store"
import { Simplify } from "type-fest"
import { logged } from "../utils/log"

const pageFunctions = new (class PageRpc {
  @logged()
  async setAtom<K extends keyof AtomArgs>(values: { [P in K]: AtomArgs[P] }) {
    for (const key in values) {
      if (atoms.hasOwnProperty(key)) {
        getDefaultStore().set(atoms[key] as IKnowWhatIAmDoing, values[key])
      }
    }
  }
})()

export type PageFunctions = Simplify<typeof pageFunctions>

const channel = new BroadcastChannel("sd-portal-channel")

export const pageRpc = createBirpc<HostFunctions, PageFunctions>(pageFunctions, {
  on: (on) => (channel.onmessage = (e) => on(e.data)),
  post: (msg) => channel.postMessage(msg),
  timeout: 1000,
})

module.hot?.dispose(() => {
  channel.close()
})
