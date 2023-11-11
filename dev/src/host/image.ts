import { SimpleMutationObserver } from "../utils/dom"
import { log, truncateImageSrc } from "../utils/log"
import { webui_onAfterUiUpdate } from "../utils/webui"
import { hostRpc } from "./host-rpc"

// the most recently visible image to watch
let currentImageElement: HTMLImageElement | undefined

let currentLivePreview: string | undefined

export function watchImages() {
  const visibilityObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        log("Image visible", entry.target)
        currentImageElement = entry.target as HTMLImageElement
        void sendImage()

        break
      }
    }
  })

  const srcObserver = new SimpleMutationObserver(({ target }) => {
    if (target === currentImageElement) {
      log("Image src changed", target)
      void sendImage()

      return true
    }
  })

  webui_onAfterUiUpdate(() => {
    const galleryImages = gradioApp().querySelectorAll<HTMLImageElement>(
      ".gradio-gallery > div > img",
    )

    currentImageElement ||= galleryImages[0]

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

      if (currentImageElement === undefined) {
        // most likely the img already has a src, so we send it immediately
        currentImageElement ||= img
        void sendImage()
      }

      visibilityObserver.observe(img)
      srcObserver.observe(img, {
        attributes: true,
        attributeFilter: ["src"],
      })
    })
  })

  module.hot?.dispose(() => {
    visibilityObserver.disconnect()
  })
}

export function watchLivePreviews() {
  const galleries = [
    document.getElementById("txt2img_gallery"),
    document.getElementById("img2img_gallery"),
  ].filter(Boolean) as HTMLDivElement[]

  log("Watching live previews", galleries)

  const insertionObserver = new SimpleMutationObserver(({ addedNodes, removedNodes }) => {
    addedNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.classList.contains("livePreview")) {
        log("Live preview added", node)
        insertionObserver.observe(node, { childList: true })

        const existingImg = node.getElementsByTagName("img")[0]

        if (existingImg) {
          currentLivePreview = existingImg.src
          void sendLivePreview()
        }
      } else if (
        node instanceof HTMLImageElement &&
        node.parentElement?.classList.contains("livePreview")
      ) {
        log("Live preview image added", node)
        currentLivePreview = node.src
        void sendLivePreview()
      }
    })

    removedNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.classList.contains("livePreview")) {
        log("Live preview removed", node)
        currentLivePreview = undefined
        void sendLivePreview()
      }
    })
  })

  galleries.forEach((gallery) => {
    insertionObserver.observe(gallery, { childList: true })
  })
}

export function watchProgress() {
  const containers = [
    document.getElementById("txt2img_results"),
    document.getElementById("img2img_results"),
  ].filter(Boolean) as HTMLDivElement[]

  log("Watching progress in containers", containers)

  const insertionObserver = new SimpleMutationObserver(({ target, addedNodes, removedNodes }) => {
    addedNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.classList.contains("progressDiv")) {
        log("Progress added", node)
        insertionObserver.observe(node, { childList: true })

        const progressText = node.getElementsByClassName("progress")[0]

        if (progressText) {
          log("Observing progress text", progressText)
          insertionObserver.observe(progressText, { childList: true })
        }
      } else if (target instanceof HTMLElement && target.classList.contains("progress")) {
        void sendProgress(target)
      }
    })

    removedNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.classList.contains("progressDiv")) {
        log("Progress removed", node)
        void sendProgress()
      }
    })
  })

  containers.forEach((gallery) => {
    insertionObserver.observe(gallery, { childList: true })
  })
}

export async function sendImage() {
  if (!currentImageElement?.src) {
    log("No image to send")
    return
  }

  log("Sending image", truncateImageSrc(currentImageElement.src))

  await hostRpc.ignoreTimeout
    .setAtom({
      image: {
        url: currentImageElement.src,
      },
    })
    .catch(log)
}

export async function sendLivePreview() {
  log("Sending live preview", truncateImageSrc(currentLivePreview ?? "(none)"))

  await hostRpc.ignoreTimeout
    .setAtom({
      livePreviews: currentLivePreview
        ? {
            url: currentLivePreview,
          }
        : undefined,
    })
    .catch(log)
}

async function sendProgress(progressText?: HTMLElement) {
  const text = progressText?.textContent

  log("Sending progress", text)

  await hostRpc.ignoreTimeout
    .setAtom({
      progress: text ? { text } : undefined,
    })
    .catch(log)
}

module.hot?.dispose(() => {
  currentImageElement = undefined
  currentLivePreview = undefined
})
