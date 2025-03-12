import { FAIcon } from "../icons";
import { CardThumbnail } from "./cardThumbnail";
import xss from "xss";
/**
 * Horizontal Video Card styles
 */
const styles = {
  root: "su-relative su-flex su-flex-col lg:su-flex-row su-gap-30 md:su-gap-38 2xl:su-gap-72 su-items-start lg:su-items-center su-p-34 md:su-p-61 lg:su-p-38 2xl:su-pl-76 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white",
  contentWrapper: "su-relative su-w-full lg:su-basis-[50%] xl:su-basis-[40%] 2xl:su-basis-[30%]",
  heading: "su-type-3 su-leading-display su-rs-mb-0",
  link: "su-group su-stretched-link su-no-underline hocus:su-underline su-text-black hocus:su-text-digital-red dark:su-text-white dark:hocus:su-text-dark-mode-red focus:su-outline-none",
  linkIconWrapper: "su-whitespace-nowrap",
  linkIcon: "fa-fw su-inline-block su-align-middle su-text-[0.8em] su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform",
  description: "su-max-w-prose md:su-max-w-[45ch] lg:su-max-w-none su-card-paragraph *:last:su-mb-0 *:su-leading-display xl:*:su-leading-snug",
  imageWrapper: "su-w-full lg:su-basis-[50%] xl:su-basis-[60%] 2xl:su-basis-[70%] su-relative focus-within:su-ring-4",
  videoIcon: "group-hocus:su-scale-110 su-transition-transform"
};

/**
 * Creates a horizontal video card HTML structure
 * 
 * @param {Object} props
 * @param {string} props.heading - The card heading
 * @param {string} props.description - Body text of the card
 * @param {string} props.youtubeId - The video ID in the YouTube URL
 * @param {string} props.videoImageUrl - The URL of the video preview image
 * @param {string} props.videoImageAlt - The alt text of the video preview image
 * @param {string} props.internalUrl - Internal Matrix asset link to the story
 * @param {string} props.manualUrl - Manually entered URL (internal or external)
 * @returns {string} HTML string for the card
 */
export function HorizontalVideoCard({
  heading,
  description,
  youtubeId,
  videoImageUrl,
  videoImageAlt,
  internalUrl,
  manualUrl,
}) {
  const isRealExternalLink = !!manualUrl && !manualUrl?.includes("news.stanford.edu");
  const url = internalUrl || manualUrl;

  return `
    <article class="${styles.root}">
      <div class="${styles.contentWrapper}">
        ${url ? `
          <h3 class="${styles.heading}">
            <a href="${url}" class="${styles.link}" ${isRealExternalLink ? 'rel="noopener noreferrer"' : ''}>
              ${heading}
              ${isRealExternalLink ? `
                <span class="${styles.linkIconWrapper}">
                  &#65279;
                  ${FAIcon({
                    icon:"arrow-up-right",
                    set: "regular",
                    title: "(link is external)",
                    width: 24,
                    class: styles.linkIcon
                  })}
                </span>
              ` : ''}
            </a>
          </h3>
        ` : `
          <h3 class="${styles.heading}">${heading}</h3>
        `}
        ${description ? `
          <div class="${styles.description}">
            ${xss(description)}
          </div>
        ` : ''}
      </div>
      <div class="${styles.imageWrapper}">
        ${CardThumbnail({
            imageUrl: videoImageUrl,
            alt: videoImageAlt,
            title: heading,
            aspectRatio: "video",
            videoUrl: youtubeId,
            size: "featured",
            videoIconClasses: styles.videoIcon
          }
        )}
      </div>
    </article>
  `;
}
