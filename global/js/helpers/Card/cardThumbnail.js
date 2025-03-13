import { mediaRatio } from "../media/MediaRatio";
import { cnb } from "cnbuilder";
import { FAIcon } from "../icons/FAIcon";
/**
 * Video play button position classes based on card size
 */
const videoPlayClasses = {
  small: "su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",
  medium: "su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]",
  large: "su-left-13 su-bottom-13 [&>svg]:su-text-[4rem]",
  featured: "su-left-13 su-bottom-13 md:su-left-27 md:su-bottom-27 [&>svg]:su-text-[4rem] [&>svg]:md:su-text-[6rem]",
  "vertical-video": "su-left-32 su-bottom-34 sm:su-left-48 sm:su-bottom-61 lg:su-left-32 lg:su-bottom-34 2xl:su-left-48 2xl:su-bottom-61 [&>svg]:su-text-[6rem]"
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
  videoIconClasses
}) {
  if (videoUrl) {
    const videoMedia = `
        {/* Add a dark overlay over the image when used in Vertical Video Cards */}
        ${size === "vertical-video" ? `
          <div
            aria-hidden="true"
            class="su-absolute su-inset-0 su-bg-gradient-to-t su-from-black-true/80 su-via-80% su-via-black-true/10 su-pointer-events-none su-z-20"
          />
        ` : ""}
        ${videoUrl ? `
          <span
            class="${cnb(
              "su-absolute su-leading-none",
              size === "vertical-video" && "su-z-30",
              videoPlayClasses[size],
              videoIconClasses
            )}">
            ${FAIcon({
              set: "regular",
              icon: "circle-play",
              class: "su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]",
            })}
          </span>
        ` : ""
      }
    `;

    return `
      <button
        class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full"
        type="button"
        aria-haspopup="dialog"
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
