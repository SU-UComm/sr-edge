/**
 * Creates an embedded YouTube video iframe
 * 
 * @param {string} videoId - YouTube video ID
 * @param {string} className - Additional CSS classes
 * @param {boolean} noAutoPlay - Disable autoplay
 * @param {string} title - Video title
 * @param {boolean} isVertical - If true, use vertical video dimensions
 * @returns {string} HTML string of the iframe
 */
export function EmbedVideo({videoId, className = '', noAutoPlay = false, title = '', isVertical = false}) {
  return `
    <iframe
      width="${isVertical ? 315 : 560}"
      height="${isVertical ? 560 : 315}"
      class="${className}"
      src="https://www.youtube.com/embed/${videoId}?si=vYU81uVmaV7GSju2&amp;autoplay=${
        noAutoPlay ? 0 : 1
      }&amp;controls=1&amp;rel=0"
      title="${title}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  `;
}
