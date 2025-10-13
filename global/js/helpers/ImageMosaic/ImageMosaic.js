/**
 *
 * @param {array} data
 * image data, this data must have an "orientation" property with
 * the image's orientation set. To do this, any image data from
 * Matrix must be processed through the utility function
 * formatCardDataImage.js
 *
 * The orientation property's value is either "v" or "h" the above
 * format library takes care of this.
 *
 * To see an active example, view the server.jsx of the image-gallery-modal
 * component
 *
 * @param {int} remainingImageCount
 * A number that represents all images that haven't made it into
 * the mosaic. This number will be displayed on the final image
 * in the mosaic.
 *
 * @returns {array}
 */
export function ImageMosaic({ data, remainingImageCount }) {
    const images = [];

    let hasVertical = false;

    data.forEach(({ url, alt, orientation }, i) => {
        const horizontalPositions = [
            "su-horizontal-image-first",
            "su-horizontal-image-second",
            "su-horizontal-image-third",
            "su-horizontal-image-fourth",
        ];

        if (i === 0 && orientation === "v") hasVertical = true;

        let articleClass =
            orientation === "v" && i === 0
                ? "su-vertical-image-first"
                : "su-vertical-image-second";

        articleClass =
            orientation === "h"
                ? `${horizontalPositions[hasVertical ? images.length + 1 : i]} `
                : articleClass;

        images.push(
            `<article class="${articleClass} su-relative">
                <img src="${url}" alt="${alt}" class="su-w-full su-h-full su-object-cover" />
                ${remainingImageCount && i === data.length - 1 ? `
                <div class="su-bg-black/[0.33] su-w-full su-h-full su-absolute su-top-0 su-left-0 su-flex su-justify-center su-items-center su-z-[1]">
                    <span class="su-text-white su-relative su-z-[2] su-font-bold su-text-[4.8rem] su-leading-[5.76rem] md:su-text-[10rem] md:su-leading-[11.941rem]">
                        +${remainingImageCount}
                    </span>
                </div>
                ` : ''}
            </article>`
        );
    });

    return images.join('');
}

/**
 * This is a recursive function that pre-screens the
 * mosaic images to see if the pattern is correct
 * if it is not, the image data will be shifted about
 *
 * @param {array} images
 * the image data array
 *
 * @param {string} pattern
 * invalid pattern types
 *
 * @returns {array}
 */
function preScreenPattern(images, pattern) {
    const patterns = pattern.replace(/\n+|\t+| {2,}/gm, "");
    const invalidReg = new RegExp(patterns, "gm");

    let patternFormation = "{";
    let patternFormationEnd = "";
    let invalidPatternFound = false;
    let imagesProcessed = [];

    // loop through all images
    images.forEach((card) => {
        if (patternFormationEnd.match(invalidReg)) invalidPatternFound = true;

        // if no invalid pattern has been found continue the loop
        if (!invalidPatternFound) {
        patternFormationEnd = "";
        patternFormation += `${card.orientation}:`;
        patternFormationEnd = `${patternFormation.replace(/:$/, "")}}`;
        }
    });

    // re-sort the array
    if (patternFormationEnd.match(invalidReg)) {
        const index = Math.floor(Math.random() * images.length);
        const pushing = images[index];

        imagesProcessed = images.filter((image, i) => i !== index);

        imagesProcessed.push(pushing);

        // if after a re-sort the array remains the same, sort again.
        if (JSON.stringify(imagesProcessed) === JSON.stringify(images)) {
            const reScreenPattern = preScreenPattern(imagesProcessed, pattern);

            imagesProcessed = [...reScreenPattern];
        }

        return imagesProcessed;
    }

    return images;
}

/**
 * creates an image mosaic based on
 * specified pattern variations
 * 
 * @param {object} images 
 * the image data (determines the orientation)
 
 * @param {string} pattern 
 * the pattern represents the acceptable possibilities
 * for the mosaic gallery, see an example of this in the
 * Component.jsx of the image-gallery-modal 
 * 
 * @returns {array}
 */
export function mosaic(images, pattern, invalidPattern) {
    const patterns = pattern.replace(/\n+|\t+| {2,}/gm, "");
    let preview = [];

    let complete = false;
    let patternFormation = "{";

    const imageData = preScreenPattern(images, invalidPattern);

    imageData.forEach((card) => {
        if (complete) return;

        const patRegEnd = new RegExp(
            `${patternFormation}${card.orientation}}`,
            "gm"
        );
        const patRegCurrent = new RegExp(
            `${patternFormation}${card.orientation}:`,
            "gm"
        );

        if (
            !patterns.match(patRegCurrent) &&
            !patterns.match(patRegEnd) &&
            preview.length === 1
        ) {
            preview = [];
            patternFormation = "{";
        }

        if (patterns.match(patRegEnd)) {
            preview.push(card);
            complete = true;

            return;
        }

        if (!preview.length) {
            preview.push(card);
            patternFormation += `${card.orientation}:`;

            return;
        }

        if (patterns.match(patRegCurrent)) {
            preview.push(card);
            patternFormation += `${card.orientation}:`;
        }
    });

    return preview;
}

export function carouselImages(data) {
    const images = [];
  
    data.forEach(({ url, alt, caption }) => {
      images.push(`
        <div class="swiper-slide" lazy="true">
            <article class="c-carousel-image-slide ${caption ? "has-caption" : "has-no-caption"}">
                <div class="c-carousel-image">
                    <img src="${url}" alt="${alt}" loading="lazy" />
                    <div class="swiper-lazy-preloader"></div>
                </div>
                ${caption ? `
                <div class="c-carousel-caption">
                    <p data-se="image-model-caption">${caption}</p>
                </div>
                ` : ''}
            </article>
        </div>
      `);
    });
  
    return images.join('');
}
  

export default ImageMosaic;
