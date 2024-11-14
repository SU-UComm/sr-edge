const DEFAULT_VARIANT = "light";
export function PieChart({ variant = DEFAULT_VARIANT }) {
    const variantsMap = new Map();

    variantsMap.set(
        "light",
        `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="67"
            height="66"
            viewBox="0 0 67 66"
            fill="none"
            data-testid="pie-chart-svg"
        >
            <path
                d="M7.09961 32.9996C7.09961 18.4193 18.9193 6.59961 33.4996 6.59961V32.9996H59.8996C59.8996 47.5799 48.0799 59.3996 33.4996 59.3996C18.9193 59.3996 7.09961 47.5799 7.09961 32.9996Z"
                fill="#B1040E"
            />
            <path
                d="M40.0996 7.43105C49.3768 9.81883 56.6804 17.1226 59.068 26.3998H40.0996V7.43105Z"
                fill="#B1040E"
            />
        </svg>`
    );

    variantsMap.set(
        "dark",
        `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="67"
            height="66"
            viewBox="0 0 67 66"
            fill="none"
            data-testid="pie-chart-svg"
        >
            <path
                d="M7.09961 32.9996C7.09961 18.4193 18.9193 6.59961 33.4996 6.59961V32.9996H59.8996C59.8996 47.5799 48.0799 59.3996 33.4996 59.3996C18.9193 59.3996 7.09961 47.5799 7.09961 32.9996Z"
                fill="#279989"
            />
            <path
                d="M40.0996 7.43105C49.3768 9.81883 56.6804 17.1226 59.068 26.3998H40.0996V7.43105Z"
                fill="#279989"
            />
        </svg>`
    );

    if (variantsMap.get(variant) !== null) {
        return variantsMap.get(variant);
    }

    return variantsMap.get(DEFAULT_VARIANT);
}
export default PieChart;