import { ExtractAtomValue, atom, createStore } from "jotai"

export type SDImage = {
  filename: string
  path: string
}

export const store = createStore()

export namespace atoms {
  export const images = atom<SDImage[]>([])
}

type Atoms = typeof atoms

export type AtomValues = {
  [K in keyof Atoms]: ExtractAtomValue<Atoms[K]>
}
