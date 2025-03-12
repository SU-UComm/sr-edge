import { container } from '../grids/container';
import ChevronRight from "../SVG-library/ChevronRight";
import ChevronLeft from "../SVG-library/ChevronLeft";

/**
 * Creates pagination buttons
 * @param {number} offsetNum - Current offset number
 * @param {number} pageNumber - Current page number
 * @param {number} index - Button index
 * @param {function} onPaginate - Click handler function
 * @returns {string} HTML string of the button
 */
function paginationButton({ offsetNum, pageNumber, index, onPaginate }) {
  const activeClass = "su-bg-digital-red su-rounded-[100px] su-text-white";
  const nonActiveClass = "su-text-black";

  return `
    <button
      data-offset="${offsetNum}"
      class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white ${
        offsetNum === pageNumber ? activeClass : nonActiveClass
      }"
      ${offsetNum === pageNumber ? 'disabled' : ''}
      type="button"
      onclick="${onPaginate}"
    >
      ${index}
    </button>
  `;
}

/**
 * Creates a pagination component
 * 
 * @param {number} pageNumber - Current page number
 * @param {number} allResults - Total number of results
 * @param {number} resultsPerPage - Number of results per page
 * @param {number} paginationRange - Range of pagination buttons to show
 * @param {function} onPageChange - Page change handler function
 * @returns {string} HTML string of the pagination component
 */
export function pagination({
  pageNumber,
  allResults,
  resultsPerPage,
  paginationRange,
  onPageChange,
}) {
  const pages = Math.ceil(allResults / resultsPerPage);
  const initialRange = paginationRange;

  const prevPage = pageNumber - resultsPerPage;
  const nextPage = pageNumber + resultsPerPage;
  const finalPageClass = "su-text-black-50";
  const buttons = [];
  const offsets = [];

  // Initialize current page state
  let currentPage = 1;

  for (let i = 0; i < pages; i++) {
    const offsetNum = i * resultsPerPage + 1;
    offsets.push(offsetNum);
  }

  let rangeNextOffset = [...offsets];
  let rangePrevOffset = [...offsets];
  const currentIndex = offsets.indexOf(currentPage);
  const rangeBuffer = Math.floor(initialRange * 0.5);

  // If current page index is less than range buffer or pages match initial range
  if (currentIndex < rangeBuffer || pages === initialRange) {
    rangeNextOffset = rangeNextOffset.filter(
      (item, i) => item > currentPage && i < initialRange
    );
    rangePrevOffset = rangePrevOffset.filter((item) => item < currentPage);
  }

  // If current page index is greater than range buffer and pages don't match initial range
  if (currentIndex >= rangeBuffer && pages !== initialRange) {
    rangeNextOffset = rangeNextOffset.filter(
      (item, i) => item > currentPage && i <= currentIndex + rangeBuffer
    );

    if (rangeNextOffset.length === rangeBuffer) {
      rangePrevOffset = rangePrevOffset.filter(
        (item, i) => item < currentPage && i >= currentIndex - rangeBuffer
      );
    } else {
      const endBuffer = rangeNextOffset.length
        ? initialRange - rangeNextOffset.length
        : initialRange;

      rangePrevOffset = rangePrevOffset.filter(
        (item, i) => item < currentPage && i > currentIndex - endBuffer
      );
    }
  }

  const buttonRange = [...rangePrevOffset, currentPage, ...rangeNextOffset];
  const buttonItems = buttonRange.map((item) => ({
    offset: item,
    index: offsets.indexOf(item) + 1,
  }));

  buttonItems.forEach(({ offset, index }) => {
    buttons.push(
      paginationButton({
        offsetNum: offset,
        pageNumber: pageNumber,
        index: index,
        onPaginate: `
          currentPage = ${offset};
          ${onPageChange}(${offset});
        `,
      })
    );
  });

  return pages > 1
    ? container({
        children: `
          <div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7">
            <button
              type="button"
              class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white ${
                prevPage < 1 ? finalPageClass : ""
              }"
              ${prevPage < 1 ? "disabled" : ""}
              data-offset="${prevPage < 1 ? 1 : prevPage}"
              onclick="
                currentPage = ${prevPage < 1 ? 1 : prevPage};
                ${onPageChange}(this.dataset.offset);
              "
              aria-label="Previous page"
              title="Previous page"
            >
              ${ChevronLeft}
            </button>

            ${buttons.join("")}

            <button
              type="button"
              class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white ${
                nextPage > offsets[offsets.length - 1] ? finalPageClass : ""
              }"
              ${nextPage > offsets[offsets.length - 1] ? "disabled" : ""}
              data-offset="${
                nextPage > offsets[offsets.length - 1]
                  ? offsets[offsets.length - 1]
                  : nextPage
              }"
              onclick="
                currentPage = ${
                  nextPage > offsets[offsets.length - 1]
                    ? offsets[offsets.length - 1]
                    : nextPage
                };
                ${onPageChange}(this.dataset.offset);
              "
              aria-label="Next page"
              title="Next page"
            >
              ${ChevronRight()}
            </button>
          </div>
        `,
      })
    : "";
}
