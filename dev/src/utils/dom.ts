/**
 * MutationObserver that calls the callback with a single mutation record.
 * The callback can return true to stop the iteration.
 */
export class SimpleMutationObserver extends MutationObserver {
  constructor(public callback: (mutation: MutationRecord) => boolean | void) {
    super((mutations) => {
      for (const mutation of mutations) {
        if (this.callback(mutation)) {
          break
        }
      }
    })

    module.hot?.dispose(() => {
      this.disconnect()
    })
  }
}
