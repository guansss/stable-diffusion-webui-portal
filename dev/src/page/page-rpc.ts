import { createBirpc } from "birpc"
import { getDefaultStore } from "jotai"
import { ServerFunctions } from "../host/host-rpc"
import { AtomArgs, atoms } from "./store"

const clientFunctions = {
  async setAtom<K extends keyof AtomArgs>(values: { [P in K]: AtomArgs[P] }) {
    for (const key in values) {
      if (atoms.hasOwnProperty(key)) {
        getDefaultStore().set(atoms[key] as IKnowWhatIAmDoing, values[key])
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
