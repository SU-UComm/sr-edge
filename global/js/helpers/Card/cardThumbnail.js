import { mediaRatio } from "../media/MediaRatio";
import { cnb } from "cnbuilder";
/**
 * Video play button position classes based on card size
 */
const videoPlayClasses = {
  small: "su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",
  medium: "su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]",
  large: "su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",
  featured: "su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]",
  "vertical-video": "su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&>svg]:su-text-[6rem]",
  "vertical-video-featured": "su-left-1/2 su-top-1/2 -su-translate-x-1/2 -su-translate-y-1/2 [&>svg]:su-text-[6rem]"
};

/**
 * Creates a card thumbnail HTML structure
 * 
 * @param {Object} props
 * @param {string} props.imageUrl - URL of the thumbnail image
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.aspectRatio - Aspect ratio for the media container
 * @param {string} props.videoUrl - URL of the video if present
 * @param {string} props.size - Size variant of the thumbnail
 * @param {string} props.title - Title text
 * @param {string} props.videoIconClasses - Additional classes for video icon
 * @returns {string} HTML string for the thumbnail
 */
export function CardThumbnail({
  imageUrl,
  alt = "",
  aspectRatio,
  videoUrl,
  size = "small",
  title = "",
  videoIconClasses,
  uniqueId
}) {
  if (videoUrl) {
    const videoMedia = `
        ${( size === "vertical-video" || size === "vertical-video-featured" ) ? `
          <div
            aria-hidden="true"
            class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"
          />
        ` : ""}
        ${videoUrl ? `
          <span
            class="${cnb(
              "su-absolute su-leading-none",
              (size === "vertical-video" || size === "vertical-video-featured") && "su-z-30",
              videoPlayClasses[size],
              videoIconClasses
            )}">
            <svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg>
          </span>
        ` : ""
      }
    `;

    return `
      <button
        class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full"
        type="button"
        aria-haspopup="dialog"
        data-click="open-modal"
        data-modal-id="${uniqueId}"
      >
        ${mediaRatio({
          imageUrl,
          imageAlt: `${`Open video ${alt || ""} in a modal`}`,
          aspectRatio,
          children: videoMedia
        })}
      </button>
    `;
  }

  return `
    <div class="su-component-card-thumbnail su-w-full su-h-full">
      ${mediaRatio({
        imageUrl: imageUrl,
        imageAlt: alt,
        aspectRatio: aspectRatio
      })}
    </div>
  `;
}
