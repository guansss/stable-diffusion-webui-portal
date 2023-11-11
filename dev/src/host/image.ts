import { isBirpcTimeoutError } from "../utils/error"
import { log, truncateImageSrc } from "../utils/log"
import { webui_onAfterUiUpdate } from "../utils/webui"
import { hostRpc } from "./host-rpc"

let currentVisibleImageElement: HTMLImageElement | undefined
let currentLivePreview: string | undefined

export function watchImages() {
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        log("Image visible", entry.target)
        currentVisibleImageElement = entry.target as HTMLImageElement
        void sendImage()
      }
    })
  })

  const srcObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target === currentVisibleImageElement) {
        log("Image src changed", mutation.target)
        void sendImage()
      }
    })
  })

  webui_onAfterUiUpdate(() => {
    const galleryImages = gradioApp().querySelectorAll(
      ".gradio-gallery > div > img",
    ) as NodeListOf<HTMLImageElement>

    currentVisibleImageElement ||= galleryImages[0]

    galleryImages.forEach((img) => {
      if (img.dataset.sdPortalModded) {
        return
      }

      img.dataset.sdPortalModded = "1"

      module.hot?.dispose(() => {
        delete img.dataset.sdPortalModded
      })

      if (img.parentElement?.classList.contains("livePreview")) {
        return
      }

      log("Observing image", img)

      visibilityObserver.observe(img)
      srcObserver.observe(img, {
        attributes: true,
        attributeFilter: ["src"],
      })
    })
  })

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

      mutation.removedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.classList.contains("livePreview")) {
          log("Live preview removed", node)
          currentLivePreview = undefined
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
  try {
    log("Sending live preview", truncateImageSrc(currentLivePreview || "(none)"))

    await hostRpc.setAtom({
      livePreviews: currentLivePreview
        ? {
            url: currentLivePreview,
          }
        : null,
    })
  } catch (e) {
    if (!isBirpcTimeoutError(e)) {
      console.warn(e)
      // TODO: toast the error
    }
  }
}

export async function sendImage() {
  if (!currentVisibleImageElement?.src) {
    log("No image to send")
    return
  }

  try {
    log("Sending image", truncateImageSrc(currentVisibleImageElement.src))

    await hostRpc.setAtom({
      image: {
        url: currentVisibleImageElement.src,
      },
    })
  } catch (e) {
    if (!isBirpcTimeoutError(e)) {
      console.warn(e)
      // TODO: toast the error
    }
  }
}

module.hot?.dispose(() => {
  currentVisibleImageElement = undefined
  currentLivePreview = undefined
})
