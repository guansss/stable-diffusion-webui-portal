import { log } from "./utils/log"

declare global {
  interface Window {
    __SD_PORTAL_DEV__?: boolean
  }
}

async function main() {
  log("Starting")

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
