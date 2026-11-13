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
        striply: {
          primary: "#1454E8",     // Primary Brand Blue
          white: "#FFFFFF",       // Clean White
          offwhite: "#F4F6FC",    // Background Off-white
          lightblue: "#DCE7FF",   // Highlighted / Border Light Blue
          nearblack: "#10131B",   // Headings & Primary Text Near-black
          darkblue: "#173B70",    // Depth & Contrast Dark Blue
          softblue: "#8BAAFF",    // Subtle Accent Soft Blue
          success: "#16A34A",     // Success Green
          warning: "#F59E0B",     // Amber Warning
          danger: "#DC2626",      // Critical Alert Red
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(20, 84, 232, 0.08)',
        'glass-elevated': '0 20px 45px -10px rgba(20, 84, 232, 0.14)',
        'glass-glow': '0 0 25px rgba(20, 84, 232, 0.25)',
      },
      backdropBlur: {
        glass: "16px",
        glassLg: "24px",
      },
    },
  },
  plugins: [],
};
