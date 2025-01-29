import imageGalleryModalTemplate from './image-gallery-modal.hbs';
import { cardDataAdapter, matrixImageCardService, formatCardDataImage, containerClasses } from "../../global/js/utils";
import { ImageMosaic,  mosaic, carouselImages, SidebarHeading, Modal, Carousel } from "../../global/js/helpers";

export default {
    async main(args, info) {
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        const { layout, images, caption, credit, title, summary } = args?.contentConfiguration || {};
        const { displayIconHeading, backgroundColor, width } = args?.displayConfiguration || {};

        // Check for environment vars
        try {
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Image gallery with modal component: ', er);
            return `<!-- Error occurred in the Image gallery with modal component: ${er.message} -->`;
        }

        // Validating fields
        try {
            if (typeof layout !== 'string' || !['Title & Content', 'Content Only'].includes(layout)) {
                throw new Error(
                    `The "layout" field cannot be undefined and must be one of ["Title & Content", "Content Only"] value. The ${JSON.stringify(layout)} was received.`
                );
            }
            if (!Array.isArray(images) || images.length === 0) {
                throw new Error(
                    `The "images" field must be an array. The ${JSON.stringify(images)} was received.`
                );
            }
            if (caption && typeof caption !== 'string') {
                throw new Error(
                    `The "caption" field must be a string. The ${JSON.stringify(caption)} was received.`
                );
            }
            if (credit && typeof credit !== 'string') {
                throw new Error(
                    `The "credit" field must be a string. The ${JSON.stringify(credit)} was received.`
                );
            }
            if (layout === 'Title & Content' && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (layout === 'Title & Content' && typeof summary !== 'string') {
                throw new Error(
                    `The "summary" field must be a string. The ${JSON.stringify(summary)} was received.`
                );
            }
            if (typeof displayIconHeading !== 'boolean') {
                throw new Error(
                    `The "displayIconHeading" field must be a boolean. The ${JSON.stringify(displayIconHeading)} was received.`
                );
            }
            if (typeof backgroundColor !== 'string' || !['Grey', 'Transparent'].includes(backgroundColor)) {
                throw new Error(
                    `The "backgroundColor" field cannot be undefined and must be one of ["Grey", "Transparent"] value. The ${JSON.stringify(backgroundColor)} was received.`
                );
            }
            if (typeof width !== 'string' || !['Wide', 'Content'].includes(width)) {
                throw new Error(
                    `The "width" field cannot be undefined and must be one of ["Wide", "Content"] value. The ${JSON.stringify(width)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Image gallery with modal component: ', er);
            return `<!-- Error occurred in the Image gallery with modal component: ${er.message} -->`;
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Create our service
        const service = new matrixImageCardService({ BASE_DOMAIN, API_IDENTIFIER });
        
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

        // Validating data 
        try {
            if (typeof imageData !== 'object' || JSON.stringify(imageData) === JSON.stringify([null, null, null, null]) || imageData.length < 4) {
                throw new Error(
                    `The imageData cannot have less then 4 elements. The ${JSON.stringify(data)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Image gallery with modal component: ', er);
            return `<!-- Error occurred in the Image gallery with modal component: ${er.message} -->`;
        }

        // generate the preview images
        const previewData = mosaic(
            imageData,
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
        const modalImages = carouselImages(imageData);
        const widthToRender = width === "Wide" ? width : "narrow";
        const captionCredit = caption && credit ? `${caption} | ${credit}` : caption || credit;
        const leftOverImages = imageData.length - previewData.length;    
        const backgroundClasses = {
            'Grey': 'su-bg-fog-light su-rs-pt-6 su-rs-pb-8 dark:su-bg-black/[0.5]',
            'Transparent': '',
        };
    
        const componentData = {
            classes: containerClasses({width: widthToRender}),
            backgroundClasses: backgroundClasses[backgroundColor],
            layout: layout,
            sidebarHeading: displayIconHeading ? SidebarHeading({ color: "media",  icon: "mediagallery", title: "Media gallery" }) : '',
            title: title,
            summary: summary,
            images: ImageMosaic({ data: previewData, remainingImageCount: leftOverImages}),
            captionCredit,
            modal: Modal({content: Carousel({ variant: 'imagegallery', slides: modalImages, isDark: true }), describedby: 'image-gallery-modal' })
        };

        return imageGalleryModalTemplate(componentData);
    }
};