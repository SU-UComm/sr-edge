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
    taxonomy =
      contentSubtopic instanceof Array ? contentSubtopic[0] : contentSubtopic;
  }

  const taxonomyUrl = taxonomyContentMainTopicLandingPageUrl;

  // type
  let type = taxonomyContentTypeText ? taxonomyContentTypeText[0] : "";

  if (!type && contentCategory) {
    type =
      contentCategory instanceof Array ? contentCategory[0] : contentCategory;
  }

  if (assetHref && assetTypeCode[0] === "link") {
     
    liveUrl = assetHref;
  }

  return {
    title,
    description,
    liveUrl,
    imageUrl,
    imageAlt,
    taxonomy,
    taxonomyUrl,
    type,
    videoUrl,
    date,
    authorDisplayName,
    authorAvatar,
    taxonomyFeaturedUnitLandingPageUrl,
    taxonomyFeaturedUnitText,
    isTeaser,
    storySource,
  };
}

export default formatCardDataFunnelback;