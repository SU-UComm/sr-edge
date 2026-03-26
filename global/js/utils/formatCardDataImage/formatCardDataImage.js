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

    const toPositiveNumber = (value) => {
        const num = toFiniteNumber(value);
        return num && num > 0 ? num : undefined;
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

        const w = toPositiveNumber(match[1]);
        const h = toPositiveNumber(match[2]);
        if (w && h) return { width: w, height: h };

        return {};
    };

    const inferDimsFromVarieties = (attrs) => {
        // Matrix sometimes stores the real dimensions only on image varieties.
        const varieties = normalizeAttrValue(attrs?.varieties);
        const data = normalizeAttrValue(varieties?.data);
        if (!data || typeof data !== "object") return {};

        let best = null;
        for (const key of Object.keys(data)) {
            const v = data[key];
            const w = toPositiveNumber(v?.variety_width ?? v?.varietyWidth ?? v?.width);
            const h = toPositiveNumber(v?.variety_height ?? v?.varietyHeight ?? v?.height);
            if (!w || !h) continue;
            const area = w * h;
            if (!best || area > best.area) best = { width: w, height: h, area };
        }

        if (!best) return {};
        return { width: best.width, height: best.height };
    };

    const alt = normalizeAttrValue(attributes?.alt) ?? "";

    const embedded = normalizeAttrValue(attributes?.embedded_data);

    const width =
        toPositiveNumber(attributes?.width) ??
        toPositiveNumber(embedded?.imagewidth) ??
        toPositiveNumber(embedded?.ImageWidth);

    const height =
        toPositiveNumber(attributes?.height) ??
        toPositiveNumber(embedded?.imageheight) ??
        toPositiveNumber(embedded?.ImageHeight);

    const inferredVarieties = inferDimsFromVarieties(attributes);
    const inferredUrl = inferDimsFromUrl(url);

    const resolvedWidth = width ?? inferredVarieties.width ?? inferredUrl.width;
    const resolvedHeight = height ?? inferredVarieties.height ?? inferredUrl.height;

    // Default to horizontal when dimensions are unknown.
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