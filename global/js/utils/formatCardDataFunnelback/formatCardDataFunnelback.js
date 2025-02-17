/**
 * Card Data formatter - Funnelback
 *
 * @param {string} title The component title
 * @param {object} listMetadata The Funnelback result listMetadata object
 * @param {string} liveUrl The Funnelback Live URL
 * @returns {object}
 */

export function formatCardDataFunnelback({
    title,
    listMetadata: {
        assetTypeCode,
        teaserPlain,
        summary,
        image,
        taxonomyContentTypeText,
        contentTopic,
        contentSubtopic,
        taxonomyContentMainTopicText,
        contentCategory,
        featuredVideo,
        taxonomyContentMainTopicLandingPageUrl,
        taxonomyFeaturedUnitLandingPageUrl,
        taxonomyFeaturedUnitText,
        imageAlt,
        authorName,
        authorImage,
        author,
        isTeaser,
        storySource,
        assetHref,
    },
    date,
    liveUrl,
  }) {
    const authorDisplayName = authorName !== undefined ? authorName : author;
    const authorAvatar = authorImage !== "" ? authorImage : undefined;
  
    const imageUrl = image;
     
    imageAlt = image && imageAlt ? imageAlt : "";
  
    if (!imageAlt && !imageUrl) {
        imageAlt = "a close up image of an intricate stone arch";
    }
  
    const videoUrl = featuredVideo;
  
    const description = teaserPlain || summary;
  
    // taxonomy
    let taxonomy = taxonomyContentMainTopicText;
  
    if (!taxonomy && contentTopic) {
        taxonomy = contentTopic instanceof Array ? contentTopic[0] : contentTopic;
    }
  
    if (!taxonomy && contentSubtopic) {
        taxonomy = contentSubtopic instanceof Array ? contentSubtopic[0] : contentSubtopic;
    }
  
    const taxonomyUrl = taxonomyContentMainTopicLandingPageUrl;
  
    // type
    let type = taxonomyContentTypeText ? taxonomyContentTypeText[0] : "";
  
    if (!type && contentCategory) {
        type = contentCategory instanceof Array ? contentCategory[0] : contentCategory;
    }
  
    if (assetHref && assetTypeCode[0] === "link") {
        liveUrl = assetHref;
    }
  
    return {
        title: Array.isArray(title) ? title[0] : title,
        description: Array.isArray(description) ? description[0] : description,
        liveUrl: Array.isArray(liveUrl) ? liveUrl[0] : liveUrl,
        imageUrl: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl,
        imageAlt: Array.isArray(imageAlt) ? imageAlt[0] : imageAlt,
        taxonomy: Array.isArray(taxonomy) ? taxonomy[0] : taxonomy,
        taxonomyUrl: Array.isArray(taxonomyUrl) ? taxonomyUrl[0] : taxonomyUrl,
        type: Array.isArray(type) ? type[0] : type,
        videoUrl: Array.isArray(videoUrl) ? videoUrl[0] : videoUrl,
        date: Array.isArray(date) ? date[0] : date,
        authorDisplayName: Array.isArray(authorDisplayName) ? authorDisplayName[0] : authorDisplayName,
        authorAvatar: Array.isArray(authorAvatar) ? authorAvatar[0] : authorAvatar,
        taxonomyFeaturedUnitLandingPageUrl: Array.isArray(taxonomyFeaturedUnitLandingPageUrl) ? taxonomyFeaturedUnitLandingPageUrl[0] : taxonomyFeaturedUnitLandingPageUrl,
        taxonomyFeaturedUnitText: Array.isArray(taxonomyFeaturedUnitText) ? taxonomyFeaturedUnitText[0] : taxonomyFeaturedUnitText,
        isTeaser: Array.isArray(isTeaser) ? isTeaser[0] : isTeaser,
        storySource: Array.isArray(storySource) ? storySource[0] : storySource,
    };
}

export default formatCardDataFunnelback;