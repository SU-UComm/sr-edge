import xss from "xss";
import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
import multicolumnInfoSectionTemplate from './multicolumn-info-section.hbs';

/**
 * Multicolumn Info Section component that renders sections in three columns
 * @module MulticolumnInfoSection
 */
export default {
    /**
     * Renders the  Multicolumn Info Section component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {Object} info.ctx - Functions available in the execution context.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {string} [info.env.API_IDENTIFIER] - API identifier.
     * @returns {Promise<string>} The rendered  Multicolumn Info Section HTML or an error message.
     * @throws {Error} If basic hero data fetch operation fails.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extracting environment variables from provided info
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};

        // Extracting configuration data from arguments
        const { border, callout, colOne, colTwo, colThree } = args || {};

        // Validate required functions and environment vars
        try {
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Multicolumn Info Section component: ', er);
            return `<!-- Error occurred in the Multicolumn Info Section component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (border !== undefined && typeof border !== "boolean") {
                throw new Error(
                    `The "border" field must be a boolean. The ${JSON.stringify(border)} was received.`
                );
            }
            if (callout !== undefined && typeof callout !== "boolean") {
                throw new Error(
                    `The "callout" field must be a boolean. The ${JSON.stringify(callout)} was received.`
                );
            }
            if (colOne && typeof colOne !== 'object') {
                throw new Error(
                    `The "colOne" must be an object. The ${JSON.stringify(colOne)} was received.`
                );
            }
            if (colTwo && typeof colTwo !== 'object') {
                throw new Error(
                    `The "colTwo" must be an object. The ${JSON.stringify(colTwo)} was received.`
                );
            }
            if (callout === true && colThree && typeof colThree !== 'object') {
                throw new Error(
                    `The "colThree" must be an object. The ${JSON.stringify(colThree)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Multicolumn Info Section component: ', er);
            return `<!-- Error occurred in the Multicolumn Info Section component: ${er.message} -->`;
        }

        // Resolve image and link URIs
        let imageData = null;
        let infoInternalLinkUrl = null;
        let internalLinkUrl = null;

        if (colThree?.imageConfiguration?.image) {
            imageData = await basicAssetUri(fnsCtx, colThree.imageConfiguration.image);
        }

        if (colTwo?.buttonConfiguration?.infoInternalUrl) {
            const infoLinkUrl = await basicAssetUri(fnsCtx, colTwo.buttonConfiguration.infoInternalUrl);
            infoInternalLinkUrl = infoLinkUrl?.url;
        }

        if (colThree?.buttonConfiguration?.internalUrl) {
            const linkUrl = await basicAssetUri(fnsCtx, colThree.buttonConfiguration.internalUrl);
            internalLinkUrl = linkUrl?.url;
        }

        // Generate button if needed
        const buttonData = colTwo.addButton ? {
            buttonText: colTwo.buttonConfiguration.buttonText,
            buttonUrl: infoInternalLinkUrl || colTwo.buttonConfiguration.externalUrl,
            isNewWindow: colTwo.buttonConfiguration.isNewWindow,
            isRealExternalLink: !infoInternalLinkUrl && colTwo.buttonConfiguration.externalUrl ? isRealExternalLink(colTwo.buttonConfiguration.externalUrl) : false,
        } : null;

        // Generate InfoBox if needed
        const infoBoxData = callout && (colThree.title  || colThree.content || imageData) ? {
            title: colThree.title,
            content: xss(colThree.content),
            imageData,
            captionCredit: [colThree.imageConfiguration?.caption, colThree.imageConfiguration?.credit].filter(Boolean).join(' | '),
            imagePlacement: colThree.imageConfiguration?.imagePlacement,
            buttonText: colThree.buttonConfiguration?.buttonText,
            buttonUrl: internalLinkUrl || colThree.buttonConfiguration.externalUrl,
            isNewWindow: colThree.buttonConfiguration?.isNewWindow,
            isRealExternalLink: !internalLinkUrl && colThree.buttonConfiguration.externalUrl ? isRealExternalLink(colThree.buttonConfiguration.externalUrl) : false,
        } : null;

        const componentData = {
            border,
            callout,
            title: colOne.title,
            infoText: xss(colTwo.infoText),
            buttonData,
            infoBoxData,
        };

        return multicolumnInfoSectionTemplate(componentData);
    }
};
