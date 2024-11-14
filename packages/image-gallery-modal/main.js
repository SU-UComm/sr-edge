import xss from 'xss';
import { CardDataAdapter, MatrixImageCardService, formatCardDataImage, containerClasses } from "../../global/js/utils";
import { ImageMosaic,  mosaic, carouselImages, SidebarHeading, Modal, Carousel } from "../../global/js/helpers";

export default {
    async main(args, info) {
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // Check for environment vars
        try {
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "${API_IDENTIFIER}" was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "${BASE_DOMAIN}" was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, info.fns cannot be undefined or null. The "${fnsCtx}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        // Validating fields
        try {
            if (!args.contentConfiguration) {
                throw new Error(
                    `Error occurred in the image gallery with modal component, contentConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (!args.displayConfiguration) {
                throw new Error(
                    `Error occurred in the image gallery with modal component, displayConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (typeof args.contentConfiguration.layout !== 'string' || !['Title & Content', 'Content Only'].includes(args.contentConfiguration.layout)) {
                throw new Error(
                    `Error occurred in the image gallery with modal component, layout field cannot be undefined and must be one of ["Title & Content", "Content Only"] value. The "${args.contentConfiguration.layout}" was received.`
                );
            }
            if (typeof args.contentConfiguration.images === 'undefined' || typeof args.contentConfiguration.images !== 'object') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, images field must be an array. The "${args.contentConfiguration.images}" was received.`
                );
            }
            if (args.contentConfiguration.caption && typeof args.contentConfiguration.caption !== 'string') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, caption field must be a string. The "${args.contentConfiguration.caption}" was received.`
                );
            }
            if (args.contentConfiguration.credit && typeof args.contentConfiguration.credit !== 'string') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, credit field must be a string. The "${args.contentConfiguration.credit}" was received.`
                );
            }
            if (args.contentConfiguration.title && typeof args.contentConfiguration.title !== 'string') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, title field must be a string. The "${args.contentConfiguration.title}" was received.`
                );
            }
            if (args.contentConfiguration.summary && typeof args.contentConfiguration.summary !== 'string') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, summary field must be a string. The "${args.contentConfiguration.summary}" was received.`
                );
            }
            if (typeof args.displayConfiguration.displayIconHeading !== 'boolean') {
                throw new Error(
                    `Error occurred in the image gallery with modal component, displayIconHeading field must be a boolean. The "${args.displayConfiguration.displayIconHeading}" was received.`
                );
            }
            if (typeof args.displayConfiguration.backgroundColor !== 'string' || !['Grey', 'Transparent'].includes(args.displayConfiguration.backgroundColor)) {
                throw new Error(
                    `Error occurred in the image gallery with modal component, backgroundColor field cannot be undefined and must be one of ["Grey", "Transparent"] value. The "${args.displayConfiguration.backgroundColor}" was received.`
                );
            }
            if (typeof args.displayConfiguration.width !== 'string' || !['Wide', 'Content'].includes(args.displayConfiguration.width)) {
                throw new Error(
                    `Error occurred in the image gallery with modal component, width field cannot be undefined and must be one of ["Wide", "Content"] value. The "${args.displayConfiguration.width}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        const adapter = new CardDataAdapter();
        let data = null;

        const { images } = args.contentConfiguration;

        // Create our service
        const service = new MatrixImageCardService({ BASE_DOMAIN, API_IDENTIFIER });
        
        // Set our card service
        adapter.setCardService(service);

        const filteredImages = images?.filter(
            (item, index, self) =>
            index === self.findIndex((t) => t.image === item.image)
        );

        // get the cards data
        data = images && await adapter.getCards(images);

        const imageData = data && data.map((image, index) => {
            const imgData = formatCardDataImage(image);

            return { ...imgData, caption: filteredImages[`${index}`]?.caption };
        });

        const props = {
            ...args,
            data: imageData,
        };

        // generate the preview images
        const previewData = mosaic(
            props.data,
            `
            {v:v}
            {h:h:h:h}
            {h:h:v}
            {v:h:h}
            `,
            `
            {h:h:h:v}
            `
        );
        const modalImages = carouselImages(props.data);
        const width = props?.displayConfiguration?.width === "Wide" ? props.displayConfiguration.width : "narrow";
        const captionCredit = props?.contentConfiguration?.caption && props?.contentConfiguration?.credit ? `${props.contentConfiguration.caption} | ${props.contentConfiguration.credit}` : props.contentConfiguration.caption || props.contentConfiguration.credit;
        const leftOverImages = props?.data?.length - previewData.length;    
        const backgroundClasses = {
            'Grey': 'su-bg-fog-light su-rs-pt-6 su-rs-pb-8 dark:su-bg-black/[0.5]',
            'Transparent': '',
        };
    
        return `
        <section class="${backgroundClasses[props.displayConfiguration.backgroundColor]}" data-component="image-gallery-modal">
            <div class="${containerClasses({width: width})}">
                <div class="su-w-[100%] md:su-max-w-[60.7rem] lg:su-max-w-[63.6rem] su-mx-auto">
                    <div class="su-text-center [&>*]:su-justify-center [&>*]:su-rs-mb-0 su-flex su-flex-col su-gap-[2.1rem] md:su-gap-[2.5rem]">
                        ${props?.displayConfiguration?.displayIconHeading ? SidebarHeading({ color: "media",  icon: "mediagallery", title: "Media gallery" }) : ''}
                        ${props?.contentConfiguration?.layout === "Title & Content" && props?.contentConfiguration?.title ? `
                        <h2 class="su-text-[3.5rem] su-leading-[4.179rem] su-font-bold md:su-text-[4.0rem] md:su-leading-[4.776rem] lg:su-text-[4.9rem] lg:su-leading-[6.37rem]">
                            ${props.contentConfiguration.title}
                        </h2>
                        `: '' }
                    </div>
                    ${props?.contentConfiguration?.layout === "Title & Content" && props?.contentConfiguration?.summary ? `
                    <div class="su-wysiwyg-content su-rs-mt-0 su-text-[1.8rem] su-leading-[2.25rem] su-mt-[1.5rem] md:su-text-[1.9rem] md:su-leading-[2.375rem] md:su-mt-[1.9rem] lg:su-text-[2.1rem] lg:su-leading-[2.625rem]">
                        ${xss(props.contentConfiguration.summary)}
                    </div>
                    ` : '' }
                </div>
                <button
                    data-click="open-gallery-modal"
                    title="Open image gallery"
                    aria-label="Open image gallery"
                    class="su-grid su-grid-cols-2 su-mx-auto su-grid-rows-2 su-max-w-[1312px] su-gap-x-[0.691rem] su-gap-y-[0.572rem] su-mt-[3.2rem] su-pb-[1rem] md:su-mt-[4.8rem] md:su-gap-x-[1.448rem] md:su-gap-y-[1.199rem] lg:su-gap-x-[2.589rem] lg:su-gap-y-[2.143rem]"
                >
                    ${ImageMosaic({ data: previewData, remainingImageCount: leftOverImages})}
                </button>
                ${captionCredit ? `
                <div class="su-text-[1.5rem] su-w-full su-text-center dark:su-text-white md:su-max-w-[482px] lg:su-max-w-[633px] su-mx-auto">
                    <p class="su-m-0 su-text-left">${captionCredit}</p>
                </div>
                ` : ''}
            </div>
            ${Modal({content: Carousel({ variant: 'imagegallery', slides: modalImages, isDark: true }), describedby: 'image-gallery-modal' })}
        </section>`;
    }
};