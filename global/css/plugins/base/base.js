module.exports = function () {
  return function ({ addBase, config }) {
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
    });
  };
};
