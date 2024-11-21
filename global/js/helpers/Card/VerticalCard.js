import xss from "xss";
import { CardThumbnail } from './CardThumbnail';
import { svgIcons } from '../index';
import { faIcon } from '../../utils'

/**
 * This function will return the appropriate heading font
 * sizes for the card's title.
 *
 * @param {string} size
 * The size can be one of the following:
 * - featured
 * - medium
 * - small
 *
 * @return {string}
 */
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
 * Card package
 *
 * @param {string} title
 * The components title
 *
 * @param {string} description
 * The components description
 *
 * @param {string} liveUrl
 * The components url
 *
 * @param {string} imageUrl
 * The components image Url
 *
 * @param {string} imageAlt
 * The components image Alt
 *
 * @param {string} taxonomy
 * The components taxonomy value
 *
 * @param {string} taxonomyUrl
 * The components taxonomy url
 *
 * @param {string} type
 * The components type
 *
 * @returns {string}
 * @constructor
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
    }) {
    
    let cardThumb = imageUrl;
    
    // cardThumb = `${liveUrl.match(/https:\/\/.*?\//)[0]}__data/assets/image/0040/68998/Quad-Arch-Close.png`;
    if (!cardThumb && liveUrl && !(liveUrl instanceof Array)) {
        cardThumb = `${liveUrl.match(/https:\/\/.*?\//)[0]}__data/assets/image/0015/130443/Quad-Arch-Close.png`; // default img for Stanford
    }

    const isRealExternalLink =
    !!liveUrl && !liveUrl?.includes("news.stanford.edu");
    /* !!liveUrl && !liveUrl?.includes("canary-us.uat.matrix.squiz.cloud/_pnp-stanford"); */


    let typeIcon = type ? type.toLowerCase().replace(/\s/g, '') : 'news';

    if(type && typeIcon && !["alert", "analysis & insights", "analysis &amp; insights", "analysis&nbsp;&amp;&nbsp;insights", "announcement", "typeAnnouncement", "case study", "case&nbsp;study", "casestudy", "news", "bookOpenCover", "event", "eventsCalendar", "feature", "featuredReading", "featuredAudio", "event&nbsp;highlights", "event highlights", "externalArrow", "externalArrowUnstyled", "arrowsRotate", "infographic", "in&nbsp;the&nbsp;news", "in the news", "inthenews", "leadership&nbsp;messages", "leadership messages", "mediaGallery", "obituary", "opinion", "photo", "plus", "podcast", "poll/quiz", "poll / quiz", "poll&nbsp;/&nbsp;quiz", "policy&nbsp;brief", "policy brief", "profile", "q&amp;a", "q & a", "q&nbsp;&amp;&nbsp;a", "research", "solutions", "survey", "timeline", "tips & takeaways", "tips &amp; takeaways", "tips&nbsp;&amp;&nbsp;takeaways", "video", "chevronRight", "close", "bullseyePointer", "pieChart", "barGraph", "shareLink", "pause", "play", "arrowRight", "trendingUp", "videoPlay"].includes(typeIcon)) {
        typeIcon = "news"
    }

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
                title: title
            })}
        </div>
        ` : ''}
        <div class="su-flex su-flex-wrap ${gapSize(cardSize)}">
            ${taxonomy ? `
                <span data-testid="vertical-card-taxonomy" class="su-relative su-inline-block su-z-10 su-mb-13 su-font-semibold ${taxonomySize(cardSize)}">
                    <a href="${taxonomyUrl}" class="su-text-digital-red dark:su-text-dark-mode-red su-no-underline hocus:su-underline hocus:su-text-black hocus:dark:su-text-white focus:su-outline-0 focus:su-ring">
                        ${xss(taxonomy)}
                    </a>
                </span>
            ` : ''}
            <h${headingLvl} class="su-w-full ${titleSize(cardSize)} su-font-serif su-my-0">
                <a href="${liveUrl}" class="su-stretched-link focus:su-outline-0 focus:before:su-ring hocus:su-underline hover:su-text-digital-red su-transition su-text-black dark:su-text-white dark:hover:su-text-dark-mode-red before:su-absolute before:su-w-full before:su-h-full before:su-block before:su-top-0 before:su-left-0">
                    ${xss(title)}
                    ${isRealExternalLink ? 
                        faIcon["ArrowUpRight"][0].replace(/class=".*?"/, 'class="svg-inline--fa fa-arrow-up-right-from-square su-inline-block su-h-auto su-align-middle su-ml-5 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform"')
                    : ''}
                </a>
            </h${headingLvl}>
            ${type ? `
            <p data-testid="vertical-card-type" class="su-flex su-font-semibold su-text-black-70 dark:su-text-black-60 su-my-0 su-gap-6 su-flex-nowrap su-items-center ${typeSize(cardSize)}">
                ${svgIcons[typeIcon]()}
                <span>${xss(type)}</span>
            </p>
            ` : ''}
            ${displayDescription && description ? `
            <div class="su-mb-0 su-w-full [&>*:last-child]:su-mb-0 ${descriptionSize(cardSize)}">
                ${xss(description)}
            </div>
            `: ''}
        </div>
    </article>`;
}

export default VerticalCard;