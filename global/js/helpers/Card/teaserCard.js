import xss from "xss";
import { FAIcon } from "../icons/FAIcon";

/**
 * Teaser Card styles
 */
const styles = {
  root: "su-group su-relative",
  source: "su-text-18 su-leading-snug su-font-semibold md:su-pb-13",
  heading: "su-font-bold su-leading-display su-text-24 su-m-0 md:su-pb-9",
  link: "su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red",
  linkIcon: "su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform",
  content: "su-flex su-flex-col su-text-16 su-text-black-70",
  description: "*:su-my-0 *:dark:su-text-white *:su-font-sans *:su-w-full *:su-font-normal *:su-leading-snug"
};

/**
 * Creates a teaser card HTML structure
 * 
 * @param {Object} props
 * @param {string} props.credit - Credit text
 * @param {Object} props.data - Card data
 * @param {string} props.data.title - Card title
 * @param {string} props.data.liveUrl - URL to link to
 * @param {string} props.data.authorName - Author name
 * @param {string} props.data.description - Description text
 * @param {string} props.data.source - Source text
 * @param {boolean} props.data.isCustomDescription - Whether description is custom
 * @returns {string} HTML string for the card
 */
export function TeaserCard({ credit, data }) {
  const {
    title,
    liveUrl,
    authorName,
    description,
    source,
    isCustomDescription,
  } = data;

  return `
    <article aria-label="${title}" class="${styles.root}">
      ${source ? `
        <div class="${styles.source}">
          ${source}
        </div>
      ` : ''}

      <h3 class="${styles.heading}">
        <a href="${liveUrl}" class="${styles.link}">
          <span>${xss(title)}</span>
          ${FAIcon({
            icon: "arrow-up-right",
            set: "regular",
            attributes:{
              width: 12,
              classes: styles.linkIcon
            }
          })}
        </a>
      </h3>

      <div class="${styles.content}">
        <div>
          ${isCustomDescription ? '<strong>Featured scholar:</strong>' : ''}
          ${credit}
        </div>

        <div>
          ${description ? `
            <div data-test="pullquote-description" class="${styles.description}">
              <p>${xss(`${authorName ? `<span class="su-font-semibold">${authorName}</span>,` : ''} ${description.replace(/<p>|<\/p>/g, '')}`)}</p>
            </div>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}
