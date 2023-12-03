import { DEV } from "./constants"
import { log } from "./utils/log"

declare global {
  interface Window {
    __sd_portal_dev?: boolean
  }
}

async function main() {
  log("Starting")

  if (DEV) {
    unsafeWindow.__sd_portal_dev = true
  }

  if (!DEV && window.__sd_portal_dev) {
    log("Dev mode detected, exiting")
    return
  }

  const gradioTitle = typeof gradio_config === "undefined" ? undefined : gradio_config.title
  log("Title:", gradioTitle)

  if (gradioTitle === "Stable Diffusion") {
    log("Loading host")
    import("./host/host").catch(log)
  } else if (location.pathname.includes("client.html")) {
    log("Loading client")
    await import("./client/client")
  }
}

main().catch(log)

module.hot?.monkeyReload()
