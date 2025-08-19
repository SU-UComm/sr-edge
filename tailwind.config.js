/** @type {import('tailwindcss').Config} */
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import decanter from 'decanter';
import plugin from 'tailwindcss/plugin'; 

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import and execute the colors function
import colorsFunction from "./global/css/plugins/theme/colors.js";
const colors = colorsFunction();

// Import base styles
import baseStyles from "./global/css/plugins/base/base.js";

export default {
    presets: [decanter],
    darkMode: "class",
    prefix: "su-",
    content: [
        "./global/**/*.{css,js,hbs}",
        "./packages/**/*.{css,jsx,js,scss,html,hbs}",
    ],
    theme: {
        extend: {
            colors: colors,
            textShadow: {
              sm: "0 1px 2px var(--tw-shadow-color)",
              DEFAULT: "0 2px 4px var(--tw-shadow-color)",
              lg: "0 8px 16px var(--tw-shadow-color)",
              title:
                "0px 0px 30px var(--tw-shadow-color), 0px 0px 30px var(--tw-shadow-color)",
            },
        },
    },
    variants: {
        extend: {
            textColor: ['hocus'],
            borderColor: ['hocus'],
            backgroundColor: ['hocus'],
        },
    },
    plugins: [
        baseStyles(),
        plugin(function ({ addVariant }) {
            addVariant('hocus', ['&:hover', '&:focus']);
        }),
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                "text-shadow": (value) => ({
                  textShadow: value,
                }),
              },
              { values: theme("textShadow") }
            );
          }),
    ],
    safelist: [
      'su-object-top',
      'su-object-center',
      'su-object-bottom',
    ],
};
