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
 * Gets value of cookie.
 *
 * @param {string} key Cookie key we are trying to get.
 * @param {object} win Mock Window object.
 *
 * @returns {null|string}
 */
export function getCookie(key, win = _win) {
  if (!hasDocument(win)) {
    return null;
  }

  const { document } = win;
  const { cookie } = document;

  if (typeof cookie !== "string") {
    return null;
  }

  const cookies = cookie.split("; ");

  let cookieValue = null;
  cookies.find((element) => {
    const [_key, _value] = element.split("=");
    if (_key === key && _value !== "") {
      cookieValue = _value;
    }
    return null;
  });

  return cookieValue;
}
