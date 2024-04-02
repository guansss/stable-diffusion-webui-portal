import { copyFileSync } from "fs"

function main() {
  console.log("Copying React and ReactDOM")
  copyFileSync(
    "node_modules/react/umd/react.production.min.js",
    "../client/react.production.min.js",
  )
  copyFileSync(
    "node_modules/react-dom/umd/react-dom.production.min.js",
    "../client/react-dom.production.min.js",
  )

  console.log("Done")
}

main()
