/**
 * Card Data formatter - Matrix
 *
 * @param {object} attributes Matrix asset attributes object
 * @param {object} metadata Matrix asset metadata object
 * @param {string} url Matrix asset url
 * @param {object} thumbnail Matrix asset thumbnail object
 * @returns {object}
 */
export function formatCardDataMatrix(props) {
  const { type } = props;
  const { title } = props;
  const { liveUrl } = props;
  const { description } = props;

  let { imageUrl } = props;
  let { imageAlt } = props;

  if (imageUrl === "" || imageUrl === null) {
    imageUrl = props.imageUrlDefault;
    imageAlt = props.imageAltDefault;
  }

  const { taxonomy } = props;
  const { taxonomyUrl } = props;
  const { videoUrl } = props;
  const { date } = props;
  const { source } = props;
  const { authorName } = props;
  const { authorEmail } = props;

  const returnData = {
    type,
    title,
    liveUrl,
    description,
    imageUrl,
    imageAlt,
    taxonomy,
    taxonomyUrl,
    videoUrl,
    date,
    source,
    authorName,
    authorEmail,
  };

  return returnData;
}

export default formatCardDataMatrix;