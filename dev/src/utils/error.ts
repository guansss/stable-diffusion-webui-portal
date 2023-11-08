export function ignoreError(pattern: string) {
  return function ignoreErrorDecorator<This, Args extends any[]>(
    target: (this: This, ...args: Args) => void | Promise<void>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => void | Promise<void>>,
  ) {
    async function ignoreErrorWrapper(this: This, ...args: Args): Promise<void> {
      try {
        return await target.call(this, ...args)
      } catch (e) {
        if (!String(e).includes(pattern)) {
          throw e
        }
      }
    }

    return ignoreErrorWrapper
  }
}
