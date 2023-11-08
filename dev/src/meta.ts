import { UserscriptMeta } from "webpack-monkey"

export default {
  name: "SD Portal",
  version: "1.0.0",
  // TODO: fix port matching in webpack-monkey
  match: ["*://*/*"],
  noframes: true,
} satisfies UserscriptMeta
