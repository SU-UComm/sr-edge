export function formatMediaCardDataMatrix(cardData) {
  const { title } = cardData;
  const liveUrl = cardData.linkUrl;
  const description = cardData.teaserText;
  const imageUrl = cardData.image?.url;
  const imageAlt = cardData.image?.attributes?.alt;
  const taxonomy =
    cardData.cardType === "Podcast" ? "Featured audio" : "Featured reading";
  const taxonomyUrl = undefined;
  const type = cardData.cardType;
  const { author } = cardData;
  const videoUrl = undefined;
  const date = undefined;

  return {
    title,
    liveUrl,
    description,
    imageUrl,
    imageAlt,
    taxonomy,
    taxonomyUrl,
    type,
    author,
    videoUrl,
    date,
  };
}
