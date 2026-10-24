/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#040711",
          surface: "#090d1a",
          card: "#0d1326",
          border: "rgba(0, 240, 255, 0.16)",
          emerald: "#00ff9d",
          cyan: "#00f0ff",
          red: "#ff0055",
          amber: "#ffb700",
          purple: "#9d4edd",
          muted: "#64748b"
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.35)',
        'neon-emerald': '0 0 15px rgba(0, 255, 157, 0.35)',
        'neon-red': '0 0 20px rgba(255, 0, 85, 0.5)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(0, 240, 255, 0.12)'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-glow': 'laserGlow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        laserGlow: {
          '0%': { filter: 'drop-shadow(0 0 2px #00ff9d)' },
          '100%': { filter: 'drop-shadow(0 0 10px #00f0ff)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
};
