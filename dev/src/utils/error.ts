export function formatError(e: unknown, fallback = "unknown error"): string {
  let result = fallback

  if (typeof e === "string") {
    result = e
  } else if (e !== null && typeof e === "object") {
    if ((e as Error).message) {
      result = String((e as Error).message)
    } else {
      const str = String(e)

      if (str !== "[object Object]") {
        result = str
      }
    }
  }

  if (result.length > 1000) {
    result = result.slice(0, 1000) + `... (${result.length - 1000} more)`
  }

  return result || fallback
}

export function ignoreError(test: string | ((e: unknown) => boolean)) {
  return function ignoreErrorDecorator<This, Args extends unknown[]>(
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
