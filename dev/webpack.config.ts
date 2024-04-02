import autoprefixer from "autoprefixer"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "path"
import postcssPresetEnv from "postcss-preset-env"
import tailwindcss from "tailwindcss"
import type { Configuration } from "webpack"
import { monkey } from "webpack-monkey"

export default (env: Record<string, string | boolean>, { mode }: { mode: string }) => {
  const isDev = mode === "development"

  const config: Configuration = {
    entry: isDev
      ? {
          main: "./src/index.ts",
        }
      : {
          "javascript/host": "./src/host/host.ts",
          "client/client": "./src/client/client.tsx",
        },
    output: {
      filename: "[name].js",
      chunkFilename: isDev
        ? undefined
        : () => {
            throw new Error("additional chunks are not (yet?) supported in production")
          },
      path: path.resolve(__dirname, ".."),
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
    externals: isDev
      ? {
          react: "React@https://unpkg.com/react@18.2.0/umd/react.development.js",
          "react-dom": "ReactDOM@https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js",
        }
      : {
          react: "React",
          "react-dom": "ReactDOM",
        },
    resolve: {
      extensions: [".ts", ".tsx", "..."],
    },
    devServer: {
      client: {
        overlay: false,
      },
    },
    optimization: {
      minimize: false,
    },
  }

  if (isDev) {
    return monkey({
      ...config,
      monkey: {
        devScript: {
          meta: {
            noframes: true,
          },
        },
      },
    })
  }

  return config
}
