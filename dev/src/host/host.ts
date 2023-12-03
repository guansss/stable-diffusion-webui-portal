import { log } from "../utils/log"
import { webuiLoaded } from "../utils/webui"
import { insertOpenButtons } from "./control"
import { hostRpc } from "./host-rpc"
import "./image"
import { watchImages, watchLivePreviews, watchProgress } from "./image"

async function host() {
  log("Starting host")

  await webuiLoaded

  log("WebUI loaded")

  await insertOpenButtons()

  watchImages()
  watchLivePreviews()
  watchProgress()

  // in case the client is already opened (as during development)
  void hostRpc.$functions.initClient()
}

host().catch(log)
