import xss from 'xss';
import { basicAssetUri, containerClasses } from "../../global/js/utils";
  
export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        const { image, title, description, linkUrl, linkText } = (args && args.displayConfiguration) || {};

        // Check for environment vars
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `Error occurred in the campaign cta component, info.fns cannot be undefined or null. The "${fnsCtx}" was received.`
                );
            }
            if (title && typeof title !== 'string') {
                throw new Error(
                    `Error occurred in the campaign cta component, title field must be a string. The "${title}" was received.`
                );
            }
            if (description && typeof description !== 'string') {
                throw new Error(
                    `Error occurred in the campaign cta component, description field must be a string. The "${description}" was received.`
                );
            }
            if (linkText && typeof linkText !== 'string') {
                throw new Error(
                    `Error occurred in the campaign cta component, linkText field must be a string. The "${linkText}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }
        
        let data = null;
        let linkData = null;

        if (linkUrl) {
            linkData = await basicAssetUri(fnsCtx, linkUrl);
        }

        if (image) {
            data = await basicAssetUri(fnsCtx, image);
        }

        return `
        <section data-component="campaign-cta">
            <div class="${containerClasses({width: "full", paddingX: false})}">
                <div class="su-container-inner su-relative su-flex su-items-center su-justify-center su-flex-col">
                    <div class="su-component-campaigncta-wrap su-pt-126 su-pb-108 su-relative su-z-[2] su-text-white su-p-20 md:su-px-50 su-flex su-flex-col md:su-flex-row">
                        <div class="su-component-campaigncta-content su-relative md:su-border-r-black-30 md:su-border-r md:su-mr-25 su-w-full md:su-max-w-[65.5rem] md:su-pr-25">
                            ${title ? `
                            <h2 class="su-font-serif su-text-[5.5rem] su-leading-none md:su-text-[7.2rem] su-m-0 su-font-bold">
                                ${title}
                            </h2>
                            ` : ''}
                            ${description ? `
                            <div class="su-mt-34 su-font-serif su-text-20 md:su-text-24 su-mb-0 md:su-mb-[5.9rem] su-text-semibold md:su-mt-61 su-font-semibold su-leading-[130.245%]">
                                ${xss(description)}
                            </div>
                            ` : ''}
                        </div>
                        ${linkText && linkData?.url ? `
                        <a href="${linkData.url}" 
                            class="su-text-18 su-mt-50 su-font-normal su-leading-display su-inline-block su-px-30 su-pt-10 su-pb-12 su-bg-digital-red su-mr-auto su-text-white su-no-underline hover:su-bg-black su-transition md:su-px-35 md:su-pt-14 md:su-pb-16 md:su-text-24 md:su-leading-[119.415%] md:su-mt-auto su-shrink-0"
                        >
                            ${linkText}
                        </a>
                        ` : ''}
                    </div>
                    ${data?.url ? `
                    <img class="su-absolute su-object-cover su-size-full su-z-[1]" src="${data?.url}" alt="${data?.attributes?.alt || ''}" />
                    ` : ''}
                    <div class="su-campaign-cta-gradient su-z-[1]" />
                </div>
            </div>
        </section>
        `
    }
};

