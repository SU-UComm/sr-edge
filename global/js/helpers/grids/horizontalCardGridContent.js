/**
 * HorizontalCard Grid Content helper
 *
* @param {component} children The child elements for this content placement
 * @returns {HTMLElement}
 */
export function horizontalCardContent(children) {
  return `
    <div class="su-relative su-grow">
      ${children}
    </div>
  `;
}
