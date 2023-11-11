import { createBirpc } from "birpc"
import type { Simplify } from "type-fest"
import type { HostFunctions } from "../host/host-rpc"
import { logged } from "../utils/log"
import type { AtomArgs } from "./store"
import { atoms, store } from "./store"

const pageFunctions = new (class PageRpc {
  @logged()
  async setAtom<K extends keyof AtomArgs>(values: { [P in K]: AtomArgs[P] }) {
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(atoms, key)) {
        ;(store.set as WhateverTheFuckFunction)(atoms[key], values[key])
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
