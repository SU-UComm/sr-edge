/**
 * Multi-column Grid Content helper
 *
* @param {component} children The child elements for this content placement
 * @param {string} placement The position within the multicolumn grid from left to right
 * @param {number} totalColumns The total number of columns for this grid
 * @param {boolean} separator Display line separators, defaults to false (off)
 * @returns {HTMLElement}
 */
export function multiColumnGridContent({
  children,
  placement,
  totalColumns,
  separator = false,
}) {
  const NOT_FIRST_COLUMN = placement !== 0;
  const HAS_SEPARATOR = separator === true;

  const widthClasses = new Map();
  widthClasses.set("2col", "md:su-basis-1/2");
  widthClasses.set("3col", "md:su-basis-1/3");

  const separatorClasses = new Map();
  separatorClasses.set(
    "2col",
    "before:su-w-full before:md:su-w-1 before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-1 before:md:su-h-full before:su-left-0 before:su-top-[-34px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"
  );
  separatorClasses.set(
    "3col",
    "before:su-w-full before:md:su-w-1 before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-1 before:md:su-h-full before:su-left-0 before:su-top-[-34px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-51px]"
  );

  return `
    <div data-test="column-${placement}" 
         class="${[
           'su-relative su-grow',
           widthClasses.get(`${totalColumns}col`),
           HAS_SEPARATOR && NOT_FIRST_COLUMN ? separatorClasses.get(`${totalColumns}col`) : ''
         ].filter(Boolean).join(' ')}">
      ${children}
    </div>
  `;
}
