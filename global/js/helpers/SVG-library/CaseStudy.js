/**
 * Renders out the icon for Case study articles
 *
 * @return {JSX.Element}
 */

const DEFAULT_VARIANT = "light";
export function CaseStudy({ variant = DEFAULT_VARIANT }) {
    const variantsMap = new Map();

    variantsMap.set(
        "light",
        `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="23"
            viewBox="0 0 17 23"
            fill="none"
        >
            <path
                d="M2.75 0.389648C1.2332 0.389648 0 1.62285 0 3.13965V19.6396C0 21.1564 1.2332 22.3896 2.75 22.3896H13.75C15.2668 22.3896 16.5 21.1564 16.5 19.6396V7.26465H11C10.2395 7.26465 9.625 6.6502 9.625 5.88965V0.389648H2.75ZM11 0.389648V5.88965H16.5L11 0.389648ZM11.6875 13.4521C11.6875 14.217 11.477 14.9346 11.116 15.5533L12.7617 17.199C13.1656 17.6029 13.1656 18.2561 12.7617 18.6557C12.3578 19.0553 11.7047 19.0596 11.3051 18.6557L9.65508 17.0057C9.04062 17.3709 8.32734 17.5771 7.5625 17.5771C5.28516 17.5771 3.4375 15.7295 3.4375 13.4521C3.4375 11.1748 5.28516 9.32715 7.5625 9.32715C9.83984 9.32715 11.6875 11.1748 11.6875 13.4521ZM7.5625 15.5146C8.10951 15.5146 8.63411 15.2973 9.02091 14.9106C9.4077 14.5238 9.625 13.9992 9.625 13.4521C9.625 12.9051 9.4077 12.3805 9.02091 11.9937C8.63411 11.6069 8.10951 11.3896 7.5625 11.3896C7.01549 11.3896 6.49089 11.6069 6.10409 11.9937C5.7173 12.3805 5.5 12.9051 5.5 13.4521C5.5 13.9992 5.7173 14.5238 6.10409 14.9106C6.49089 15.2973 7.01549 15.5146 7.5625 15.5146Z"
                fill="url(#paint0_linear_1077_1867)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1077_1867"
                    x1="16.5"
                    y1="0.389648"
                    x2="-5.43552"
                    y2="10.0596"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#E50808" />
                    <stop offset="1" stop-color="#820000" />
                </linearGradient>
            </defs>
        </svg>`
    );

    variantsMap.set(
        "dark",
        `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="23"
            viewBox="0 0 17 23"
            fill="none"
        >
            <path
                d="M2.75 0.779297C1.2332 0.779297 0 2.0125 0 3.5293V20.0293C0 21.5461 1.2332 22.7793 2.75 22.7793H13.75C15.2668 22.7793 16.5 21.5461 16.5 20.0293V7.6543H11C10.2395 7.6543 9.625 7.03984 9.625 6.2793V0.779297H2.75ZM11 0.779297V6.2793H16.5L11 0.779297ZM11.6875 13.8418C11.6875 14.6066 11.477 15.3242 11.116 15.943L12.7617 17.5887C13.1656 17.9926 13.1656 18.6457 12.7617 19.0453C12.3578 19.4449 11.7047 19.4492 11.3051 19.0453L9.65508 17.3953C9.04062 17.7605 8.32734 17.9668 7.5625 17.9668C5.28516 17.9668 3.4375 16.1191 3.4375 13.8418C3.4375 11.5645 5.28516 9.7168 7.5625 9.7168C9.83984 9.7168 11.6875 11.5645 11.6875 13.8418ZM7.5625 15.9043C8.10951 15.9043 8.63411 15.687 9.02091 15.3002C9.4077 14.9134 9.625 14.3888 9.625 13.8418C9.625 13.2948 9.4077 12.7702 9.02091 12.3834C8.63411 11.9966 8.10951 11.7793 7.5625 11.7793C7.01549 11.7793 6.49089 11.9966 6.10409 12.3834C5.7173 12.7702 5.5 13.2948 5.5 13.8418C5.5 14.3888 5.7173 14.9134 6.10409 15.3002C6.49089 15.687 7.01549 15.9043 7.5625 15.9043Z"
                fill="url(#paint0_linear_1077_1873)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1077_1873"
                    x1="16.5"
                    y1="0.779297"
                    x2="-5.43552"
                    y2="10.4492"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#8F993E" />
                    <stop offset="1" stop-color="#279989" />
                </linearGradient>
            </defs>
        </svg>`
    );

    if (variant && variantsMap.get(variant)) return variantsMap.get(variant);

    return `
    <svg
        aria-hidden="true"
        data-testid="svg-case-study"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="17"
        viewBox="0 0 12 17"
        fill="none"
    >
        <path d="M2 0.5C0.896875 0.5 0 1.39688 0 2.5V14.5C0 15.6031 0.896875 16.5 2 16.5H10C11.1031 16.5 12 15.6031 12 14.5V5.5H8C7.44688 5.5 7 5.05312 7 4.5V0.5H2ZM8 0.5V4.5H12L8 0.5ZM8.5 10C8.5 10.5562 8.34688 11.0781 8.08438 11.5281L9.28125 12.725C9.575 13.0188 9.575 13.4938 9.28125 13.7844C8.9875 14.075 8.5125 14.0781 8.22188 13.7844L7.02187 12.5844C6.575 12.85 6.05625 13 5.5 13C3.84375 13 2.5 11.6562 2.5 10C2.5 8.34375 3.84375 7 5.5 7C7.15625 7 8.5 8.34375 8.5 10ZM5.5 11.5C5.89782 11.5 6.27936 11.342 6.56066 11.0607C6.84196 10.7794 7 10.3978 7 10C7 9.60218 6.84196 9.22064 6.56066 8.93934C6.27936 8.65804 5.89782 8.5 5.5 8.5C5.10218 8.5 4.72064 8.65804 4.43934 8.93934C4.15804 9.22064 4 9.60218 4 10C4 10.3978 4.15804 10.7794 4.43934 11.0607C4.72064 11.342 5.10218 11.5 5.5 11.5Z" />
    </svg>`;
}

export default CaseStudy;