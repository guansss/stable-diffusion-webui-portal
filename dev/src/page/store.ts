import { ExtractAtomValue, atom } from "jotai"

export type SDImage = {
  url: string
}

export namespace atoms {
  export const image = atom<SDImage | undefined>(undefined)
}

type Atoms = typeof atoms

export type AtomValues = {
  [K in keyof Atoms]: ExtractAtomValue<Atoms[K]>
}
