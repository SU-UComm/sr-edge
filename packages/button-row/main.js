/**
 * Button Row Component - A Handlebars template component that renders a row of buttons
 * @module ButtonRow
 */

import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import buttonRow from './button-row.hbs';

/**
 * Main function that processes button data and returns rendered template
 * @async
 * @function main
 * @param {Object} args - Component arguments
 * @param {Array<Object>} args.buttons - Array of button configurations
 * @param {Object} info - Context information containing utility functions
 * @returns {Promise<string>} Rendered template string
 */
export default {
  async main(args, info) {
    const fnsCtx = info?.fns || info?.ctx || {};
    
    /**
     * Validates required context object and utility functions
     * @throws {Error} If context or required functions are missing
     */
    try {
      if (
        typeof fnsCtx !== 'object' ||
        typeof fnsCtx.resolveUri === 'undefined'
      ) {
        throw new Error(
          `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`,
        );
      }
    } catch (er) {
      console.error('Error occurred in the Button Row component: ', er);
      return `<!-- Error occurred in the Button Row component: ${er.message} -->`;
    }

    const { buttons } = args;

    /**
     * Validates buttons array and individual button configurations
     * @throws {Error} If validation fails
     */
    try {
      if (!Array.isArray(buttons) || buttons.length === 0) {
        throw new Error(
          `The "buttons" field must be a non-empty array. The ${JSON.stringify(buttons)} was received.`,
        );
      }
    } catch (er) {
      console.error('Error occurred in the Button Row component: ', er);
      return `<!-- Error occurred in the Button Row component: ${er.message} -->`;
    }

    /**
     * Processes buttons asynchronously to resolve URLs and prepare template data
     */
    const data = await Promise.all(
      buttons.map(async (button) => {
        const { buttonText, internalUrl, externalUrl, isNewWindow } = button;
        let linkData = null;
        
        if (internalUrl) {
          linkData = await basicAssetUri(info.fns, internalUrl);
        }
        
        const buttonUrl = linkData?.url || externalUrl;
        return {
          buttonText,
          isNewWindow,
          buttonUrl,
          isRealExternalLink: !linkData?.url && externalUrl ? 
            isRealExternalLink(externalUrl) : false,
        };
      }),
    );

    /**
     * Prepares template props and renders component
     */
    const props = {
      buttons: data,
    };
    
    return buttonRow(props);
  },
};