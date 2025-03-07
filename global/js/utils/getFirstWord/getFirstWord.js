/**
 * Extracts the first word from the given content string.
 * 
 * @param {string} content - The input content, which may contain HTML tags and extra spaces.
 * @returns {string} The first word of the cleaned content, or an empty string if no words are found.
 */
export function getFirstWord(content) {
    if (!content) return "";
    
    return content
        .replace(/'/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .replace(/(<([^>]+)>)/gi, "")
        .trim()
        .split(" ")[0] || "";
}

export default getFirstWord;