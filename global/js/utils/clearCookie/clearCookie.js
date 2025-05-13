const _win = typeof window === "undefined" ? {} : window;

/**
 * Helper to check if document is available.
 *
 * @param {object} win Mock Window object.
 */
function hasDocument(win = _win) {
  return win.document !== undefined;
}

/**
 * Removes cookie with specific name.
 *
 * @param {string} name Cookie name.
 * @param {string} path Location path.
 * @param {object} win Mock Window object.
 *
 * @returns {void}
 */
export function clearCookie(name, path = "/", win = _win) {
  if (!hasDocument(win)) {
    return;
  }

  const { document } = win;

  const {
    location: { hostname },
  } = document;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path}; domain=${hostname}; secure;`;
}
