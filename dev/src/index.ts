async function main() {
  if (location.host !== "localhost:8080") {
    return
  }
  // if (unsafeWindow.gradio_config?.title !== "Stable Diffusion") {
  //   return
  // }

  if (location.pathname.includes("page.html")) {
    await import("./page/page")
  } else {
    await import("./host/host")
  }
}

main().catch(console.warn)

module.hot?.monkeyReload()
