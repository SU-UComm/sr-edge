import xss from "xss";
import { CardThumbnail } from "./cardThumbnail";
import { EventStartEndDate } from "./eventStartEndDate";
import {
  Alert,
  AnalysisAndInsights,
  CaseStudy,
  Event,
  EventHighlights,
  Feature,
  Infographic,
  InTheNews,
  LeadershipMessages,
  Obituary,
  Opinion,
  Photo,
  PolicyBrief,
  PollQuiz,
  Profile,
  Research,
  Solutions,
  Survey,
  Timeline,
  TipsAndTakeaways,
  TypeAnnouncement,
  UniversityUpdates,
  News,
  QuestionAnswer,
  Video,
  Podcast,
  BookOpenCover,
} from "../SVG-library";
import { isRealExternalLink } from '../../utils/isRealExternalLink';
/**
 * Horizontal Card styles
 */
const styles = {
  root: "listing-item su-flex su-relative",
  imageWrapper: "su-shrink-0",
  contentWrapper: "su-flex su-flex-col",
  taxonomy: "su-mb-0 su-text-16 su-font-semibold su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red",
  taxonomyLink: "focus:su-outline-0 focus:su-ring su-text-digital-red su-no-underline hover:su-text-digital-red dark:su-text-dark-mode-red hover:dark:su-text-dark-mode-red su-block su-mt-[-6px]",
  heading: "su-font-sans su-my-0 su-group",
  link: "su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red",
  linkIcon: "su-inline-block su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform",
  type: "su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start",
  typeText: "su-font-semibold su-text-14 md:su-text-16 su-leading-4",
  description: "su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0",
  descriptionContent: "su-mb-0 su-w-full [&>*:last-child]:su-mb-0"
};

// Card size specific styles
const cardSizeStyles = {
  large: {
    gap: "su-gap-20 lg:su-gap-48",
    contentGap: "su-gap-9 lg:su-gap-12",
    title: "su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]",
    imageWrapper: "su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]"
  },
  small: {
    gap: "su-gap-19",
    contentGap: "su-gap-6",
    title: "su-text-18 su-font-semibold su-leading-[21.495px]",
    imageWrapper: "su-w-[73px] su-h-[73px]"
  }
};

/**
 * Creates a horizontal card HTML structure
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
 * @param {string} props.data.date - Date string
 * @param {string} props.data.endDate - End date string
 * @param {string} props.data.videoUrl - Video URL if present
 * @param {string} props.cardSize - Size variant of the card
 * @returns {string} HTML string for the card
 */
