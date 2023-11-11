import { log } from "../utils/log"
import { insertOpenButtons } from "./control"
import { hostRpc } from "./host-rpc"
import "./image"
import { watchImages, watchLivePreviews } from "./image"

async function host() {
  log("Starting host")

  await insertOpenButtons()

  watchImages()
  watchLivePreviews()

  // in case the page is already opened (as during development)
  void hostRpc.$functions.initPage()
}

host().catch(console.warn)
