import { atom, createStore } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { ExtractAtomArgs } from "jotai/vanilla"
import type { ResizeMode } from "../utils/window"

export type SDImage = {
  url: string
}

export type SDProgress = {
  text: string
}

export const store = createStore()

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace atoms {
  export const connected = atom(false)

  export const image = atom<SDImage | undefined>(undefined)
  export const livePreview = atom<SDImage | undefined>(undefined)
  export const progress = atom<SDProgress | undefined>(undefined)

  export const imageSize = atom<{ width: number; height: number }>({ width: 0, height: 0 })
  export const resizeMode = atomWithStorage<ResizeMode>("resizeMode", "fit-image")
}

Object.entries(atoms).forEach(([name, atom]) => {
  atom.debugLabel = name
})

type Atoms = typeof atoms

export type AtomArgs = {
  [K in keyof Atoms]: ExtractAtomArgs<Atoms[K]>[0]
}
