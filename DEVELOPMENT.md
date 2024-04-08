# Development

## Architecture

This extension consists of two parts:

- The host script, which runs in the A1111 webui and interacts with the webui's DOM.
- The client page, which runs in another window and communicates with the host script.

The cross-window communication is done using the _birpc_ library and relies on `BroadcastChannel` under the hood.

## Prerequisites

This extension runs as a userscript during development, so you need a userscript manager to run it. For example, you can use [Tampermonkey](https://www.tampermonkey.net/) for Chrome or Firefox.

## Development

1. Clone this repository into A1111 webui's `extensions` directory.
2. Go to the `dev` directory. All development processes will be done there.
3. Start with these commands:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

4. The console will print something like `[MonkeyPlugin] Dev script hosted at: http://localhost:8080/monkey-dev.user.js`. Open this URL in your browser to install the userscript.

5. Open your A1111 webui and you should see the extension running.
6. Once you make changes to the code, the userscript will automatically reload itself.

## Build

To build the extension, run:

```bash
npm run build
```

Note that the production version of extension will refuse to run itself if the development version is running. You need to disable the development userscript in your userscript manager to get it working.
