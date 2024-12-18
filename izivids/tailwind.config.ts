import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      rotate: {
        135: "135deg",
        270: "270deg",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes : ["acid", "forest"],
  },
} satisfies Config;
