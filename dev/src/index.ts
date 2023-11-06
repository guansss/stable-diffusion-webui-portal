declare global {
  interface Window {
    gradio_config?: any
  }
}

async function main() {
  if (unsafeWindow.gradio_config?.title !== "Stable Diffusion") {
    return
  }

  console.log("running")
}

void main()
