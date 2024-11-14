/**
 * Renders out the icon for sharing a link
 *
 * @return {string}
 */
export function ShareLink() {
	return `
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
	>
		<path
		d="M13 6C14.6569 6 16 4.65685 16 3C16 1.34315 14.6569 0 13 0C11.3431 0 10 1.34315 10 3C10 3.12548 10.0077 3.24917 10.0227 3.37061L5.08259 5.84064C4.54303 5.32015 3.8089 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.80892 11 4.54306 10.6798 5.08263 10.1593L10.0227 12.6293C10.0077 12.7508 10 12.8745 10 13C10 14.6569 11.3431 16 13 16C14.6569 16 16 14.6569 16 13C16 11.3431 14.6569 10 13 10C12.1911 10 11.457 10.3201 10.9174 10.8406L5.97733 8.37061C5.9923 8.24917 6 8.12548 6 8C6 7.8745 5.99229 7.7508 5.97733 7.62934L10.9174 5.15932C11.4569 5.67984 12.1911 6 13 6Z"
		fill="#006CB8"
		/>
	</svg>`;
}

export default ShareLink;