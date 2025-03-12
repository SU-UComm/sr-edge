import xss from "xss";
import { formatNewsDate } from "../../utils/formatNewsDate";
import { avatar } from "../quotes/avatar";
import { ArrowRight } from "../SVG-library";
/**
 * Narrow Horizontal Card styles
 */
const styles = {
  root: "su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10",
  contentWrapper: "su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3",
  source: "su-text-16 lg:su-text-18 su-leading-[130%] su-font-semibold su-my-0",
  taxonomy: "su-relative su-text-16 su-leading-[2.3rem] lg:su-text-18 su-z-10 su-mb-0 su-font-semibold",
  taxonomyLink: "focus:su-outline-0 focus:su-ring su-text-digital-red su-no-underline hover:su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red hocus:su-underline",
  heading: "su-font-serif su-basefont-23 su-my-0",
  link: "su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red",
  linkIcon: "su-text-digital-red dark:su-text-dark-mode-red su-translate-x-0 su-translate-y-0 su-transition group-hocus:su-translate-y-[-.1em] group-hocus:su-translate-x-[.1em] su-inline-block",
  description: "su-my-0 su-text-16 su-leading-[2.4rem] lg:su-text-18 lg:su-leading-[2.7rem]",
  descriptionContent: "su-mb-0 su-w-full [&>*:last-child]:su-mb-0",
  authorWrapper: "su-flex su-w-full su-min-h-[56px] su-self-end lg:su-self-start su-items-center su-gap-10 su-text-black dark:su-text-white su-text-16 su-leading-[19.106px]",
  date: "su-text-black-70 dark:su-text-black-60 su-text-16 lg:su-text-18 su-leading-[130%] su-font-semibold su-my-0"
};

/**
 * Creates a narrow horizontal card HTML structure
 * 
 * @param {Object} props
 * @param {Object} props.data - Card data
 * @param {string} props.data.title - Card title
 * @param {string} props.data.description - Description text
 * @param {string} props.data.liveUrl - URL to link to
 * @param {string} props.data.imageUrl - Image URL
 * @param {string} props.data.date - Date string
 * @param {string} props.data.authorAvatar - Author avatar URL
 * @param {string} props.data.authorDisplayName - Author name
 * @param {string} props.data.displayConfiguration - Display configuration type
 * @param {string} props.data.taxonomyFeaturedUnitLandingPageUrl - Taxonomy URL
 * @param {string} props.data.taxonomyFeaturedUnitText - Taxonomy text
 * @param {boolean} props.data.isTeaser - Whether card is a teaser
 * @param {string} props.data.storySource - Story source text
 * @returns {string} HTML string for the card
 */
export function NarrowHorizontalCard({
  data: {
    title,
    description,
    liveUrl,
    imageUrl,
    date,
    authorAvatar,
    authorDisplayName,
    displayConfiguration,
    taxonomyFeaturedUnitLandingPageUrl,
    taxonomyFeaturedUnitText,
    isTeaser,
    storySource,
  }
}) {
  const imgUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  const avatarRef = authorAvatar || imgUrl;
  const avatarClass = authorAvatar ? "su-ml-[-3px] su-mb-[-3px]" : "";

  let isExternalLink = isTeaser || false;
  if (typeof isTeaser === "object") {
    isExternalLink = isTeaser[0] === "true";
  }

  const authorDate = `
    <time class="su-text-black-70 dark:su-text-black-60 su-font-semibold">
      ${authorDisplayName ? `
        <span>${xss(`&nbsp;|&nbsp;${formatNewsDate(date)}`)}</span>
      ` : formatNewsDate(date)}
    </time>
  `;

  const authorDetails = authorDisplayName ? `
    <span class="su-my-0">
      ${authorDisplayName}
      ${authorDate}
    </span>
  ` : authorDate;

  return `
    <article aria-label="${title}" class="${styles.root}" data-testid="narrow-horizontal-card">
      <div class="${styles.contentWrapper}">
        ${displayConfiguration === "In the News" && storySource ? `
          <p class="${styles.source}">
            ${xss(storySource)}
          </p>
        ` : ''}

        ${displayConfiguration === "Announcements" && taxonomyFeaturedUnitText ? `
          <p data-testid="vertical-card-taxonomy" class="${styles.taxonomy}">
            ${taxonomyFeaturedUnitLandingPageUrl ? `
              <a href="${taxonomyFeaturedUnitLandingPageUrl}" class="${styles.taxonomyLink}">
                ${xss(taxonomyFeaturedUnitText)}
              </a>
            ` : `
              <span>${xss(taxonomyFeaturedUnitText)}</span>
            `}
          </p>
        ` : ''}

        <h3 class="${styles.heading}">
          <a class="${styles.link}" href="${liveUrl}">
            <span>${xss(title)}</span>
            ${isExternalLink ? `
              <span class="${styles.linkIcon}">
                <span class="[&>*]:su-inline-block [&>*]:su-stroke-current [&>*]:su-w-24 [&>*]:su-h-23 [&>*]:su-rotate-[-45deg] [&>*]:su-translate-x-[.12em] [&>*]:su-translate-y-[-.08em]">
                  ${ArrowRight()}
                </span>
              </span>
            ` : ''}
          </a>
        </h3>

        ${description ? `
          <div data-testid="narrow-horizontal-card-description" class="${styles.description}">
            <div class="${styles.descriptionContent}">
              ${xss(description)}
            </div>
          </div>
        ` : ''}

        ${displayConfiguration === "Leadership Messages" ? `
          <div class="${styles.authorWrapper} ${avatarClass}">
            ${avatarRef ? `
              ${avatar({
                  image: avatarRef,
                  avatarSize: "small",
                  alt: `Photo of ${authorDisplayName}`
              })}
            ` : ''}
            ${authorDetails}
          </div>
        ` : ''}

        ${date && displayConfiguration !== "Leadership Messages" && displayConfiguration !== "In the News" ? `
          <p class="${styles.date}">
            ${formatNewsDate(date)}
          </p>
        ` : ''}
      </div>
    </article>
  `;
}
