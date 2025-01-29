import campaignCtaTemplate from './campaign-cta.hbs';
import { basicAssetUri, containerClasses } from "../../global/js/utils";

export default {
    async main(args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        const { image, title, description, linkUrl, linkText } = (args && args.displayConfiguration) || {};

        // Check for environment vars
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Campaign cta component: ', er);
            return `<!-- Error occurred in the Campaign cta component: ${er.message} -->`;
        }

        // Validating fields
        try {
            if (!image || typeof image !== 'string') {
                throw new Error(
                    `The "image" field cannot be undefined and must be a string type. The ${JSON.stringify(image)} was received.`
                );
            }
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string type. The ${JSON.stringify(title)} was received.`,
                );
            }
            if (description && typeof description !== 'string') {
                throw new Error(
                    `The "description" field must be a string type. The ${JSON.stringify(description)} was received.`,
                );
            }
            if (linkUrl && typeof linkUrl !== 'string') {
                throw new Error(
                    `The "linkUrl" field must be a string type. The ${JSON.stringify(linkUrl)} was received.`,
                );
            }
            if (linkText && typeof linkText !== 'string') {
                throw new Error(
                    `The "linkText" field must be a string type. The ${JSON.stringify(linkText)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Campaign cta component: ', er);
            return `<!-- Error occurred in the Campaign cta component: ${er.message} -->`;
        }
        
        let imageData = null;
        let linkData = null;

        if (linkUrl) {
            linkData = await basicAssetUri(fnsCtx, linkUrl);
        }

        if (image) {
            imageData = await basicAssetUri(fnsCtx, image);
        }

        const componentData = {
            classes: containerClasses({width: "full", paddingX: false}),
            title,
            description,
            linkText,
            linkData,
            imageData
        };

        return campaignCtaTemplate(componentData);
    }
};

