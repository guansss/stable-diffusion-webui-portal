import type { Simplify } from "type-fest"
import type { HostFunctions } from "../host/host-rpc"
import { createRpc } from "../utils/rpc"
import type { AtomArgs } from "./store"
import { atoms, store } from "./store"

const clientFunctions = new (class {
  async setAtom<K extends keyof AtomArgs>(values: { [P in K]: AtomArgs[P] }) {
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(atoms, key)) {
        ;(store.set as WhateverTheFuckFunction)(atoms[key], values[key])
      }
    }
  }
})()

export type ClientFunctions = Simplify<typeof clientFunctions>

export const clientRpc = createRpc<HostFunctions, ClientFunctions>(clientFunctions)
