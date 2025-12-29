/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 14px 30px rgba(0,0,0,0.10)",
        pill: "0 10px 22px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
};
