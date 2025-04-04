import xss from "xss";
import { cnb } from "cnbuilder";
import { CardThumbnail } from "./cardThumbnail";
import { FAIcon } from "../icons/FAIcon";
import { svgIcons } from "../SVG-library";

/**
 * Vertical Card styles and utilities
 */

// Title size utilities
function titleSize(size) {
  if (size === "featured")
    return "su-text-[35px] md:su-text-[40px] lg:su-text-[43px] su-leading-[42px] md:su-leading-[48px] lg:su-leading-[51.6px]";
  if (size === "medium")
    return "su-text-21 lg:su-text-[33px] su-leading-[25.2px] lg:su-leading-[39.6px]";
  return "su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px]";
}

function descriptionSize(size) {
  if (size === "featured")
    return "*:su-text-18 su-text-18 *:md:su-text-19 md:su-text-19 *:su-leading-[22.5px] su-leading-[22.5px] *:md:su-leading-[23.75px] md:su-leading-[23.75px] *:su-mt-4 *:md:su-mt-14";
  return "*:su-text-19 *:su-leading-[23.75px] su-text-19 su-leading-[23.75px]";
}

function gapSize(size) {
  if (size === "featured") return "su-gap-11 md:su-gap-13 lg:su-gap-13";
  return "su-gap-11 md:su-gap-12 lg:su-gap-9";
}

function imageMargin(size) {
  if (size === "featured") return "su-mb-15 md:su-mb-26 lg:su-mb-38";
  return "su-mb-15 md:su-mb-18 lg:su-mb-19";
}

function taxonomySize(size) {
  if (size === "featured") return "su-text-20 md:su-text-20 su-leading-[26px]";
  if (size === "medium")
    return "su-text-16 md:su-text-16 md:su-text-20 su-leading-[20.8px] md:su-leading-[26px]";
  return "su-text-18 su-leading-[23.4px]";
}

function typeSize(size) {
  if (size === "featured")
    return "su-text-18 su-leading-[23.4px] md:su-text-20 md:su-leading-[26px] lg:su-text-20 lg:su-leading-[26px]";
  if (size === "medium")
    return "su-text-16 su-leading-[20.8px] lg:su-text-18 lg:su-leading-[23.4px]";
  return "su-text-16 su-leading-[20.8px]";
}

/**
 * Creates a vertical card HTML structure
 * 
 * @param {Object} props
 * @param {Object} props.data - Card data
 * @param {string} props.data.title - Card title
 * @param {string} props.data.description - Description text
 * @param {string} props.data.liveUrl - URL to link to
 * @param {string} props.data.imageUrl - Image URL
 * @param {string} props.data.imageAlt - Image alt text
 * @param {string} props.data.taxonomy - Taxonomy text
 * @param {string} props.data.taxonomyUrl - Taxonomy URL
 * @param {string} props.data.type - Content type
 * @param {string} props.data.videoUrl - Video URL if present
 * @param {string} props.cardSize - Size variant of the card
 * @param {boolean} props.displayDescription - Whether to show description
 * @param {boolean} props.displayThumbnail - Whether to show thumbnail
 * @param {number} props.headingLvl - Heading level (2 or 3)
 * @returns {string} HTML string for the card
 */
export function VerticalCard({
  data: {
    title,
    description,
    liveUrl,
    imageUrl,
    imageAlt,
    taxonomy,
    taxonomyUrl,
    type,
    videoUrl,
  },
  cardSize = "small",
  displayDescription = true,
  displayThumbnail = true,
  headingLvl = 2,
  uniqueId,
}) {
  let cardThumb = imageUrl;

  if (!cardThumb && liveUrl && !(liveUrl instanceof Array)) {
    cardThumb = `${
      liveUrl.match(/https:\/\/.*?\//)[0]
    }__data/assets/image/0015/130443/Quad-Arch-Close.png`;
  }

  const isRealExternalLink = !!liveUrl && !liveUrl?.includes("news.stanford.edu");

  const headingContent = `
    <a href="${liveUrl}" 
       class="${cnb(
        "su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red",
        "focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none",
        "focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"
      )}">
      <span>${xss(title)}</span>
      ${isRealExternalLink ? `
      ${FAIcon({
        icon: "arrow-up-right",
        set: "regular",
        attributes: {
          width: cardSize === "featured" ? 20 : 15,
          classes: "su-inline-block su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform"
        }
      })}
      ` : ''}
    </a>
  `;

  return `
    <article aria-label="${title}" class="su-component-card su-relative su-w-full" data-testid="vertical-card">
      ${displayThumbnail ? `
        <div class="${imageMargin(cardSize)}">
        ${CardThumbnail({
            imageUrl: cardThumb,
            alt: imageAlt,
            aspectRatio: `card-${cardSize}`,
            videoUrl: type === "Video" ? videoUrl : "",
            size: cardSize,
            title: title,
            uniqueId
        })}
        </div>
      ` : ''}

      <div class="su-flex su-flex-wrap ${gapSize(cardSize)}">
        ${headingLvl === 2 ? `
          <h2 class="su-w-full ${titleSize(cardSize)} su-font-serif su-my-0 su-order-2">
            ${headingContent}
          </h2>
        ` : `
          <h3 class="su-w-full ${titleSize(cardSize)} su-font-serif su-my-0 su-order-2">
            ${headingContent}
          </h3>
        `}

        ${taxonomy ? `
          <span data-testid="vertical-card-taxonomy"
                class="su-relative su-inline-block su-z-10 su-font-semibold su-order-1 ${taxonomySize(cardSize)}">
            <a href="${taxonomyUrl}"
               class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-black dark:focus-visible:su-ring-white focus-visible:su-outline-none">
              ${xss(taxonomy)}
            </a>
          </span>
        ` : ''}

        ${type ? `
          <p data-testid="vertical-card-type"
             class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center su-order-3 ${typeSize(cardSize)}">
            <span class="type-icon" data-type="${type.toLowerCase()}"></span>
              ${svgIcons[type.toLowerCase()]()}
            <span>${xss(type)}</span>
          </p>
        ` : ''}

        ${displayDescription && description ? `
          <div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0 su-order-4 ${descriptionSize(cardSize)}">
            ${xss(description)}
          </div>
        ` : ''}
      </div>
    </article>
  `;
}
