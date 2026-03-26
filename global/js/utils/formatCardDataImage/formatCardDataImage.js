/**
 * formats image data from Matrix image assets
 * into a more simplified shape
 *
 * @param {object} object
 * the image data structure
 *
 * @returns {object}
 */
export function formatCardDataImage({ attributes, url }) {
    const normalizeAttrValue = (attr) => {
        if (attr == null) return undefined;
        if (typeof attr === "object" && "value" in attr) return attr.value;
        return attr;
    };

    const toFiniteNumber = (value) => {
        const normalized = normalizeAttrValue(value);
        const num = typeof normalized === "number" ? normalized : Number(normalized);
        return Number.isFinite(num) ? num : undefined;
    };

    const inferDimsFromUrl = (rawUrl) => {
        if (!rawUrl || typeof rawUrl !== "string") return {};

        // Query param patterns (?w=1200&h=400, ?width=1200&height=400)
        try {
            const parsed = new URL(rawUrl);
            const w = toFiniteNumber(parsed.searchParams.get("w") ?? parsed.searchParams.get("width"));
            const h = toFiniteNumber(parsed.searchParams.get("h") ?? parsed.searchParams.get("height"));
            if (w && h) return { width: w, height: h };
        } catch {
            // ignore invalid URLs
        }

        // Common path pattern (e.g. https://picsum.photos/1200/400)
        const match = rawUrl.match(/\/(\d{2,5})\/(\d{2,5})(?:\/|$|\?)/);
        if (!match) return {};

        const w = toFiniteNumber(match[1]);
        const h = toFiniteNumber(match[2]);
        if (w && h) return { width: w, height: h };

        return {};
    };

    const alt = normalizeAttrValue(attributes?.alt) ?? "";

    const embedded = normalizeAttrValue(attributes?.embedded_data);

    const width =
        toFiniteNumber(attributes?.width) ??
        toFiniteNumber(embedded?.imagewidth) ??
        toFiniteNumber(embedded?.ImageWidth);

    const height =
        toFiniteNumber(attributes?.height) ??
        toFiniteNumber(embedded?.imageheight) ??
        toFiniteNumber(embedded?.ImageHeight);

    const inferred = inferDimsFromUrl(url);
    const resolvedWidth = width ?? inferred.width;
    const resolvedHeight = height ?? inferred.height;

    // Default to horizontal when dimensions are unknown. This prevents
    // "everything becomes vertical" failures when upstream data omits dims.
    const orientation =
        resolvedWidth && resolvedHeight
            ? (resolvedWidth >= resolvedHeight ? "h" : "v")
            : "h";

    return {
        alt,
        width: resolvedWidth,
        height: resolvedHeight,
        url,
        orientation,
    };
}

export default formatCardDataImage;