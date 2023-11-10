export function ignoreError(test: string | ((e: unknown) => boolean)) {
  return function ignoreErrorDecorator<This, Args extends any[]>(
    target: (this: This, ...args: Args) => void | Promise<void>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => void | Promise<void>>,
  ) {
    let testFn: (e: unknown) => boolean

    if (typeof test === "function") {
      testFn = test
    } else if (typeof test === "string") {
      testFn = (e) => String(e).includes(test)
    }

    return async function ignoreErrorWrapper(this: This, ...args: Args): Promise<void> {
      try {
        return await target.call(this, ...args)
      } catch (e) {
        if (!testFn(e)) {
          throw e
        }
      }
    }
  }
}

export function isBirpcTimeoutError(e: unknown) {
  return String(e).includes("[birpc] timeout")
}
