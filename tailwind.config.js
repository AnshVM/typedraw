/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'olive':"#25291C",
        'licorice':'#230903',
        'smokyBlack':'#231C07',
        'rasinBlack':'#1f2232',
        'gunmetal':'#13262f',
        'richBlack':'#031927',
        'rasinBlack':'1e1e24',
      }
    },
  },
  plugins: [],
}