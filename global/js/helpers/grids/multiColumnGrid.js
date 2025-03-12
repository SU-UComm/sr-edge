import { multiColumnGridContent } from "./multiColumnGridContent";
/**
 * MultiColumn Grid helper
 *
 * @param {string} items The elements to display in the grid
 * @param {boolean} separator Display line separators, defaults to false (off)
 * @returns {HTMLElement}
 */
export function multiColumnGrid({ items, separator = false }) {
  const MAXIMUM_ITEMS = 3;
  const MINIMUM_ITEMS = 1;

  const gapClasses = new Map();
  gapClasses.set(
    "2col",
    separator
      ? "su-gap-[68px] md:su-gap-72 lg:su-gap-[160px]"
      : "su-gap-34 md:su-gap-72 lg:su-gap-[160px]"
  );
  gapClasses.set(
    "3col",
    separator
      ? "su-gap-[68px] md:su-gap-72 lg:su-gap-[102px]"
      : "su-gap-34 md:su-gap-72 lg:su-gap-[160px]"
  );

  const gridItems = items.length > MAXIMUM_ITEMS ? items.slice(0, MAXIMUM_ITEMS) : items;

  if (gridItems.length < MINIMUM_ITEMS) return null;

  return `
    <div class="su-w-full su-component-multicolumn">
      <div class="${[
        'su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between',
        gapClasses.get(`${items.length}col`)
      ].join(' ')}">

        ${gridItems.map((item, i) => {
          return multiColumnGridContent({
            children: item,
            placement: i,
            totalColumns: items.length,
            separator
          })
        }).join('')}

      </div>
    </div>
  `;
}
