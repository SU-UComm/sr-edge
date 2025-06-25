import xss from "xss";
import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
import { processEditor } from '../../global/js/utils/processEditor';
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
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // Extracting environment variables from provided info
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};

        // Extracting configuration data from arguments
        let { border, callout, colOne, colTwo, colThree } = args || {};

        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
        // Must fallback to false, use true to mock the editor
        const squizEdit = info?.ctx?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;

        // NEW: add a default if squizEdit is true
        if (squizEdit) {
            // Add default values if content is not provided
            border = border !== undefined ? border : true;
            callout = callout !== undefined ? callout : true;
            
            colOne = colOne || {};
            colOne.title = colOne.title || 'Title text';
            
            colTwo = colTwo || {};
            colTwo.infoText = colTwo.infoText || '<p>Add content</p>';
            colTwo.addButton = colTwo.addButton !== undefined ? colTwo.addButton : false;
            
            if (colTwo.addButton) {
                colTwo.buttonConfiguration = colTwo.buttonConfiguration || {};
                colTwo.buttonConfiguration.buttonText = colTwo.buttonConfiguration.buttonText || 'Button text';
                colTwo.buttonConfiguration.externalUrl = colTwo.buttonConfiguration.externalUrl || 'https://news.stanford.edu';
                colTwo.buttonConfiguration.isNewWindow = colTwo.buttonConfiguration.isNewWindow !== undefined ? colTwo.buttonConfiguration.isNewWindow : false;
            }

            if (callout) {
                colThree = colThree || {};
                colThree.title = colThree.title || 'Heading text';
                colThree.content = colThree.content || '<p>Add content</p>';
                
                colThree.imageConfiguration = colThree.imageConfiguration || {};
                colThree.imageConfiguration.image = colThree.imageConfiguration.image || 'matrix-asset://api-identifier/sample-image';
                colThree.imageConfiguration.caption = colThree.imageConfiguration.caption || 'Caption text';
                colThree.imageConfiguration.credit = colThree.imageConfiguration.credit || 'Credit text';
                colThree.imageConfiguration.imagePlacement = colThree.imageConfiguration.imagePlacement || 'Below content';
                
                colThree.buttonConfiguration = colThree.buttonConfiguration || {};
                colThree.buttonConfiguration.buttonText = colThree.buttonConfiguration.buttonText || 'Button text';
                colThree.buttonConfiguration.externalUrl = colThree.buttonConfiguration.externalUrl || 'https://news.stanford.edu';
                colThree.buttonConfiguration.isNewWindow = colThree.buttonConfiguration.isNewWindow !== undefined ? colThree.buttonConfiguration.isNewWindow : false;
            }

            // Add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            // top level keys match the data-se attributes found in the template eg data-se="title"
            // the field values are the component data fields eg data-sq-field="colOne.title"
            squizEditTargets = {
                "title": {
                    "field": "colOne.title"
                },
                "infoText": {
                    "field": "colTwo.infoText"
                },
                "button": [
                    {
                        "field": "colTwo.buttonConfiguration.buttonText"
                    },
                    {
                        "field": "colThree.buttonConfiguration.buttonText"
                    }
                ],
                "infoBoxTitle": {
                    "field": "colThree.title"
                },
                "infoBoxContent": {
                    "field": "colThree.content"
                },
                "captionCredit": {
                    "field": "colThree.imageConfiguration.caption"
                }
            };
        }

        // NEW: remove overly stringent validation where it makes sense
        // if it is to remain, wrap it in a !squizEdit check
        if (!squizEdit) {
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
        }

        // Resolve image and link URIs
        let imageData = null;
        let infoInternalLinkUrl = null;
        let internalLinkUrl = null;

        if (colThree?.imageConfiguration?.image) {
            if (squizEdit) {
                // In edit mode, provide placeholder data if API call fails
                try {
                    imageData = await basicAssetUri(fnsCtx, colThree.imageConfiguration.image);
                } catch (error) {
                    // Provide mock data silently on API failure
                    imageData = { url: 'https://example.com' };
                }
            } else {
                imageData = await basicAssetUri(fnsCtx, colThree.imageConfiguration.image);
            }
        }

        if (colTwo?.buttonConfiguration?.infoInternalUrl) {
            if (squizEdit) {
                try {
                    const infoLinkUrl = await basicAssetUri(fnsCtx, colTwo.buttonConfiguration.infoInternalUrl);
                    infoInternalLinkUrl = infoLinkUrl?.url;
                } catch (error) {
                    // Provide mock data silently on API failure
                    infoInternalLinkUrl = 'https://example.com';
                }
            } else {
                const infoLinkUrl = await basicAssetUri(fnsCtx, colTwo.buttonConfiguration.infoInternalUrl);
                infoInternalLinkUrl = infoLinkUrl?.url;
            }
        }

        if (colThree?.buttonConfiguration?.internalUrl) {
            if (squizEdit) {
                try {
                    const linkUrl = await basicAssetUri(fnsCtx, colThree.buttonConfiguration.internalUrl);
                    internalLinkUrl = linkUrl?.url;
                } catch (error) {
                    // Provide mock data silently on API failure
                    internalLinkUrl = 'https://example.com';
                }
            } else {
                const linkUrl = await basicAssetUri(fnsCtx, colThree.buttonConfiguration.internalUrl);
                internalLinkUrl = linkUrl?.url;
            }
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

        // Return original front end code when squizEdit is false, without modification
        if (!squizEdit) return multicolumnInfoSectionTemplate(componentData);

        // NEW: process the output to be editable in Squiz Editor
        return processEditor(multicolumnInfoSectionTemplate(componentData), squizEditTargets);
    }
};
