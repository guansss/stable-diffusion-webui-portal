import { memoize } from "lodash-es"
import { log } from "../utils/log"

interface ExtensionInfo {
  dir: string
}

export const getExtensionInfo = memoize(async () => {
  return request<ExtensionInfo>("/api/sd-portal")
})

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  log("Fetching", url, options)

  const res = await fetch(url, options)

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`)
  }

  const result = await res.json()

  log("Fetched", url, result)

  return result
}
