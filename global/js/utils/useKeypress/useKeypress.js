/**
 * Creates a keypress event handler
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 * @returns {Object} An object with attach() and detach() methods
 */
export function useKeypress(key, action) {
  function onKeyup(e) {
    if (e.key === key) action();
  }
  
  return {
    attach: () => window.addEventListener("keyup", onKeyup),
    detach: () => window.removeEventListener("keyup", onKeyup)
  };
}

export default useKeypress;
