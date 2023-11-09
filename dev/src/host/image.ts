import { isBirpcTimeoutError } from "../utils/error"
import { hostRpc } from "./host-rpc"

let currentVisibleImageElement: HTMLImageElement | undefined
let currentLivePreview: string | undefined

function watchImages() {
  const galleryImages = gradioApp().querySelectorAll(
    ".gradio-gallery > div > img",
  ) as NodeListOf<HTMLImageElement>

  currentVisibleImageElement = galleryImages[0]

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentVisibleImageElement = entry.target as HTMLImageElement
        void sendImage()
      }
    })
  })

  galleryImages.forEach((img) => visibilityObserver.observe(img))

  const srcObserver = new MutationObserver(() => {
    void sendImage()
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

function watchLivePreviews() {
  const galleries = [
    document.getElementById("txt2img_gallery"),
    document.getElementById("img2img_gallery"),
  ].filter(Boolean) as HTMLDivElement[]

  const insertionObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.classList.contains("livePreview")) {
          insertionObserver.observe(node, { childList: true })
        } else if (
          node instanceof HTMLImageElement &&
          node.parentElement?.classList.contains("livePreview")
        ) {
          currentLivePreview = node.src
          void sendLivePreview()
        }
      })
    })
  })

  galleries.forEach((gallery) => {
    insertionObserver.observe(gallery, { childList: true })
  })

  module.hot?.dispose(() => {
    insertionObserver.disconnect()
  })
}

export async function sendLivePreview() {
  if (!currentLivePreview) {
    return
  }

  try {
    await hostRpc.setAtom({
      livePreviews: {
        url: currentLivePreview,
      },
    })
  } catch (e) {
    if (!isBirpcTimeoutError(e)) {
      // TODO: toast the error
    }
  }
}

export async function sendImage() {
  if (!currentVisibleImageElement?.src) {
    return
  }

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

watchImages()
watchLivePreviews()

module.hot?.dispose(() => {
  currentVisibleImageElement = undefined
})
