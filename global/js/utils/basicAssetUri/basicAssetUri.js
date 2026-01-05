/**
 * Basic Asset Uri Fetch 
 *
 * @param {object} props.fns The fns info object.
 * @param {string} props.assetUri The Uri to fetch in the "matrix-asset://stanfordNews/ID" format.
 *  
 * @returns {object}
 */
export async function basicAssetUri(fns, assetUri) {
     // Check for environment vars
    if (typeof fns !== 'object' || typeof fns.resolveUri === 'undefined') {
        throw new Error(
            `Error occurred in the basicAssetUri function, fns cannot be undefined or null and must have resolveUri function within it. The "${fns}" was received.`
        );
    }
    if (typeof assetUri !== 'string' || assetUri === '') {
        throw new Error(
            `Error occurred in the basicAssetUri function, assetUri cannot be undefined and must be non-empty string. The "${assetUri}" was received.`
        );
    }
    
    // Resolve the data for the card
    const assetData = await fns.resolveUri(assetUri);
    return assetData;
}

export default basicAssetUri;
