import { createBirpc } from "birpc"
import { getDefaultStore } from "jotai"
import { ServerFunctions } from "../host/host-rpc"
import { AtomValues, atoms } from "./store"

const clientFunctions = {
  async setAtom<T extends AtomValues>(values: T) {
    for (const key in values) {
      if (atoms.hasOwnProperty(key)) {
        getDefaultStore().set(atoms[key as keyof AtomValues], values[key] as IKnowWhatIAmDoing)
      }
    }
  },
}

export type ClientFunctions = typeof clientFunctions

const channel = new BroadcastChannel("sd-portal-channel")

export const pageRpc = createBirpc<ServerFunctions, ClientFunctions>(clientFunctions, {
  on: (on) => (channel.onmessage = (e) => on(e.data)),
  post: (msg) => channel.postMessage(msg),
  timeout: 1000,
})

module.hot?.dispose(() => {
  channel.close()
})
