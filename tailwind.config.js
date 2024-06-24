/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgBlue: "#1A2164",
        headerBlue: "#2F3994",
        title: "#F05E88",
        option: "#0075C4",
        optionSelected: "#004E83",
        correct: "#62C370",
        wrong: "#E63946",
        check: "#255FE3",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // Use Roboto as the default sans-serif font
        montserrat: ["Montserrat", "sans-serif"], // Use Montserrat as another custom font
      },
      screens: {
        sm: "430px",
        md: "744px",
        lg: "1280px",
      },
      height: {
        "sm-h": "720px",
        "md-h": "932px",
        "lg-h": "1133px",
      },
      scale: {
        98: "0.98",
        96: "0.96",
      },
      keyframes: {
        slideUpFadeOut: {
          "0%": { transform: "translateY(100%)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        slideUpFadeOut: "slideUpFadeOut 0.5s forwards",
      },
    },
  },
  plugins: [],
};
