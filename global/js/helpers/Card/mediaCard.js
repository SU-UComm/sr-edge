import xss from "xss";
import { SidebarHeading } from "../headings";
import { FAIcon } from "../icons/FAIcon";
/**
 * Media Card styles
 */
const styles = {
  root: "su-component-card-media md:su-min-h-[38.4rem] su-relative su-w-full md:su-px-0 su-flex su-flex-wrap su-justify-center su-gap-20 md:su-gap-36 md:su-gap-48 md:su-flex-nowrap su-items-center",
  imageWrapper: "su-relative su-w-full su-px-20 md:su-px-0 su-h-[34.2rem] lg:su-h-[57.2rem] lg:su-py-30 su-min-w-[24.9rem] lg:su-min-w-[38.2rem] lg:su-max-w-[38.2rem] su-flex su-items-center su-justify-center",
  image: "su-media-card-thumb su-size-full su-object-scale-down su-object-center",
  textWrapper: "su-media-card-text su-grow su-w-full md:su-w-auto",
  taxonomyWrapper: "su-mb-20 md:su-mb-27",
  title: "su-text-[3.5rem] su-leading-tight md:su-text-[4rem] lg:su-text-[4.3rem]",
  titleWithAuthor: "su-mb-5",
  titleNoAuthor: "su-mb-15 md:su-mb-19",
  link: "su-group su-text-black su-transition dark:su-text-white hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red hocus:su-underline",
  linkIcon: "su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform",
  typeWrapper: "su-text-18 md:su-text-16 su-mb-15 md:su-mb-19 su-gap-6 su-text-black-70 dark:su-text-black-50 su-flex su-nowrap su-items-center su-leading-none",
  typeText: "su-font-semibold",
  description: "*:su-my-0 *:su-leading-[125%] su-leading-[125%] *:su-text-18 su-text-18 md:*:su-text-19 md:su-text-19 lg:*:su-text-21 lg:su-text-21 dark:su-text-white su-font-sans su-w-full"
};

/**
 * Returns a card featuring media (book or podcast)
 *
 * @param {string} imageUrl
 * The image for the avatar
 *
 * @param {string} quote
 * The text for the quote
 *
 * @param {string} description
 * The text for the summary below the quote
 *
 * @param {string} liveUrl
 * The link for the card to go to
 *
 * @param {string} ctaText
 * The text within the call to action at the bottom of the card
 *
 * @returns {string}
 */
export function MediaCard({
  data: {
    type,
    title,
    taxonomy,
    imageUrl,
    imageAlt,
    description,
    liveUrl,
    author,
  },
}) {
  if (!title) return '';
  
  const isRealExternalLink = !!liveUrl && !liveUrl?.includes("news.stanford.edu");

  let typeIcon = '';
  let iconTestId = '';

  if (type === "Book") {
    typeIcon = "book-open-cover";
    iconTestId = "svg-book-open-cover";
  } else if (type === "Podcast") {
    typeIcon = "microphone";
    iconTestId = "svg-microphone";
  } else if (type === "Magazine") {
    typeIcon = "book-open";
    iconTestId = "svg-book-open";
  }

  return `
    <article aria-label="${title}" data-test="media-card" class="${styles.root}">
      ${imageUrl ? `
        <div class="${styles.imageWrapper}">
          <img class="${styles.image}" src="${imageUrl}" alt="${imageAlt || ''}" />
        </div>
      ` : ''}
      
      <div class="${styles.textWrapper}">
        ${taxonomy ? `
          <div class="${styles.taxonomyWrapper}">
            ${SidebarHeading({
                headingSize: "p",
                icon: taxonomy,
                color: "media",
                title: taxonomy
            })}
          </div>
        ` : ''}

        ${title ? `
          <h3 class="${styles.title} ${author ? styles.titleWithAuthor : styles.titleNoAuthor}">
            ${liveUrl ? `
              <a href="${liveUrl}" class="${styles.link}">
                <span>${xss(title)}</span>
                ${isRealExternalLink ? `
                  <i class="fa-regular fa-arrow-up-right ${styles.linkIcon}" aria-hidden="true" style="width: 24px;"></i>
                  ${FAIcon({
                    icon: "arrow-up-right",
                    set: "regular",
                    width: 24,
                    class: styles.linkIcon
                  })}
                ` : ''}
              </a>
            ` : `
              <span class="su-text-black su-transition dark:su-text-white">${title}</span>
            `}
          </h3>
        ` : ''}

        ${author ? `
          <div data-test="mediacard-author" class="su-mb-15 md:su-mb-19">
            ${author}
          </div>
        ` : ''}

        ${type ? `
          <div class="${styles.typeWrapper}">
            <i class="fa-solid fa-${typeIcon}" data-testid="${iconTestId}"></i>
            ${FAIcon({
                icon: typeIcon,
                set: "solid",
            })}
            <span class="${styles.typeText}">${type}</span>
          </div>
        ` : ''}

        ${description ? `
          <div data-test="mediacard-description" class="${styles.description}">
            ${xss(description)}
          </div>
        ` : ''}
      </div>
    </article>
  `;
}
