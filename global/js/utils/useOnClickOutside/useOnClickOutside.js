/**
 * Creates an outside click detector
 * @param {HTMLElement} element - The element to detect clicks outside of
 * @param {function} handler - The function to call when a click outside is detected
 * @returns {Object} An object with attach() and detach() methods
 */
export function useOnClickOutside(element, handler) {
  const listener = (event) => {
    // Do nothing if clicking element or descendent elements
    if (!element || element.contains(event.target)) {
      return;
    }
    handler(event);
  };

  return {
    attach: () => {
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      document.addEventListener("keyup", listener);
    },
    detach: () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("keyup", listener);
    }
  };
}

export default useOnClickOutside;
