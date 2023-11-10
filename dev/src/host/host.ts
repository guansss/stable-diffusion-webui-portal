import { log } from "../utils/log"
import { insertOpenButtons } from "./control"
import { hostRpc } from "./host-rpc"
import "./image"
import { watchImages, watchLivePreviews } from "./image"

async function host() {
  log("Starting host")

  watchImages()
  watchLivePreviews()
  insertOpenButtons()

  hostRpc.$functions.initPage()
}

host().catch(console.warn)
