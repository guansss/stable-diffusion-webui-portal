import autoprefixer from "autoprefixer"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import tailwindcss from "tailwindcss"
import path from "path"
import postcssPresetEnv from "postcss-preset-env"
import { monkey } from "webpack-monkey"

module.exports = monkey({
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv(), tailwindcss(), autoprefixer()],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", "..."],
  },
})
