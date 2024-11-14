import basicAssetUri from "./basicAssetUri";

/**
 * Linked Heading Data formatter - Matrix
 *
 * @returns {object}
 */
export async function linkedHeadingService(fns, {title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow}) {
    let resolvedUrl = "";

    // Resolve the CTA URL if one is supplied
    if (ctaUrl !== undefined && ctaUrl !== "" && ctaUrl !== null) {
        const linkedPageData = await basicAssetUri(fns, ctaUrl);

        resolvedUrl = linkedPageData.url || linkedPageData.liveUrl;
    }

    const ctaLink = resolvedUrl || ctaManualUrl;

    return {
        title,
        ctaText,
        ctaLink,
        ctaNewWindow,
    };
}

export default linkedHeadingService;