export function HorizontalCard({
  data: {
    title,
    description,
    liveUrl,
    imageUrl,
    imageAlt,
    taxonomy,
    taxonomyUrl,
    type,
    date,
    endDate,
    videoUrl,
    uniqueID,
  },
  cardSize = "small"
}) {
  const sizeStyles = cardSizeStyles[cardSize];
  // const isRealExternalLink = !!liveUrl && !liveUrl?.includes("news.stanford.edu");
  const SVGMap = new Map();
  SVGMap.set("alert", Alert());
  SVGMap.set("analysis & insights", AnalysisAndInsights());
  SVGMap.set("analysis &amp; insights", AnalysisAndInsights());
  SVGMap.set("analysis&nbsp;&amp;&nbsp;insights", AnalysisAndInsights());
  SVGMap.set("case study", CaseStudy({variant: "light"}));
  SVGMap.set("case&nbsp;study", CaseStudy({variant: "light"}));
  SVGMap.set("casestudy", CaseStudy({variant: "light"}));
  SVGMap.set("event", Event());
  SVGMap.set("event&nbsp;highlights", EventHighlights());
  SVGMap.set("event highlights", EventHighlights());
  SVGMap.set("feature", Feature());
  SVGMap.set("infographic", Infographic());
  SVGMap.set("in&nbsp;the&nbsp;news", InTheNews());
  SVGMap.set("in the news", InTheNews());
  SVGMap.set("inthenews", InTheNews());
  SVGMap.set("leadership&nbsp;messages", LeadershipMessages());
  SVGMap.set("leadership messages", LeadershipMessages());
  SVGMap.set("obituary", Obituary());
  SVGMap.set("opinion", Opinion());
  SVGMap.set("photo", Photo());
  SVGMap.set("policy&nbsp;brief", PolicyBrief({variant: "light"}));
  SVGMap.set("policy brief", PolicyBrief({variant: "light"}));
  SVGMap.set("poll/quiz", PollQuiz());
  SVGMap.set("poll / quiz", PollQuiz());
  SVGMap.set("poll&nbsp;/&nbsp;quiz", PollQuiz());
  SVGMap.set("profile", Profile());
  SVGMap.set("research", Research());
  SVGMap.set("solutions", Solutions());
  SVGMap.set("survey", Survey());
  SVGMap.set("timeline", Timeline());
  SVGMap.set("tips & takeaways", TipsAndTakeaways());
  SVGMap.set("tips &amp; takeaways", TipsAndTakeaways());
  SVGMap.set("tips&nbsp;&amp;&nbsp;takeaways", TipsAndTakeaways());
  SVGMap.set("university&nbsp;updates", UniversityUpdates());
  SVGMap.set("university updates", UniversityUpdates());
  SVGMap.set("announcement", TypeAnnouncement());
  SVGMap.set("news", News());
  SVGMap.set("q&amp;a", QuestionAnswer());
  SVGMap.set("q&a", QuestionAnswer());
  SVGMap.set("q & a", QuestionAnswer());
  SVGMap.set("q&nbsp;&amp;&nbsp;a", QuestionAnswer());
  SVGMap.set("video", Video());
  SVGMap.set("podcast", Podcast({variant: "light"}));
  SVGMap.set("book", BookOpenCover({ className: "" }));
  
  return `
    <article aria-label="${title}" class="${styles.root} ${sizeStyles.gap}" data-testid="horizontal-card" >
      
    ${cardSize === "large" ? `
        <div class="${styles.imageWrapper} ${sizeStyles.imageWrapper}">
          ${imageUrl ? `
            ${CardThumbnail({
                imageUrl,
                alt: imageAlt,
                videoUrl,
                mediaType: "image",
                aspectRatio: "card-large",
                size: cardSize,
                uniqueId: uniqueID
            })}
          ` : ''}
        </div>
      ` : ''}

      ${cardSize === "small" && imageUrl ? `
        <div class="${styles.imageWrapper} ${sizeStyles.imageWrapper} su-relative">
            ${CardThumbnail({
                imageUrl,
                alt: imageAlt,
                videoUrl,
                mediaType: "image",
                aspectRatio: "large",
                size: cardSize,
                uniqueId: uniqueID
            })}
        </div>
      ` : ''}

      <div class="${styles.contentWrapper} ${sizeStyles.contentGap}">
        ${cardSize === "small" && taxonomy ? `
          <p class="${styles.taxonomy}" data-testid="horizontal-card-taxonomy">
            <a href="${taxonomyUrl}" class="${styles.taxonomyLink}">
              ${xss(taxonomy)}
            </a>
          </p>
        ` : ''}

        <h3 class="${styles.heading} ${sizeStyles.title}">
          <a href="${liveUrl}" class="${styles.link}">
            ${xss(title)}
            ${isRealExternalLink(liveUrl) ? `
              <svg width="${cardSize === "small" ? 12 : 15}" aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right" class="svg-inline--fa fa-arrow-up-right su-inline-block su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M328 96c13.3 0 24 10.7 24 24l0 240c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-182.1L73 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l231-231L88 144c-13.3 0-24-10.7-24-24s10.7-24 24-24l240 0z"></path></svg>
            `: ''}
            </a>
        </h3>

        ${cardSize === "small" ? `
          <div data-testid="horizontal-event-date">
            ${EventStartEndDate({
              start: date,
              end: endDate
            })}
          </div>
        ` : ''}

        ${cardSize === "large" && type ? `
          <p data-testid="horizontal-card-type" class="${styles.type}">
            ${SVGMap.get(type.toLowerCase())}
            <span class="${styles.typeText}">${xss(type)}</span>
          </p>
        ` : ''}

        ${cardSize === "large" && description ? `
          <div data-testid="horizontal-card-description" class="${styles.description}">
            <div class="${styles.descriptionContent}">
              ${xss(description)}
            </div>
          </div>
        ` : ''}
      </div>
    </article>
  `;
}
