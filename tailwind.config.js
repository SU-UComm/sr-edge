/** @type {import('tailwindcss').Config} */
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import decanter from 'decanter';
import plugin from 'tailwindcss/plugin'; 


const __dirname = dirname(fileURLToPath(import.meta.url));
const colors = resolve(__dirname, "./global/css/plugins/theme/colors.js");
const base = resolve(__dirname, "./global/css/plugins/base/base.js");

export default {
    presets: [decanter],
    darkMode: "class",
    prefix: "su-",
    content: [
        "./global/**/*.{css,js}",
        "./packages/**/*.{css,jsx,js,scss,html}",
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
        },
    },
    plugins: [
        base,
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
};
