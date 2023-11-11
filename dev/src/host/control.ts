import { uniqueId } from "lodash-es"
import { log } from "../utils/log"

export function insertOpenButtons() {
  ;["txt2img_open_folder", "img2img_open_folder", "extras_open_folder"].forEach((id) => {
    const targetButton = document.getElementById(id)
    if (targetButton) insertOpenButton(targetButton)
  })
}

function insertOpenButton(targetButton: HTMLElement) {
  log("Inserting open button for", targetButton)

  const openButton = document.createElement("a")

  for (let i = 0; i < targetButton.attributes.length; i++) {
    const attr = targetButton.attributes[i]!
    openButton.setAttribute(attr.name, attr.value)
  }

  const tabName = targetButton.id.split("_")[0] || uniqueId("unknownTab")
  openButton.id = tabName + "_open_portal"

  openButton.innerText = "🖥️"
  openButton.title = "Open Portal (stable-diffusion-webui-portal)"
  // TODO: https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/5ef669de080814067961f28357256e8fe27544f4/modules/scripts.py#L300-L305
  openButton.href = "/file=extensions/stable-diffusion-webui-portal/page.html"
  openButton.target = "_blank"

  openButton.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()

    // TODO: remember position and size
    window.open(openButton.href, openButton.target, "width=800,height=600")
  })

  log("Created open button", openButton)
  log("Inserting open button to", targetButton.parentElement)

  targetButton.parentElement!.prepend(openButton)

  module.hot?.dispose(() => {
    openButton.remove()
  })
}
