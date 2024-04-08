export type ResizeMode = "fit-image" | "screen-width" | "screen-height"

export function resizeWindow(mode: ResizeMode, imageWidth: number, imageHeight: number) {
  let width = 0
  let height = 0

  if (imageWidth <= 0 || imageHeight <= 0) {
    return
  }

  if (mode === "fit-image") {
    width = imageWidth
    height = imageHeight
  } else if (mode === "screen-width") {
    width = window.screen.availWidth
    height = (window.screen.availWidth / imageWidth) * imageHeight
  } else if (mode === "screen-height") {
    height = window.screen.availHeight
    width = (window.screen.availHeight / imageHeight) * imageWidth
  }

  width = Math.max(100, ~~width)
  height = Math.max(100, ~~height)

  window.resizeTo(width, height)
}
