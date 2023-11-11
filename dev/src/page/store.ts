import { atom, createStore } from "jotai"
import { atomWithReducer } from "jotai/utils"
import type { ExtractAtomArgs } from "jotai/vanilla"
import { compact } from "lodash-es"

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

  /**
   * There can be at most 2 live previews. Setting a new one will push the oldest one out,
   * and setting undefined will clear the list.
   */
  export const livePreviews = atomWithReducer(
    [] as SDImage[],
    (prev, next: SDImage | undefined) => {
      console.log("livePreviews", prev, next)
      if (!next) return []

      return compact([...prev, next]).slice(0, 2)
    },
  )

  export const progress = atom<SDProgress | undefined>(undefined)
}

Object.entries(atoms).forEach(([name, atom]) => {
  atom.debugLabel = name
})

type Atoms = typeof atoms

export type AtomArgs = {
  [K in keyof Atoms]: ExtractAtomArgs<Atoms[K]>[0]
}
