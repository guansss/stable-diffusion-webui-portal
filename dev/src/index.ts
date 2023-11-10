import { log } from "./utils/log"

declare global {
  interface Window {
    __sd_portal_ui_loaded?: boolean
  }
}

async function main() {
  log("Starting")

  const gradioTitle = typeof gradio_config === "undefined" ? undefined : gradio_config.title
  log("Title:", gradioTitle)

  if (gradioTitle === "Stable Diffusion") {
    log("Waiting for UI to load")

    if (!window.__sd_portal_ui_loaded) {
      await new Promise<void>((resolve) => onUiLoaded(resolve))
    }
    window.__sd_portal_ui_loaded = true

    log("Loading host")
    import("./host/host").catch(console.warn)
  } else if (location.pathname.includes("page.html")) {
    log("Loading page")
    await import("./page/page")
  }
}

main().catch(console.warn)

module.hot?.monkeyReload()
