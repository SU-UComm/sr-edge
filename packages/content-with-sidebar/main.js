import { basicAssetUri, processEditor } from "../../global/js/utils";
import contentWithSidebarTemplate from "./content-with-sidebar.hbs";

export default {async main(args, info) {
    const componentFunctions = info?.fns || null;
    const componentContext = info?.ctx || null;
    
    // squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
    const squizEdit = componentContext?.editor || false;
    let squizEditTargets = null;
    
    // Change to let so we can modify for squizEdit defaults
    let { heading, content, infoBox } = args;
    const { image } = infoBox.imageConfiguration || {};
    const { internalUrl, externalUrl } = infoBox.buttonConfiguration || {};


    // Add defaults if squizEdit is true
    if (squizEdit) {
        // Default values for main component
        heading = heading || 'Heading text';
        content = content || 'Add content';

        // Ensure infoBox exists
        infoBox = infoBox || {};

        // Default values for text callout
        infoBox.title = infoBox.title || 'Callout heading text';
        infoBox.content = infoBox.content || 'Add content';

        infoBox.imageConfiguration.caption = `<span data-se="caption">${infoBox.imageConfiguration.caption ? infoBox.imageConfiguration.caption : 'Add caption'}</span>`;
        infoBox.imageConfiguration.credit = `<span data-se="credit">${infoBox.imageConfiguration.credit ? infoBox.imageConfiguration.credit : 'Add credit'}</span>`;

        // Ensure imageConfiguration exists
        infoBox.imageConfiguration = infoBox.imageConfiguration || {};
        infoBox.imageConfiguration.imagePlacement = infoBox.imageConfiguration.imagePlacement || 'Below content';

        // Ensure buttonConfiguration exists
        infoBox.buttonConfiguration = infoBox.buttonConfiguration || {};
        infoBox.buttonConfiguration.buttonText = infoBox.buttonConfiguration.buttonText || 'Button text';
        infoBox.buttonConfiguration.isNewWindow = infoBox.buttonConfiguration.isNewWindow !== undefined ? infoBox.buttonConfiguration.isNewWindow : false;
        
        // Set up squizEdit targets for inline editing
        squizEditTargets = {
            "heading": {
                "field": "heading"
            },
            "content": {
                "field": "content"
            },
            "infoBoxTitle": {
                "field": "infoBox.title"
            },
            "infoBoxContent": {
                "field": "infoBox.content"
            },
            "caption": {
                "field": "infoBox.imageConfiguration.caption"
            },
            "credit": {
                "field": "infoBox.imageConfiguration.credit"
            },
            "buttonText": {
                "field": "infoBox.buttonConfiguration.buttonText"
            }
        };
    }
    
    let linkUrl = null;
    if (internalUrl) {
        linkUrl = await basicAssetUri(componentFunctions, internalUrl);
    }
    const internalLinkUrl = linkUrl?.url;

    let imageData = null;

    if (image) {
        imageData = await basicAssetUri(componentFunctions, image);
    }

    // Create captionCredit by combining caption and credit
    const captionCredit = [infoBox.imageConfiguration.caption, infoBox.imageConfiguration.credit].filter(Boolean).join(' | ');

    // Determine button URL (internal takes precedence over external)
    const buttonUrl = internalLinkUrl || externalUrl;
    const isRealExternalLink = !internalLinkUrl && externalUrl;

    // Prepare component data for template rendering
    const componentData = {
        heading,
        content,
        infoBox,
        imageData,
        internalLinkUrl,
        captionCredit,
        buttonUrl,
        isRealExternalLink,
    };

    // Return original front end code when squizEdit is false, without modification
    if (!squizEdit) return contentWithSidebarTemplate(componentData);

    // Process the output to be editable in Squiz Editor
    return processEditor(contentWithSidebarTemplate(componentData), squizEditTargets);

}}