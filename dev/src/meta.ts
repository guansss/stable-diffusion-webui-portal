import { UserscriptMeta } from "webpack-monkey"

export default {
  name: "SD Portal",
  version: "1.0.0",
  match: ["*://*/*"],
  noframes: true,
} satisfies UserscriptMeta
