import { isBirpcTimeoutError } from "../utils/error"
import { log } from "../utils/log"
import { hostRpc } from "./host-rpc"

let currentVisibleImageElement: HTMLImageElement | undefined
let currentLivePreview: string | undefined

export function watchImages() {
  const galleryImages = gradioApp().querySelectorAll(
    ".gradio-gallery > div > img",
  ) as NodeListOf<HTMLImageElement>

  log("Watching images", galleryImages)

  currentVisibleImageElement = galleryImages[0]

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        log("Image visible", entry.target)
        currentVisibleImageElement = entry.target as HTMLImageElement
        void sendImage()
      }
    })
  })

  galleryImages.forEach((img) => visibilityObserver.observe(img))

  const srcObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target === currentVisibleImageElement) {
        log("Image src changed", mutation.target)
        void sendImage()
      }
    })
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

export function watchLivePreviews() {
  const galleries = [
    document.getElementById("txt2img_gallery"),
    document.getElementById("img2img_gallery"),
  ].filter(Boolean) as HTMLDivElement[]

  log("Watching live previews", galleries)

  const insertionObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.classList.contains("livePreview")) {
          log("Live preview added", node)
          insertionObserver.observe(node, { childList: true })
        } else if (
          node instanceof HTMLImageElement &&
          node.parentElement?.classList.contains("livePreview")
        ) {
          log("Live preview image added", node)
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
    log("No live preview")
    return
  }

  try {
    log("Sending live preview", currentLivePreview)

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
    log("No image")
    return
  }

  try {
    log("Sending image", currentVisibleImageElement.src)

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

module.hot?.dispose(() => {
  currentVisibleImageElement = undefined
  currentLivePreview = undefined
})
