import { cnb } from "cnbuilder";
// import specific templates for the component
import xss from "xss";
import { container } from "../grids";
import { linkButton } from "../links";

/**
 * A container with a gray background that includes a
 * title and text content with optional image and CTA button.
 *
 * @param {string} containerClassName
 * Use this to apply classes to the box's outer container.
 *
 * @param {string} title
 * A heading displayed at the top of the container
 *
 * @param {string} content
 * WYSIWYG text content
 *
 * @param {object} imageData
 * The image's data object of the selected Matrix asset. We need the URL and alt text.
 *
 * @param {string} caption
 * A caption to pair with the selected image.
 *
 * @param {string} credit
 * A credit to display with the image caption.
 *
 * @param {string} imagePlacement
 * The selected image can display above or below the content.
 *
 * @param {string} buttonText
 * Text on the button.
 *
 * @param {string} externalUrl
 * An external page for the button to link to.
 *
 * @param {string} internalLinkUrl
 * The url to another page asset in Matrix.
 *
 * @param {boolean} isNewWindow
 * Choose if the button link should open in a new window.
 *
 * @returns {string}
 * @constructor
 */
export function infoBox({
  containerClassName = '',
  title,
  content,
  imageData,
  caption,
  credit,
  imagePlacement,
  buttonText,
  externalUrl,
  internalLinkUrl,
  isNewWindow,
}) {
  const captionCredit =
    caption && credit ? `${caption} | ${credit}` : caption || credit;
  const hasImage = imageData?.url;

  const containerContent = `
    <div class="su-flex su-flex-col su-p-20 md:su-p-36 su-justify-start su-items-start su-bg-fog-light lg:su-mx-auto dark:su-bg-black [&>p]:su-m-0 [&>p]:!su-mb-0 [&>p]:su-text-16 md:[&>p]:!su-text-19 last-of-type:[&>p]:!su-mb-0">
        <div class="su-relative su-justify-start su-items-center su-w-full su-gap-3 su-flex su-overflow-hidden su-rs-mb-0">
          <div>
            <h3 class="su-font-serif su-text-21 md:su-text-23 su-inline su-pr-10 su-m-0">
              ${title}
            </h3>
            <span class="su-w-full su-bg-black-40 dark:su-bg-black-70 su-h-px su-absolute su-bottom-4" />
          </div>
        </div>
        ${content ? `
          <div
            class="${cnb(
              hasImage && imagePlacement === "Above content"
                ? "su-order-2"
                : "su-order-1",
              "su-flex su-flex-col su-gap-12"
            )}"
          >
            <div
              class="${cnb(
                "su-wysiwyg-content",
                "*:su-text-16 *:md:su-text-19",
                "*:su-leading",
                "last:*:su-mb-0"
              )}"
            >
            ${xss(content)}
            </div>
          </div>
        ` : ''}

        ${hasImage ? `
          <figure
            class="${cnb(
              imagePlacement === "Above content"
                ? "su-order-1 su-pb-20 md:su-pb-12 lg:su-pb-27"
                : "su-order-2 su-pt-20 md:su-pt-12 lg:su-pt-27",
              "su-w-full"
            )}"
          >
            <img
              src="${imageData.url}"
              alt="${imageData.attributes?.alt || ""}"
              class="su-w-full"
            />

            <figcaption class="su-m-0 su-text-14 su-leading-[1.672rem] md:su-leading-[1.911rem] md:su-text-16 su-mt-8 md:su-mt-12">
              ${captionCredit}
            </figcaption>
          </figure>
        ` : ''}
        ${buttonText ? linkButton({
            buttonText: buttonText,
            internalUrl: internalLinkUrl,
            externalUrl: externalUrl,
            isNewWindow: isNewWindow,
            className: "su-rs-mt-1 su-order-3"
        }) : ``}
      </div>
  `;

  return container({
    children: containerContent,
    width: "full",
    paddingX: false,
    className: containerClassName
  });
}
