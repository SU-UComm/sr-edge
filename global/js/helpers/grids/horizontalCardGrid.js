/**
 * HorizontalCard Grid helper
 * 
 * @param {Array} items The elements to display in the grid
 * @param {string} orientation The orientation of the grid items (vertical|horizontal)
 * @param {number} maximumItems The maximum number of items to display
 * @returns {HTMLElement}
 */
export function horizontalCardGrid({
  items,
  orientation = "horizontal",
  maximumItems = 6
} = {}) {
  const MAXIMUM_ITEMS = maximumItems;
  const MINIMUM_ITEMS = 1;

  const gridItems = items.length > MAXIMUM_ITEMS ? items.slice(0, MAXIMUM_ITEMS) : items;

  const orientationClassMap = new Map();
  orientationClassMap.set("vertical", "su-grid-cols-1 su-gap-36 md:su-gap-27");
  orientationClassMap.set(
    "horizontal",
    "su-grid-cols-1 md:su-grid-cols-2 lg:su-grid-cols-3 su-gap-34 md:su-gap-36 lg:su-gap-48"
  );
  orientationClassMap.set(
    "topiclisting",
    "su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61"
  );

  if (gridItems.length < MINIMUM_ITEMS) return null;

  return `
    <div class="su-w-full su-component-horizontal-card-grid" 
         data-test="orientation-${orientation}">
      <div class="${[
        'su-relative su-grid',
        orientationClassMap.get(orientation)
      ].join(' ')}">
        ${gridItems.map(item => `
          <div class="su-relative su-grow">
            ${item}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
