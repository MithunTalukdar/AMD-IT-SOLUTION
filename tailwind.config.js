/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0a1e40",
          blue: "#0f2f6b",
          lightblue: "#1e4a9a",
          accent: "#1e3a8a",
          yellow: "#facc15",
          amber: "#fbbf24",
          gold: "#eab308",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        'card': '0 10px 40px -10px rgba(15,47,107,0.15)',
        'glow': '0 0 40px rgba(250,204,21,0.35)',
      },
      backgroundImage: {
        'gradient-tech': 'linear-gradient(135deg, #0a1e40 0%, #0f2f6b 50%, #1e4a9a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
      }
    },
  },
  plugins: [],
}
