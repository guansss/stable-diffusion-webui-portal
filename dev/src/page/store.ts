import { atom, createStore } from "jotai"
import { atomWithReducer } from "jotai/utils"
import { ExtractAtomArgs } from "jotai/vanilla"
import { compact } from "lodash-es"

export type SDImage = {
  url: string
}

export const store = createStore()

export namespace atoms {
  export const connected = atom(false)

  export const image = atom<SDImage | undefined>(undefined)

  /**
   * There can be at most 2 live previews. Setting a new one will push the oldest one out,
   * and setting null will clear the list.
   */
  export const livePreviews = atomWithReducer([] as SDImage[], (prev, next: SDImage | null) => {
    if (next === null) return []

    return compact([...prev, next]).slice(0, 2)
  })
}

Object.entries(atoms).forEach(([name, atom]) => {
  atom.debugLabel = name
})

type Atoms = typeof atoms

export type AtomArgs = {
  [K in keyof Atoms]: ExtractAtomArgs<Atoms[K]> extends { length: 1 }
    ? ExtractAtomArgs<Atoms[K]>[0]
    : never
}
