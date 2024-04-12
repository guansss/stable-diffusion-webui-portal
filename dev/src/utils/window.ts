export type ResizeMode = "fit-image" | "screen-width" | "screen-height"

export function resizeWindow(mode: ResizeMode, imageWidth: number, imageHeight: number) {
  let width = 0
  let height = 0

  if (imageWidth <= 0 || imageHeight <= 0) {
    return
  }

  // On Windows, outerWidth and outerHeight include the size of the window's shadow,
  // which is likely 8px per side, so it's impossible to resize the window to
  // visually fit the screen without leaving gaps. Not sure about other OSes.
  // See https://stackoverflow.com/questions/77641874
  const frameWidth = window.outerWidth - window.innerWidth
  const frameHeight = window.outerHeight - window.innerHeight

  if (mode === "fit-image") {
    width = imageWidth + frameWidth
    height = imageHeight + frameHeight
  } else if (mode === "screen-width") {
    width = window.screen.availWidth
    height = (imageHeight / imageWidth) * (width - frameWidth) + frameHeight
  } else if (mode === "screen-height") {
    height = window.screen.availHeight
    width = (imageWidth / imageHeight) * (height - frameHeight) + frameWidth
  }

  width = Math.max(200, Math.round(width))
  height = Math.max(300, Math.round(height))

  window.resizeTo(width, height)
}
