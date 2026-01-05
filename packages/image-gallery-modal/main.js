import imageGalleryModalTemplate from './image-gallery-modal.hbs';
import { cardDataAdapter, matrixImageCardService, formatCardDataImage, uuid } from "../../global/js/utils";
import { ImageMosaic,  mosaic, carouselImages, SidebarHeading, Modal, Carousel } from "../../global/js/helpers";
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Image gallery with modal component that renderds a list of images cards that can be viewed in the modal layout.
 */

export default {
    /**
     * Renders the Image gallery with modal component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.contentConfiguration - The content configuration for the component.
     * @param {string} args.contentConfiguration.images - The list of immages to display in the component.
     * @param {string} args.contentConfiguration.layout - The flag specifying if show title or not.
     * @param {string} [args.contentConfiguration.caption] - The text for caption of whole gallery (optional).
     * @param {string} [args.contentConfiguration.credit] - The text for credit of whole gallery (optional).
     * @param {string} [args.contentConfiguration.title] - The text of gallery title (optional).
     * @param {string} [args.contentConfiguration.summary] - The text of gallery summary (optional).
     * @param {string} [args.contentConfiguration.summaryAlign] - The flag to align summary (optional).
     * @param {Object} args.displayConfiguration - The display configuration for the component.
     * @param {string} args.displayConfiguration.backgroundColor - The flag specifying the background color.
     * @param {string} args.displayConfiguration.width - The flag specifying the width of the gallery.
     * @param {string} [args.displayConfiguration.displayIconHeading] - The flag to show gallery icon (optional).
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;

        // Extracting environment variables from provided info
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { layout, images, caption, credit, title, summary, summaryAlign } = args?.contentConfiguration || {};
        let { displayIconHeading, backgroundColor, width } = args?.displayConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            caption = `<span data-se="caption">${caption ? caption : 'Caption text'}</span>`;
            credit = `<span data-se="credit">${credit ? credit : 'Credit text'}</span>`;


            title = title || 'Heading text';
            summary = summary || 'Add content';
            
            // Ensure each image has a default caption
            images = images.map((img, index) => ({
                ...img,
                caption: img.caption || `Caption text`
            }));
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "caption": { "field": "contentConfiguration.caption" },
                "credit": { "field": "contentConfiguration.credit" },
                "title": { "field": "contentConfiguration.title" },
                "summary": { "field": "contentConfiguration.summary" },
                "image-model-caption": { "field": "images", "array": true, "property": "caption" }
            };
            
        }


        const adapter = new cardDataAdapter();
        let data = null;

        // Create our service
        const service = new matrixImageCardService({ BASE_DOMAIN, API_IDENTIFIER });
        
        // Set our card service
        adapter.setCardService(service);

        // Filter duplicate images based on the "image" property.
        const filteredImages = images?.filter(
            (item, index, self) =>
            index === self.findIndex((t) => t.image === item.image)
        );

        // Retrieve the card data with error handling for edit mode
        try {
            data = images && await adapter.getCards(images);
        } catch (er) {
            console.error('Error occurred in the Image gallery with modal component: Failed to fetch image data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [];
            }
        }

        // Format image data for rendering.
        const imageData = data && data.map((image, index) => {
            const imgData = formatCardDataImage(image);

            return { ...imgData, caption: filteredImages[`${index}`]?.caption };
        });

        // Image data validation
        if (!squizEdit) {
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
        }

        // Generate preview images for the mosaic layout
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
        const uniqueId = uuid();

        const modalImages = carouselImages(imageData);
        const modalCarousel = Carousel({ variant: 'imagegallery', slides: modalImages, isDark: true, uniqueClass: uniqueId});
        const captionCredit = [caption, credit].filter(Boolean).join(' | ');
        const leftOverImages = imageData.length - previewData.length;
    
        // Prepare component data for template rendering
        const componentData = {
            backgroundColor,
            layout,
            sidebarHeading: displayIconHeading ? SidebarHeading({ color: "media",  icon: "mediagallery", title: "Media gallery" }) : '',
            title,
            summary,
            summaryAlign,
            images: ImageMosaic({ data: previewData, remainingImageCount: leftOverImages}),
            captionCredit,
            modal: Modal({uniqueId, content: modalCarousel, titleId: 'image-gallery-modal' }),
            width: width === "Wide" ? width.toLocaleLowerCase() : "narrow"
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) {
            return imageGalleryModalTemplate(componentData);
        }
        
        return processEditor(imageGalleryModalTemplate(componentData), squizEditTargets);
    }
};