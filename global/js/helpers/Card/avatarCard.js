import xss from "xss";
import { avatar } from "../quotes/avatar";

/**
 * Returns a card containing a pullquote with a CTA link
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
export function AvatarCard({
  data: { title, liveUrl, imageUrl, authorDisplayName, authorAvatar },
}) {
  if (!title) return '';

  /**
   * Avatar Card styles
   */
  const styles = {
    root: "su-component-card su-relative su-w-full md:su-basis-1/3 su-flex su-flex-wrap su-gap-10 lg:su-content-start lg:su-max-w-[293px]",
    heading: "su-text-21 lg:su-text-24 su-leading-[25.2px] lg:su-leading-[28.8px] su-flex-grow su-my-0 su-font-serif su-w-full",
    link: "focus:su-outline-0 focus:su-ring su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red su-font-bold su-no-underline hover:su-text-digital-red dark:su-text-white dark:hover:su-text-dark-mode-red",
    authorWrapper: "su-flex su-w-full su-min-h-[56px] su-self-end lg:su-self-start su-items-center su-gap-10 su-text-black dark:su-text-white su-text-16 su-leading-[19.106px]"
  };

  const imgUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  const avatarImg = authorAvatar || imgUrl;

  const avatarClass = authorAvatar ? "su-ml-[-3px] su-mb-[-3px]" : "";

  return `
    <article aria-label="${title}" data-test="avatar-card" class="${styles.root}">
      <h3 class="${styles.heading}">
        ${xss(`<a href="${liveUrl}" class="${styles.link}">
          ${title}
        </a>`)}
      </h3>
      ${authorDisplayName ? `
        <div class="${styles.authorWrapper} ${avatarClass}">
          ${avatarImg ? `${avatar({
              image: avatarImg,
              avatarSize: "small",
              alt: `Photo of ${authorDisplayName}`
            })}` : ''}
          <span>${authorDisplayName}</span>
        </div>
      ` : ''}
    </article>
  `;
}