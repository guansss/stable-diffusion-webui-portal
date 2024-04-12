import { createBirpc, type BirpcOptions, type BirpcReturn } from "birpc"
import { isBirpcTimeoutError } from "./error"
import { DEV } from "../constants"

const channel = new BroadcastChannel(DEV ? "sd-portal-channel-dev" : "sd-portal-channel")

type Rpc<T, U> = BirpcReturn<T, U> & {
  $: (options: RpcOptions) => BirpcReturn<T, U>
  ignoreTimeout: BirpcReturn<T, U>
}

type RpcOptions = {
  ignoreTimeout?: boolean
}

export function createRpc<
  RemoteFunctions = Record<string, never>,
  LocalFunctions = Record<string, never>,
>(
  functions: LocalFunctions,
  options?: Partial<BirpcOptions<RemoteFunctions>>,
): Rpc<RemoteFunctions, LocalFunctions> {
  const baseRpc = createBirpc<RemoteFunctions, LocalFunctions>(functions, {
    on: (on) => (channel.onmessage = (e) => on(e.data)),
    post: (msg) => channel.postMessage(msg),
    timeout: 1000,
    ...options,
  })

  const withOptions = (options: RpcOptions) => {
    return new Proxy(baseRpc, {
      get(_, prop) {
        const fn = Reflect.get(baseRpc, prop)

        if (typeof fn !== "function") {
          return fn
        }

        return async (...args: unknown[]) => {
          try {
            return await (fn as (...args: unknown[]) => Promise<void>).call(baseRpc, ...args)
          } catch (e) {
            if (options.ignoreTimeout && isBirpcTimeoutError(e)) {
              // ignore
            } else {
              throw e
            }
          }
        }
      },
    })
  }

  const rpc = new Proxy(baseRpc, {
    get(_, prop) {
      if (prop === "$") {
        return withOptions
      } else if (prop === "ignoreTimeout") {
        return withOptions({ ignoreTimeout: true })
      }

      return Reflect.get(baseRpc, prop)
    },
  })

  return rpc as Rpc<RemoteFunctions, LocalFunctions>
}

module.hot?.dispose(() => {
  channel.close()
})
