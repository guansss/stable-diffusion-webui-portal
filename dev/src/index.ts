import { log } from "./utils/log"
import { webui_onUiLoaded } from "./utils/webui"

async function main() {
  log("Starting")

  const gradioTitle = typeof gradio_config === "undefined" ? undefined : gradio_config.title
  log("Title:", gradioTitle)

  if (gradioTitle === "Stable Diffusion") {
    log("Waiting for UI to load")

    await new Promise<void>((resolve) => webui_onUiLoaded(resolve))

    log("Loading host")
    import("./host/host").catch(console.warn)
  } else if (location.pathname.includes("page.html")) {
    log("Loading page")
    await import("./page/page")
  }
}

main().catch(console.warn)

module.hot?.monkeyReload()
