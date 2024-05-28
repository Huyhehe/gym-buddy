import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import ContainerQueries from "@tailwindcss/container-queries";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          text: "var(--color-primary-based-text)",
        },
      },
    },
  },
  important: true,
  plugins: [ContainerQueries],
} satisfies Config;
