import { basicField } from './basicField';
import { ShareLink } from "../SVG-library";
/**
 * Creates basic metadata section
 * 
 * @param {Object} data - Metadata content
 * @returns {string} HTML string of the metadata section
 */
export function basicMetadata({ data }) {
  const {
    authors,
    producers,
    writers,
    editors,
    photographers,
    videographers,
    photography,
    media,
    campus,
    related,
  } = data;

  const relatedTopics = [];
  const relatedFiltered = related.filter((item) => {
    if (!relatedTopics.includes(item.asset_name)) {
      relatedTopics.push(item.asset_name);
      return item;
    }
    return null;
  });

  return `
    <section class="su-border-b su-border-b-black-20 su-pt-32 su-mb-32 md:su-pt-36 lg:su-border-b-transparent lg:su-mb-[104px]">
      ${authors && authors.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Author${authors.length > 1 ? "s" : ""}`,
            children: authors.map((item) => `
              <p class="!su-m-0 su-text-21 su-leading-snug" key="${item.asset_assetid}">
                ${item.asset_name}
              </p>
            `).join('')
          })}
        </div>
      ` : ''}

      ${producers && producers.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Producer${producers.length > 1 ? "s" : ""}`,
            children: producers.map((item) => `
              <p class="!su-m-0 su-text-21 su-leading-snug" key="${item.asset_assetid}">
                ${item.asset_name}
              </p>
            `).join('')
          })}
        </div>
      ` : ''}

      ${writers && writers.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Writer${writers.length > 1 ? "s" : ""}`,
            children: writers.map((item) => `
              <p class="!su-m-0 su-text-21 su-leading-snug" key="${item.asset_assetid}">
                ${item.asset_name}
              </p>
            `).join('')
          })}
        </div>
      ` : ''}

      ${editors && editors.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Editor${editors.length > 1 ? "s" : ""}`,
            children: editors.map((item) => `
              <p class="!su-m-0 su-text-21 su-leading-snug" key="${item.asset_assetid}">
                ${item.asset_name}
              </p>
            `).join('')
          })}
        </div>
      ` : ''}

      ${photographers && photographers.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Photographer${photographers.length > 1 ? "s" : ""}`,
            children: photographers.map((item) => `
              <p class="!su-m-0 su-text-21 su-leading-snug" key="${item.asset_assetid}">
                ${item.asset_name}
              </p>
            `).join('')
          })}
        </div>
      ` : ''}

      ${videographers && videographers.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Videographer${videographers.length > 1 ? "s" : ""}`,
            children: videographers.map((item) => `
              <p class="!su-m-0 su-text-21 su-leading-snug" key="${item.asset_assetid}">
                ${item.asset_name}
              </p>
            `).join('')
          })}
        </div>
      ` : ''}

      ${photography && photography.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Director${photography.length > 1 ? "s" : ""} of Photography`,
            children: photography.map((item) => `
              <p class="!su-m-0 su-text-21 su-leading-snug" key="${item.asset_assetid}">
                ${item.asset_name}
              </p>
            `).join('')
          })}
        </div>
      ` : ''}

      ${media && media.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: `Media contact${media.length > 1 ? "s" : ""}`,
            children: media.map((item) => `
              <div class="" key="${item.asset_assetid}">
                ${item.asset_name}
                ${item.asset_metadata_personEmail && item.asset_metadata_personEmail.length > 0 ? `
                  <br />
                  <a href="mailto:${item.asset_metadata_personEmail}" class="hocus:su-no-underline hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red su-text-18">
                    ${item.asset_metadata_personEmail}
                  </a>
                ` : ''}
              </div>
            `).join('')
          })}
        </div>
      ` : ''}

      ${campus && !["undefined", undefined, null, ""].includes(campus.asset_assetid) ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: "Campus unit",
            children: `
              <a href="${campus.asset_url}" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-18">
                ${campus.asset_name}
              </a>
            `
          })}
        </div>
      ` : ''}

      ${relatedFiltered && relatedFiltered.length ? `
        <div class="su-border-t border-t-black-20">
          ${basicField({
            title: "Related topics",
            contentCSS: "md:su-flex-row md:su-gap-27 md:su-flex-wrap",
            children: relatedFiltered.map((item) => `
              <div class="" key="${item.asset_assetid}">
                <a href="${item.asset_url}" class="su-no-underline su-leading-snug hover:su-underline su-text-digital-red dark:su-text-dark-mode-red dark:hover:su-text-white hover:su-text-black su-text-18">
                  ${item.asset_name}
                </a>
              </div>
            `).join('')
          })}
        </div>
      ` : ''}

      <div class="su-border-t border-t-black-20">
        ${basicField({
          title: "Share this story",
          children: `
            <button
              onclick="copyLink()"
              data-role="copy-link"
              type="button"
              class="su-text-digital-blue dark:su-text-digital-blue-vivid su-text-21 su-font-semibold su-mr-auto hocus:su-underline su-leading-snug"
            >
              <span data-copy-text>Copy link</span>
              <span class="*:su-inline-block *:su-ml-8">
              ${ShareLink()}
              </span>
            </button>
          `
        })}
      </div>
    </section>

    <script>
      function copyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const copyText = document.querySelector('[data-copy-text]');
          copyText.textContent = 'Copied';
          setTimeout(() => {
            copyText.textContent = 'Copy link';
          }, 3000);
        });
      }
    </script>
  `;
}
