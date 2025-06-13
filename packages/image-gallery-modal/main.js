import imageGalleryModalTemplate from './image-gallery-modal.hbs';
import { cardDataAdapter, matrixImageCardService, formatCardDataImage, uuid } from "../../global/js/utils";
import { ImageMosaic,  mosaic, carouselImages, SidebarHeading, Modal, Carousel } from "../../global/js/helpers";
import { processSquizEdit } from '../../global/js/utils/isEditor';

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
        const fnsCtx = componentFunctions || componentContext || {};

        // Extracting environment variables from provided info
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { layout, images, caption, credit, title, summary, summaryAlign } = args?.contentConfiguration || {};
        let { displayIconHeading, backgroundColor, width } = args?.displayConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            layout = layout || 'Title & Content';
            caption = caption || 'Sample gallery caption';
            credit = credit || 'Sample credit';
            
            // Conditional defaults based on layout
            if (layout === 'Title & Content') {
                title = title || 'Sample Image Gallery';
                summary = summary || 'This is a sample gallery summary that can be edited inline.';
                summaryAlign = summaryAlign || 'left';
            }
            
            // Provide default images if not provided or insufficient
            images = images && images.length >= 4 ? images : [
                { image: 'matrix-asset://api-identifier/sample-image-1', caption: 'Sample image caption 1' },
                { image: 'matrix-asset://api-identifier/sample-image-2', caption: 'Sample image caption 2' },
                { image: 'matrix-asset://api-identifier/sample-image-3', caption: 'Sample image caption 3' },
                { image: 'matrix-asset://api-identifier/sample-image-4', caption: 'Sample image caption 4' },
                { image: 'matrix-asset://api-identifier/sample-image-5', caption: 'Sample image caption 5' }
            ];
            
            // Ensure each image has a default caption
            images = images.map((img, index) => ({
                ...img,
                caption: img.caption || `Sample caption for image ${index + 1}`
            }));
            
            // Provide default display configuration
            displayIconHeading = displayIconHeading !== undefined ? displayIconHeading : true;
            backgroundColor = backgroundColor || 'Grey';
            width = width || 'Wide';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "captionCredit": { "field": "contentConfiguration.caption" }
            };
            
            // Add conditional targets for Title & Content layout
            if (layout === 'Title & Content') {
                squizEditTargets["title"] = { "field": "contentConfiguration.title" };
                squizEditTargets["summary"] = { "field": "contentConfiguration.summary" };
            }
        }

        // Environment validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        // Field validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof layout !== 'string' || !['Title & Content', 'Content Only'].includes(layout)) {
                    throw new Error(
                        `The "layout" field cannot be undefined and must be one of ["Title & Content", "Content Only"] value. The ${JSON.stringify(layout)} was received.`
                    );
                }
                if (!Array.isArray(images) || images.length < 4) {
                    throw new Error(
                        `The "images" field must be an array and cannot have less then 4 elements. The ${JSON.stringify(images)} was received.`
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
                if (layout === 'Title & Content' && title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                    );
                }
                if (layout === 'Title & Content' && summary && typeof summary !== 'string') {
                    throw new Error(
                        `The "summary" field must be a string. The ${JSON.stringify(summary)} was received.`
                    );
                }
                if (layout === 'Title & Content' && summaryAlign && !['left', 'center'].includes(summaryAlign)) {
                    throw new Error(
                        `The "summaryAlign" field must be one of ["left", "center"]. The ${JSON.stringify(summaryAlign)} was received.`
                    );
                }
                if (displayIconHeading && typeof displayIconHeading !== 'boolean') {
                    throw new Error(
                        `The "displayIconHeading" field must be a boolean. The ${JSON.stringify(displayIconHeading)} was received.`
                    );
                }
                if (!['Grey', 'Transparent'].includes(backgroundColor)) {
                    throw new Error(
                        `The "backgroundColor" field cannot be undefined and must be one of ["Grey", "Transparent"] value. The ${JSON.stringify(backgroundColor)} was received.`
                    );
                }
                if (!['Wide', 'Content'].includes(width)) {
                    throw new Error(
                        `The "width" field cannot be undefined and must be one of ["Wide", "Content"] value. The ${JSON.stringify(width)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Image gallery with modal component: ', er);
                return `<!-- Error occurred in the Image gallery with modal component: ${er.message} -->`;
            }
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
                data = images.map((img, index) => ({
                    url: `https://picsum.photos/600/400?random=${index}`,
                    alt: `Sample image ${index + 1}`,
                    width: 600,
                    height: 400
                }));
            } else {
                return `<!-- Error occurred in the Image gallery with modal component: Failed to fetch image data. ${er.message} -->`;
            }
        }

        // Format image data for rendering.
        const imageData = data && data.map((image, index) => {
            const imgData = formatCardDataImage(image);

            return { ...imgData, caption: filteredImages[`${index}`]?.caption };
        });

        // Image data validation - CHANGE: wrap in !squizEdit check
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
        const captionCredit = caption && credit ? `${caption} | ${credit}` : caption || credit;
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
        if (squizEdit) {
            return processSquizEdit(imageGalleryModalTemplate(componentData), squizEditTargets, args);
        }

        return imageGalleryModalTemplate(componentData);
    }
};