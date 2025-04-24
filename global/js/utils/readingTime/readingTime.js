/**
 * Calculates the estimated reading time for a given block of text.
 *
 * @param {string} text - The input text to analyze.
 * @returns {number} The estimated reading time in minutes, rounded up to the nearest whole number.
 *
 * @example
 * readingTime("This is a short paragraph."); // 1
 *
 * @example
 * readingTime(""); // 0
 */
export function readingTime(text) {
    if (!text) return 0;

    const wpm = 225; // Average reading speed: words per minute
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return time;
}