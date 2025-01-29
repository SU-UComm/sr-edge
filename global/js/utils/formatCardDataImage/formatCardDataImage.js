/**
 * formats image data from Matrix image assets
 * into a more simplified shape
 *
 * @param {object} object
 * the image data structure
 *
 * @returns {object}
 */
export function formatCardDataImage({ attributes, url }) {
    const { alt, width, height } = attributes;
  
    const orientation = width >= height ? "h" : "v";
  
    return {
        alt,
        width,
        height,
        url,
        orientation,
    };
}

export default formatCardDataImage;