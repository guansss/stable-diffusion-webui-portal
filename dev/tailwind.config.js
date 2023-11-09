/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    /** @type {import('tailwindcss/types/config').PluginCreator} */
    ({ addUtilities }) => {
      addUtilities({
        ".absolute-center": {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
      })
    },
  ],
}
