/**
 * Renders out an external arrow icon that allows classes and other props to be passed in
 *
 * @return {string}
 */
export function ExternalArrowUnstyled({ className }) {
    return `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width={2}
        stroke="currentColor"
        class="${className}"
        aria-hidden
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
        />
    </svg>`;
}

export default ExternalArrowUnstyled