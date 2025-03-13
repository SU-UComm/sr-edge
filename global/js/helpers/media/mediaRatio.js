import { cnb } from "cnbuilder";

/**
 * Creates a media container with specific aspect ratio
 * 
 * @param {string} imageUrl - URL of the image
 * @param {string} imageAlt - Alt text for the image
 * @param {string} aspectRatio - Aspect ratio preset
 * @param {string} videoUrl - URL of the video
 * @param {string} children - Additional HTML content
 * @returns {string} HTML string of the media container
 */
export function mediaRatio({
  children = '',
  imageUrl,
  imageAlt = '',
  aspectRatio = "card-small",
  videoUrl,
}) {
  return `
    <span
      class="${cnb(
        "su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block",
        aspectRatio === "card-small" && "su-aspect-[3/2]",
        aspectRatio === "card-medium" && "su-aspect-[3/2]",
        aspectRatio === "card-large" && "su-aspect-[3/2]",
        aspectRatio === "card-featured" && "su-aspect-[3/2]",
        aspectRatio === "square" && "su-aspect-[1/1]",
        aspectRatio === "video" && "su-aspect-[16/9]",
        aspectRatio === "vertical-video" && "su-aspect-[9/16]"
      )}"
    >
      ${videoUrl ? `
        <video class="su-absolute su-object-cover su-object-center su-size-full">
          <source src="${videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      ` : ''}
      ${imageUrl ? `
        <img
          class="su-absolute su-object-cover su-object-center su-size-full"
          src="${imageUrl}"
          alt="${imageAlt}"
        />
      ` : ''}
      ${children}
    </span>
  `;
}
