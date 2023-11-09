import { isBirpcTimeoutError } from "../utils/error"
import { hostRpc } from "./host-rpc"

let currentVisibleImageElement: HTMLImageElement | undefined

function watchImages() {
  const galleryImages = gradioApp().querySelectorAll(
    ".gradio-gallery > div > img",
  ) as NodeListOf<HTMLImageElement>

  currentVisibleImageElement = galleryImages[0]

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentVisibleImageElement = entry.target as HTMLImageElement
        void updatePageImage()
      }
    })
  })

  galleryImages.forEach((img) => visibilityObserver.observe(img))

  const srcObserver = new MutationObserver(() => {
    void updatePageImage()
  })

  galleryImages.forEach((img) =>
    srcObserver.observe(img, {
      attributes: true,
      attributeFilter: ["src"],
    }),
  )

  module.hot?.dispose(() => {
    visibilityObserver.disconnect()
    srcObserver.disconnect()
  })
}

export async function updatePageImage() {
  if (currentVisibleImageElement?.src) {
    try {
      await hostRpc.setAtom({
        image: {
          url: currentVisibleImageElement.src,
        },
      })
    } catch (e) {
      if (!isBirpcTimeoutError(e)) {
        // TODO: toast the error
      }
    }
  }
}

watchImages()

module.hot?.dispose(() => {
  currentVisibleImageElement = undefined
})
