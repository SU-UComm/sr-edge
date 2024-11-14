/**
 * Renders out the chevron right SVG icon
 *
 * @return {string}
 */
export default function ChevronRight({ className }) {
    return `
    <svg
        class="su-fill-transparent su-stroke-current"
        data-testid="svg-chevron-right"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        class="${className}"
        aria-hidden
    >
        <path
            d="M6.75 4.25L12 9.5L6.75 14.75"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>`;
}