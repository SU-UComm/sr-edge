/**
 * Creates pagination buttons
 * @param {number} offsetNum - Current offset number
 * @param {number} pageNumber - Current page number
 * @param {number} index - Button index
 * @returns {string} HTML string of the button
 */
function paginationButton({ offsetNum, pageNumber, index }) {
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
            })
        );
    });

    return pages > 1
        ? `<div class="su-mx-auto su-component-container">
                <div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7">
                    <button
                        type="button"
                        class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white ${
                            prevPage < 1 ? finalPageClass : ""
                        }"
                        ${prevPage < 1 ? "disabled" : ""}
                        data-offset="${prevPage < 1 ? 1 : prevPage}"
                        aria-label="Previous page"
                        title="Previous page"
                    >
                        <svg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path fill-rule='evenodd' clip-rule='evenodd' d='M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z'/>
                        </svg>
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
                        aria-label="Next page"
                        title="Next page"
                    >
                        <svg class='su-fill-transparent su-stroke-current' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'>
                            <path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                        </svg>
                    </button>
                </div>
            </div>`
    : "";
}
