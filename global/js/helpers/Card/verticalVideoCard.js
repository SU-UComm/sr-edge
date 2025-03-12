import { CardThumbnail } from "./cardThumbnail";
/**`
 * Vertical Video Card styles
 */
const styles = {
  root: "su-relative su-flex su-flex-col su-text-white su-bg-black-true",
  imageWrapper: "su-relative su-w-full",
  videoIcon: "group-hocus:su-scale-110 su-transition-transform",
  contentWrapper: "su-absolute su-inset su-z-40 su-px-32 2xl:su-px-48 su-bottom-100 sm:su-bottom-120 lg:su-bottom-80 2xl:su-bottom-120 su-pointer-events-none su-text-center su-flex su-flex-col su-items-center su-w-full su-rs-mb-3",
  heading: "su-text-[3.6rem] sm:su-text-[4.8rem] lg:su-text-[3.6rem] 2xl:su-text-[4.8rem] su-leading-display su-mb-6",
  subheading: "su-text-21 su-mb-0 su-leading-display xl:su-leading-snug"
};

/**
 * Creates a vertical video card HTML structure
 *
 * @param {Object} props
 * @param {string} props.heading - The card heading
 * @param {string} props.subheading - The card subheading
 * @param {string} props.youtubeId - The video ID of the YouTube short
 * @param {string} props.videoImageUrl - The URL of the video preview image
 * @param {string} props.videoImageAlt - The alt text of the video preview image
 * @returns {string} HTML string for the card
 */
export function VerticalVideoCard({
  heading,
  subheading,
  youtubeId,
  videoImageUrl,
  videoImageAlt,
}) {
  return `
    <article class="${styles.root}">
      <div class="${styles.contentWrapper}">
        <h3 class="${styles.heading}">${heading}</h3>
        <p class="${styles.subheading}">${subheading}</p>
      </div>
      <div class="${styles.imageWrapper}">
        ${CardThumbnail({
          imageUrl: videoImageUrl,
          alt: videoImageAlt,
          title: heading,
          aspectRatio: "vertical-video",
          videoUrl: youtubeId,
          size: "vertical-video",
          videoIconClasses: styles.videoIcon,
        })}
      </div>
    </article>
  `;
}
