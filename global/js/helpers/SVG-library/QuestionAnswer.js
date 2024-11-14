/**
 * Renders out the Q & A icon
 *
 * @return {string}
 */
export function QuestionAnswer() {
    return `
    <svg
        aria-hidden="true"
        data-testid="svg-q-and-a"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="17"
        viewBox="0 0 20 17"
        fill="none"
    >
        <path d="M2 0.500345C0.896875 0.500345 0 1.39722 0 2.50035V8.50035C0 9.60347 0.896875 10.5003 2 10.5003H3V12.0003C3 12.191 3.10625 12.3628 3.275 12.4472C3.44375 12.5316 3.64687 12.5128 3.8 12.4003L6.33437 10.5003H11C12.1031 10.5003 13 9.60347 13 8.50035V2.50035C13 1.39722 12.1031 0.500345 11 0.500345H2ZM11 11.5003H8V12.5003C8 13.6035 8.89688 14.5003 10 14.5003H13.6656L16.2 16.4003C16.35 16.5128 16.5531 16.5316 16.725 16.4472C16.8969 16.3628 17 16.191 17 16.0003V14.5003H18C19.1031 14.5003 20 13.6035 20 12.5003V6.50035C20 5.39722 19.1031 4.50035 18 4.50035H14V8.50035C14 10.1566 12.6562 11.5003 11 11.5003Z" />
    </svg>`;
}

export default QuestionAnswer;