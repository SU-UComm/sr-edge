import xss from 'xss';
import hash from "object-hash";
import { FetchAdapter, containerClasses } from '../../global/js/utils';
import { EmbedVideo, Carousel, Modal } from "../../global/js/helpers";
import VideoPlay from "../../global/js/helpers/SVG-library/VideoPlay";
import basicStoryHeroTemplate from './basic-story-hero.hbs';

export default {
    async main(args, info) {
        const fnsCtx = info?.ctx || {};
        const { BASE_DOMAIN } = info.env;

         try {
            if (typeof fnsCtx !== 'object') {
                throw new Error(
                    `"info.ctx" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx?.assetId !== 'string' || fnsCtx?.assetId === '') {
                throw new Error(
                    `The "currentAssetId" field cannot be undefined and must be a non-empty string. The "${JSON.stringify(fnsCtx?.assetId)}" was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Basic Hero component: ', er);
            return `<!-- Error occurred in the Basic Story Hero component: ${er.message} -->`;
        }
        //
        // VIDEO story ID: 167010
        // Basic story ID: 165577
        // carousel story ID: 157287
        // const currentAssetId = fnsCtx?.assetId || "167010";
        const currentAssetId = fnsCtx?.assetId;
        const adapter = new FetchAdapter();
        adapter.url = `${BASE_DOMAIN}/_api/mx/storyhero?story=${currentAssetId}`;

        let heroData;
        try {
            heroData = await adapter.fetch();

            if (!heroData || typeof heroData !== 'object') {
                throw new Error("Invalid API response: heroData is missing or not an object.");
            }
        } catch (error) {
            return `<!-- An error occured in the basic hero component: ${error.message} -->`;
        }

        const { title, media, summary, pubDateFormatted, topic, mediaType } = heroData;
        const hasTopicLink = !!(
            topic &&
            topic.asset_url !== null &&
            topic.asset_url !== undefined &&
            topic.asset_url !== ""
        );
        const hasTopicText = !!(
            topic &&
            topic.asset_name !== null &&
            topic.asset_name !== undefined &&
            topic.asset_name !== ""
        );
        const TopicTag = hasTopicLink ? "a" : "span";
        const topicLink = hasTopicText ? `
          <${TopicTag}
              class="${[
                "su-font-semibold su-text-digital-red dark:su-text-dark-mode-red su-no-underline ",
                hasTopicLink ? "hocus:su-underline" : "",
            ].join(" ")}" 
              ${hasTopicLink ? `href="${topic.asset_url}"` : ''}"
          >
              ${topic.asset_name}
          </${TopicTag}>
          `: "";

        const uniqueId = hash.MD5(
            JSON.stringify('basic-story-hero') + hash.MD5(JSON.stringify(title))
        )
        const mediaFeature = `${media.featureImage.id ||
            media.featureVideo.id ||
            media.carousel !== null ? `
            <div class="su-col-span-6 su-col-start-1 md:su-col-span-12 md:su-col-start-1 su-w-full basic-story__header-slider su-overflow-visible su-rs-mt-4">
                <figure class="basic-story__header-image su-col-span-full su-relative su-z-0">
                    <div class="su-relative su-w-full">
                        ${HeroFeature({
                            url: media.featureImage.url,
                            alt: media.featureImage.alt,
                            video: media.featureVideo.id,
                            type: mediaType,
                            carousel: media.carousel,
                            captions: media.captions,
                            name: title,
                            uniqueId
                        })}
                    </div>
                    ${(media.caption || media.credit) && `
                        <figcaption class="su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white">
                        ${media.caption} ${media.caption && media.credit && ` | `}
                        ${media.credit}
                        </figcaption>
                    `}
                </figure>
            </div>
        ` : ""}`;

        const componentData = {
            classes: containerClasses({ width: "wide" }),
            pubDateFormatted,
            topicLink,
            title,
            summary: xss(summary),
            mediaFeature,
            uniqueId
        };
        return basicStoryHeroTemplate(componentData);
    }
};


function HeroFeature({ url, alt, video, type, carousel, captions, name = "", uniqueId = "" }) {
    if (type === "image") {
        return `
        <img
          src="${url}"
          alt="${alt}"
          class="su-relative su-w-full su-max-w-full"
        />
      `;
    }

    if (type === "carousel") {
        const slides = [];
        carousel.forEach((slide, i) => {
            const captionCredit =
                captions[i].caption && captions[i].credit
                    ? `${captions[i].caption} | ${captions[i].credit}`
                    : captions[i].caption || captions[i].credit;

            slides.push(`
                <div class="swiper-slide">
                    <div class="su-aspect-[3/2] su-relative">
                        <img
                            src="${slide.asset_url}"
                            alt="${slide.asset_attribute_alt}"
                            class="su-absolute su-top-0 su-left-0 su-w-full su-h-full su-object-scale-down su-object-center"
                        />
                    </div>
                    ${captionCredit && `
                    <figcaption class="su-text-16 su-text-black su-mb-0 su-rs-mt-neg1 dark:su-text-white">
                        ${captionCredit}
                    </figcaption>`}
                </div>
            `);
        });

        return Carousel({
            slides: slides.join(''),
            variant: "basicstory",
            uniqueClass: uniqueId
        });
    }

    if (type === "video") {

        if (!url) {
            return `<div class="su-relative su-max-w-full su-h-0 su-pb-[56.25%] su-overflow-hidden">
              ${EmbedVideo({
                class: "su-absolute su-top-0 su-left-0 su-w-full su-h-full",
                videoId: video,
                title: `Watch ${name}`,
                noAutoPlay: true
            })}
          </div>`
        }
        const uniqueId = 'cm_' + hash.MD5(
            JSON.stringify(video) + hash.MD5(JSON.stringify(name))
        )
        return `
          <button
            type="button"
            aria-haspopup="dialog"
            class="su-w-full su-aspect-[16/9] su-video-trigger"
            data-click="open-modal"
            data-modal-id="${uniqueId}"
          >
            <img
              src="${url}"
              alt="${alt}"
              class="su-w-full su-h-full su-absolute su-top-0 su-left-0 su-object-cover su-object-center"
            />
            <span class="su-play-button-icon-hero su-transition-all su-absolute su-bottom-20 su-left-20 *:su-w-[40px] *:su-h-[40px] *:md:su-w-[60px] *:md:su-h-[60px] *:lg:su-w-[100px] *:lg:su-h-[100px]">
              ${VideoPlay()}
            </span>
          </button>
          ${Modal({
            content: EmbedVideo({
                videoId: video,
                title: `Watch ${name}`,
                noAutoPlay: true
            }),
            title: `Watch ${name}`,
            titleId: "video-modal",
            modalId: uniqueId
        })}
        `;
    }
}