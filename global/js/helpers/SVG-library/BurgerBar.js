/**
 * Renders out the chevron right SVG icon
 *
 * @return {string}
 */
export function BurgerBar({ className }) {
    return `
        <svg
            aria-hidden="true"
            focusable="false"
            class="${className}"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.79999 7.99999C4.79999 7.11634 5.51633 6.39999 6.39999 6.39999H25.6C26.4836 6.39999 27.2 7.11634 27.2 7.99999C27.2 8.88365 26.4836 9.59999 25.6 9.59999H6.39999C5.51633 9.59999 4.79999 8.88365 4.79999 7.99999Z"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.79999 16C4.79999 15.1163 5.51633 14.4 6.39999 14.4H25.6C26.4836 14.4 27.2 15.1163 27.2 16C27.2 16.8836 26.4836 17.6 25.6 17.6H6.39999C5.51633 17.6 4.79999 16.8836 4.79999 16Z"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.79999 24C4.79999 23.1163 5.51633 22.4 6.39999 22.4H25.6C26.4836 22.4 27.2 23.1163 27.2 24C27.2 24.8836 26.4836 25.6 25.6 25.6H6.39999C5.51633 25.6 4.79999 24.8836 4.79999 24Z"
            />
    </svg>`;
}

export default BurgerBar;