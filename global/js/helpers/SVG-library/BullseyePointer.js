const DEFAULT_VARIANT = "light";

/**
 * Renders out the icon for a bullseye pointer
 *
 * @returns {string}
 */
export function BullseyePointer({ variant = DEFAULT_VARIANT }) {
    const variantsMap = new Map();

    variantsMap.set(
        "light",
        `<svg
            class=""
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
        >
            <g clipPath="url(#clip0_2402_1235)">
                <path
                    d="M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z"
                    fill="url(#paint0_linear_2402_1235)"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_2402_1235"
                    x1="-0.00390625"
                    y1="0"
                    x2="27"
                    y2="3.0407e-08"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop class="su-stop-red" />
                    <stop offset="1" class="su-stop-plum" />
                </linearGradient>
                <clipPath id="clip0_2402_1235">
                    <rect width="27" height="27" fill="white" />
                </clipPath>
            </defs>
        </svg>`
    );

    variantsMap.set(
        "dark",
        `<svg
            class=""
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
        >
            <g clipPath="url(#clip0_2402_1235)">
                <path
                    d="M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z"
                    fill="url(#bullseyePointerDarkGradient)"
                />
            </g>
            <defs>
                <linearGradient
                    id="bullseyePointerDarkGradient"
                    x1="-0.00390625"
                    y1="0"
                    x2="27"
                    y2="3.0407e-08"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop class="su-stop-teal" />
                    <stop offset="1" class="su-stop-green" />
                </linearGradient>
                <clipPath id="clip0_2402_1235">
                    <rect width="27" height="27" fill="white" />
                </clipPath>
            </defs>
        </svg>`
    );

  if (variantsMap.get(variant) !== null) return variantsMap.get(variant);

  return variantsMap.get(DEFAULT_VARIANT);
}

export default BullseyePointer;