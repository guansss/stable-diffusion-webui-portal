import { createBirpc } from "birpc"
import { ServerFunctions } from "../host/host-rpc"
import { AtomValues, atoms, store } from "./store"

export type SDImage = {
  filename: string
  path: string
}

const clientFunctions = {
  async setAtom<T extends AtomValues>(values: T) {
    for (const key in values) {
      if (atoms.hasOwnProperty(key)) {
        store.set(atoms[key as keyof AtomValues], values[key] as any)
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
