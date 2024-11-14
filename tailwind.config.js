import plugin from 'tailwindcss/plugin'; 

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    prefix: "su-",
    content: [
        "./packages/**/*.{css,jsx,js,scss,html}",
    ],
    theme: {
        extend: {
            colors: {
                "dark-mode": {
                    red: "#EC0909",
                },
                'campaign-fog': "#F9F9F9",
            },
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
        plugin(function ({ addVariant }) {
            addVariant('hocus', ['&:hover', '&:focus']);
        }),
        plugin(function ({ addBase, config }) {
            addBase({
                html: {
                    color: config("theme.colors.black.DEFAULT"), // Stanford report primary black
                },
                body: {
                    fontSize: "1.8rem",
                    "@screen md": {
                        fontSize: "2.1rem",
                    },
                    "@screen 2xl": {
                        fontSize: "2.3rem",
                    },
                },
                a: {
                    color: config("theme.colors.black.DEFAULT"),
                    transition: "color 0.25s ease-in-out",

                    "&:hover, &:focus": {
                        color: config("theme.colors.digital-red.DEFAULT"),
                    },
                },
                h1: {
                    fontFamily: [config("theme.fontFamily.serif")],
                },
                h2: {
                    fontFamily: [config("theme.fontFamily.serif")],
                },
                h3: {
                    fontFamily: [config("theme.fontFamily.serif")],
                },
                h4: {
                    fontFamily: [config("theme.fontFamily.serif")],
                },
                h5: {
                    fontFamily: [config("theme.fontFamily.serif")],
                },
                h6: {
                    fontFamily: [config("theme.fontFamily.serif")],
                },
            })
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
