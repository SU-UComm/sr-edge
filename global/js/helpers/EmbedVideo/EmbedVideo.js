export function EmbedVideo(props) {
  const { videoId, className = "", noAutoPlay, title, isVertical } = props;

    return `
        <iframe
            width="${isVertical ? 315 : 560}"
            height="${isVertical ? 560 : 315}"
            class="${className}"
            src="https://www.youtube.com/embed/${videoId}?si=vYU81uVmaV7GSju2&amp;autoplay=${noAutoPlay ? 0 : 1}&amp;controls=1&amp;rel=0"
            title="${title}"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen="true"
            data-modal="iframe"
            loading="lazy"
        ></iframe>
    `;
}

export default EmbedVideo;