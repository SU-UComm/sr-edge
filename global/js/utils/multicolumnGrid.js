export const multicolumnGrid = (items, separator)=>{
    const MAXIMUM_ITEMS = 3;
    const MINIMUM_ITEMS = 1;
    const HAS_SEPARATOR = separator === true;
  
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
  
    const gridItems =
      items.length > MAXIMUM_ITEMS ? items.slice(0, MAXIMUM_ITEMS - 1) : items;
    const totalColumns = items.length;
  
    const widthClasses = new Map();
    widthClasses.set("2col", "md:su-basis-1/2");
    widthClasses.set("3col", "md:su-basis-1/3");
  
    const separatorClasses = new Map();
    separatorClasses.set(
      "2col",
      "before:md:su-w-1 before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-1 before:md:su-h-full before:su-left-0 before:su-top-[-34px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]"
    );
    separatorClasses.set(
      "3col",
      "before:md:su-w-1 before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-1 before:md:su-h-full before:su-left-0 before:su-top-[-34px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-51px]"
    );

    return gridItems.length >= MINIMUM_ITEMS ? `
    <div class="su-w-full su-component-multicolumn">
      <div class="${[ "su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between", gapClasses.get(`${totalColumns}col`),].join(" ")}">
      ${gridItems.map((item, i) => {
        return (
            `
            <div
            data-test=${`column-${i}`}
            class="${[ "su-relative su-grow", widthClasses.get(`${totalColumns}col`),HAS_SEPARATOR && i!==0 ? separatorClasses.get(`${totalColumns}col`) : "",].join(" ")}">
            ${item}
            </div>
            `
        );
      }).join('')}
      </div>
    </div>` : ""

}