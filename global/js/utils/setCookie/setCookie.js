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
 * Sets cookie with given name, value, expiry date and location.
 *
 * @param {string} name Cookie name.
 * @param {string} value Cookie value.
 * @param {string} daysToExpire Until when cookie will exist.
 * @param {string} path Location path.
 * @param {object} win Mock Window object.
 *
 * @returns {void}
 */
export function setCookie(
  name,
  value = "",
  secure = true,
  daysToExpire = "",
  path = "/",
  win = _win
) {
  if (!hasDocument(win)) {
    return;
  }

  const { document } = win;

  const {
    location: { hostname },
  } = document;

  let expires = "";
  if (daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  if (secure === true) {
    document.cookie = `${name}=${value}${expires}; path=${path}; domain=${hostname}; secure=${secure};`;
  } else {
    document.cookie = `${name}=${value}${expires}; path=${path}; domain=${hostname};`;
  }
}
