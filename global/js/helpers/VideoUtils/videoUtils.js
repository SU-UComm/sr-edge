/**
 * Sends a postMessage command to a Vimeo iframe player.
 *
 * @param {HTMLIFrameElement} player - The iframe element that embeds the Vimeo player.
 * @param {string} command - The command to send to the player, e.g., 'play' or 'pause'.
 */
// Play/pause helpers
export function postMessageToVimeo(player, command) {
    player.contentWindow.postMessage(JSON.stringify({method: command}), '*');
}

/**
 * Updates the button state and icon to reflect play/pause.
 *
 * This function switches the button's `aria-pressed` state,
 * toggles visibility of play/pause icons,
 * and updates the inner label based on the current state.
 *
 * @param {HTMLButtonElement} btn - The button element to update.
 * @param {boolean} state - Current state: `true` if paused, `false` if playing.
 */
export function setControlLabel(btn, state) {    
    const playIcon = btn.querySelector('svg[data-control="play"]');
    const pauseIcon = btn.querySelector('svg[data-control="pause"]');
    const newState = !state;

    btn.setAttribute('aria-pressed', String(newState));
    
    playIcon.classList.toggle('su-hidden', newState);
    playIcon.hidden = newState;

    pauseIcon.classList.toggle('su-hidden', !newState);
    pauseIcon.hidden = !newState;

    btn.innerHTML = `
    <span class="*:su-size-14 su-flex su-gap-6 su-items-center su-text-14 lg:su-top-0 lg:su-right-0">
        ${playIcon.outerHTML}
        ${pauseIcon.outerHTML}
        ${newState ? btn.getAttribute('data-label-pause') : btn.getAttribute('data-label-play')}
    </span>
  `
}