/**
 * Renders out the video icon
 *
 * @return {string}
 */
export function Video() {
    return `
    <svg
        aria-hidden="true"
        data-testid="svg-video"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="13"
        viewBox="0 0 18 13"
        fill="none"
    >
        <path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z" />
    </svg>`;
}

export default Video;