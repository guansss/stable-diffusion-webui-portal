import { DEV } from "../constants"
import { log } from "../utils/log"
import { webuiLoaded } from "../utils/webui"
import { insertOpenButtons } from "./control"
import { watchImages, watchLivePreviews, watchProgress } from "./gallery"
import { hostRpc } from "./host-rpc"

async function host() {
  log("Starting host")

  await webuiLoaded

  if (!DEV && window.__SD_PORTAL_DEV__) {
    log("Dev mode detected, exiting")
    return
  }

  log("WebUI loaded")

  await insertOpenButtons()

  watchImages()
  watchLivePreviews()
  watchProgress()

  // in case the client is already opened (as during development)
  void hostRpc.$functions.initClient()
}

host().catch(log)
