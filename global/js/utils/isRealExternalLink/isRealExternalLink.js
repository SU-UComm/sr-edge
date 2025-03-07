export function isRealExternalLink(externalUrl) {
    return !!externalUrl && !externalUrl?.includes("news.stanford.edu");
}

export default isRealExternalLink;