import xss from "xss";
import { externalLink } from "../links/ExternalLink";
import { pullQuote } from "../quotes/PullQuote";

/**
 * Pull Quote Card styles
 */
const styles = {
  root: "su-component-card-pullquote su-relative su-w-full su-pl-0 lg:su-pl-[52px] su-flex su-flex-col su-justify-center su-items-center su-gap-27",
  description: "*:su-my-0 *:su-text-18 *:dark:su-text-white *:su-font-sans *:su-w-full su-mr-auto"
};

/**
 * Creates a pull quote card HTML structure
 * 
 * @param {Object} props
 * @param {string} props.imageUrl - The image for the avatar
 * @param {string} props.imageAlt - Alt text for the avatar image
 * @param {string} props.quote - The text for the quote
 * @param {string} props.description - The text for the summary below the quote
 * @param {string} props.liveUrl - The link for the card to go to
 * @param {string} props.ctaText - The text within the call to action
 * @param {string} props.authorName - The name of the quote author
 * @returns {string} HTML string for the card
 */
export function PullQuoteCard({
  data: {
    imageUrl,
    imageAlt = "",
    quote,
    description,
    liveUrl,
    ctaText = "Read the story",
    authorName,
  },
}) {
  if (!quote) return '';

  return `
    <article 
      aria-label="Quote: ${quote}"
      data-test="pullquote-card"
      class="${styles.root}"
    >
      ${quote ? `
        ${pullQuote({
            quote,
            avatar: imageUrl,
            imageAlt: imageAlt,
            avatarSize: "medium",
            cardSize: "featured"
        })}
      ` : ''}
      
      ${description ? `
        <div data-test="pullquote-description" class="${styles.description}">
          <p>${xss(`${authorName ? `<strong>${authorName}</strong>,` : ""} ${description.replace(/<p>|<\/p>/g, "")}`)}</p>
        </div>
      ` : ''}

      ${externalLink({
        size:"large",
        ctaText: ctaText, 
        liveUrl: liveUrl
      })}
    </article>
  `;
}
