import { metadataDataAdapter, matrixMetadataService } from '../../global/js/utils';
import { basicMetadata, featuredMetadata } from "../../global/js/helpers";

import metadataFieldsTemplate from './metadata-fields.hbs';

/**
 * A module for rendering metadata components based on story data.
 * @module MetadataFields
 */
export default {
    /**
     * Fetches story metadata from an API and renders it as a component.
     * @async
     * @param {Object} args - Arguments for the metadata component (currently unused).
     * @param {Object} info - Contextual and environment information.
     * @param {Object} [info.ctx] - Context object containing runtime data.
     * @param {string} [info.ctx.assetId] - The ID of the current story asset.
     * @param {Object} info.env - Environment variables.
     * @param {string} info.env.BASE_DOMAIN - The base domain URL for the API.
     * @returns {Promise<string>} The rendered HTML string for the metadata component.
     * @throws {Error} If currentAssetId or BASE_DOMAIN is invalid, or if API fetch fails.
     */
    async main( args, info ) {
        // Extracting environment function from provided info
        const fnsCtx = info?.ctx ||  {};

        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // Ensure `currentAssetId` is defined before checking it
        // basic "156489"
        // featured "157182"
        // example basic story PROD 165409
        // example featured story PROD 166565

        // ##
        // REMOVE BEFORE DEPLOYMEMENT `|| "{asset_id}"`
        // ##
        // const currentAssetId = fnsCtx?.assetId || "156489";
        const currentAssetId = fnsCtx?.assetId;

        // Validate required environment variables
        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof currentAssetId !== 'string' || currentAssetId.trim() === '') {
                throw new Error(
                    `The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(currentAssetId)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Metadata Fields component: ', er);
            return `<!-- Error occurred in the Metadata Fields component: ${er.message} -->`;
        }

        const adapter = new metadataDataAdapter();
        let metadataData = null

        // Create our service
        const service = new matrixMetadataService({ BASE_DOMAIN });

        // Set our card service
        adapter.setMetadataService(service);

        // Get the metedata data
        try {
            metadataData = await adapter.getMetadataData(currentAssetId);

            if (!metadataData || typeof metadataData !== 'object') {
                throw new Error("Invalid API response: metadataData is missing or not an object.");
            }
        } catch (er) {
            console.error('Error occurred in the Metadata Fields component: Error parsing metadata data JSON response: ', er);
            return `<!-- Error occurred in the Metadata Fields component: Error parsing metadata data JSON response: ${er.message} -->`;
        }


        // Prepare component data for template rendering
        const componentData = {
            width: metadataData.type === "Basic" ? "narrow" : "large",
            fields: metadataData.type === "Basic" ? basicMetadata({ data: metadataData }) : featuredMetadata({ data: metadataData }), 
        };

        return metadataFieldsTemplate(componentData);
    }
};
