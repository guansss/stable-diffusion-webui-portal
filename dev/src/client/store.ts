import { atom, createStore } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { ExtractAtomArgs } from "jotai/vanilla"
import type { ResizeMode } from "../utils/window"
import type { Theme } from "./theme"

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

  export const rememberWindowMetrics = atomWithStorage("rememberWindowMetrics", true, undefined, {
    // we are reading this atom before creating the React app, so if getOnInit is false,
    // we will not get the stored value
    unstable_getOnInit: true,
  })

  export const theme = atomWithStorage<Theme>("theme", "system", undefined, {
    unstable_getOnInit: true,
  })
}

Object.entries(atoms).forEach(([name, atom]) => {
  atom.debugLabel = name
})

type Atoms = typeof atoms

export type AtomArgs = {
  [K in keyof Atoms]: ExtractAtomArgs<Atoms[K]>[0]
}
