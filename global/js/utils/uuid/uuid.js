/**
 * Generate a (mostly) unique ID in an RFC4122 version 4 compliant format
 * Function ported from initFormSubmissionHandler.
 *
 * @returns String
 *
 * @source https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
 */

const alternativeUUID = () => {
    // Public Domain/MIT
    let d = new Date().getTime(); // Timestamp
    let d2 =
        (typeof performance !== 'undefined' &&
            performance.now &&
            performance.now() * 1000) ||
        0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16; // random number between 0 and 16
        if (d > 0) {
            // Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            // Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

/**
 * Generate a (mostly) unique ID using the Web Crypto API.
 * This function creates a UUID in an RFC4122 version 4 compliant format.
 *
 * @returns {string} - A string representing the generated UUID.
 */
const cryptoUUID = () => {
    return ((1e7).toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c) =>
            (
                Number(c) ^
                (crypto.getRandomValues(new Uint8Array(1))[0] &
                    (15 >> (Number(c) / 4)))
            ).toString(16),
    );
};

// Execute cryptoUUID on the server and alternativeUUID in the browser
export const uuid = () => {
    return typeof crypto !== 'undefined' ? cryptoUUID() : alternativeUUID();
};

export default uuid;
