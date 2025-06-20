import { basicAssetUri } from "../../global/js/utils";
import contentWithSidebarTemplate from "./content-with-sidebar.hbs";

export default {async main(args, info) {
    const { ctx } = info;
    const componentFunctions = info?.fns || null;
    const componentContext = info?.ctx || null;
    const { heading, content, infoBox } = args;
    const { image } = args.infoBox.imageConfiguration;
    const { internalUrl, externalUrl } = args.infoBox.buttonConfiguration;

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
    const captionCredit = infoBox.imageConfiguration.caption && infoBox.imageConfiguration.credit 
        ? `${infoBox.imageConfiguration.caption} | ${infoBox.imageConfiguration.credit}` 
        : infoBox.imageConfiguration.caption || infoBox.imageConfiguration.credit;

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

    return contentWithSidebarTemplate(componentData);

}}