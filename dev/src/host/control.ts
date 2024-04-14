import { uniqueId } from "lodash-es"
import { DEV } from "../constants"
import { log } from "../utils/log"
import { getExtensionInfo } from "./remote"
import { getWindowMetrics } from "./window"

export async function insertOpenButtons() {
  const { dir } = await getExtensionInfo()
  const url = "/file=" + dir + "/client/client.html"

  ;["txt2img_open_folder", "img2img_open_folder", "extras_open_folder"].forEach((id) => {
    const targetButton = document.getElementById(id)
    if (targetButton) {
      insertOpenButton(targetButton, url)
    } else {
      log("Could not find target button", id)
    }
  })
}

function insertOpenButton(targetButton: HTMLElement, url: string) {
  log("Inserting open button for", targetButton)

  const openButton = document.createElement("a")

  for (let i = 0; i < targetButton.attributes.length; i++) {
    const attr = targetButton.attributes[i]!
    openButton.setAttribute(attr.name, attr.value)
  }

  const tabName = targetButton.id.split("_")[0] || uniqueId("unknownTab")
  openButton.id = tabName + "_open_portal"

  openButton.innerText = "🖥️"
  openButton.title = "Open Portal (stable-diffusion-webui-portal)" + (DEV ? " (dev)" : "")
  openButton.href = url
  openButton.target = "_blank"

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  openButton.addEventListener("click", async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { x, y, width, height } = getWindowMetrics()

    try {
      // this is an experimental browser feature, and is needed for opening the window in different screens
      if ("getScreenDetails" in unsafeWindow) {
        await (unsafeWindow as { getScreenDetails: () => Promise<void> }).getScreenDetails()
      }
    } catch (e) {
      log("Failed calling getScreenDetails():", e)
    }

    window.open(
      openButton.href,
      openButton.target,
      `width=${width}, height=${height}, left=${x}, top=${y}`,
    )
  })

  log("Created open button", openButton)
  log("Inserting open button to", targetButton.parentElement)

  targetButton.parentElement!.prepend(openButton)

  module.hot?.dispose(() => {
    openButton.remove()
  })
}
