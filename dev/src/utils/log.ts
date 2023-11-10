import debug from "debug"
import { DEV } from "../constants"

export const log = debug("sd-portal")

if (DEV) {
  log.enabled = true
}

export function logged() {
  return function loggedDecorator<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
  ) {
    const name = context.name

    if (typeof name === "symbol") {
      throw new Error("Cannot log function with symbol name")
    }

    let className = "UnknownClass"

    context.addInitializer(function (this: This) {
      className = Object.getPrototypeOf(this).constructor.name
    })

    return function loggedWrapper(this: This, ...args: Args) {
      console.log(`[${className}.${name as string}]`, ...args)
      return target.call(this, ...args)
    }
  }
}
