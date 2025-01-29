/**
 * Container package
 *
 * @param {string} width The width of the container
 * @param {string} paddingX Horizontal padding for the container
 * @param {string} paddingY Vertical padding for the container
 * @param {string} marginTop Top margin for the container
 * @param {string} marginBottom Bottom margin for the container
 * @param {string} className Additional classes for the container
 * @returns {string}
 */

// CSS for these is defined in global.css to allow for override on basic story
const widthClasses = {
    none: "",
    narrow: "su-container-narrow",
    large: "su-container-large",
    wide: "su-container-wide",
    full: "su-container-full",
    /**
     * Centered container class from Decanter
     * https://github.com/SU-SWS/decanter/blob/main/src/plugins/components/layout/centered-container.js
     */
    cc: "su-cc",
};

/**
 * Padding and margin options based on the Decanter responsive spacing system.
 * Base is the smallest step and 10 is the largest.
 * https://github.com/SU-SWS/decanter/blob/main/src/plugins/components/responsive-spacing/responsive-spacing.js
 */
const paddingYClasses = {
    none: "",
    base: "su-rs-py-0",
    1: "su-rs-py-1",
    2: "su-rs-py-2",
    3: "su-rs-py-3",
    4: "su-rs-py-4",
    5: "su-rs-py-5",
    6: "su-rs-py-6",
    7: "su-rs-py-7",
    8: "su-rs-py-8",
    9: "su-rs-py-9",
    10: "su-rs-py-10",
};

// The "default" option for margins means using the default margin between components defined in the _global.css
const marginTopClasses = {
    default: "",
    base: "su-rs-mt-0",
    1: "su-rs-mt-1",
    2: "su-rs-mt-2",
    3: "su-rs-mt-3",
    4: "su-rs-mt-4",
    5: "su-rs-mt-5",
    6: "su-rs-mt-6",
    7: "su-rs-mt-7",
    8: "su-rs-mt-8",
    9: "su-rs-mt-9",
    10: "su-rs-mt-10",
};

const marginBottomClasses = {
    default: "",
    base: "su-rs-mb-0",
    1: "su-rs-mb-1",
    2: "su-rs-mb-2",
    3: "su-rs-mb-3",
    4: "su-rs-mb-4",
    5: "su-rs-mb-5",
    6: "su-rs-mb-6",
    7: "su-rs-mb-7",
    8: "su-rs-mb-8",
    9: "su-rs-mb-9",
    10: "su-rs-mb-10",
};

export function containerClasses({
    width = "large",
    paddingX = true,
    paddingY = "none",
    marginTop = "default",
    marginBottom = "default",
    className,
}) {
  return `su-mx-auto su-component-container ${widthClasses[width?.toLowerCase()]}${paddingX ? ' su-container-px' : ''} ${paddingYClasses[paddingY]} ${marginTopClasses[marginTop]} ${marginBottomClasses[marginBottom]} ${className ? className : ''}`
}

export default containerClasses;