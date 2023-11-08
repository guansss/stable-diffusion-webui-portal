import autoprefixer from "autoprefixer"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "path"
import postcssPresetEnv from "postcss-preset-env"
import tailwindcss from "tailwindcss"
import { Configuration } from "webpack"
import { monkey } from "webpack-monkey"

export default (env: Record<string, string | boolean>, { mode }: { mode: string }) => {
  const isDev = mode === "development"

  const config: Configuration = {
    entry: "./src/index.ts",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [new MiniCssExtractPlugin()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: isDev,
            },
          },
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
      extensions: [".ts", ".tsx", "..."],
    },
    devServer: {},
  }

  if (isDev) {
    return monkey({
      ...config,
    })
  }

  return config
}
