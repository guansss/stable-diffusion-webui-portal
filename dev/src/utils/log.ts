import debug from "debug"
import type { Class } from "type-fest"
import { DEV } from "../constants"

export const log = debug("sd-portal")

if (DEV) {
  log.enabled = true
}

export function truncateImageSrc(src: string) {
  if (src.startsWith("data:")) {
    return src.slice(0, 80) + "..."
  }
}

export function logged() {
  return function loggedDecorator<This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
  ) {
    const name = context.name

    if (typeof name === "symbol") {
      throw new Error("Cannot log function with symbol name")
    }

    let className = "UnknownClass"

    context.addInitializer(function (this: This) {
      className = (this as Class<unknown>).constructor.name
    })

    return function loggedWrapper(this: This, ...args: Args) {
      log(`[${className}.${name}]`, ...args)
      return target.call(this, ...args)
    }
  }
}
