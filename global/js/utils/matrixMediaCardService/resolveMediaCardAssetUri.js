import { basicAssetUri } from "../basicAssetUri";

export async function resolveMediaCardAssetUri({ ctx, cardData }) {
  const newData = cardData;

  // Define our promises array
  const promises = [];

  // Resolve the image
  promises.push(await basicAssetUri(ctx, cardData.image));

  // Wait for our data to be returned
  const [imageData] = await Promise.all(promises);

  // Assign our data
  newData.image = imageData;

  return newData;
}
