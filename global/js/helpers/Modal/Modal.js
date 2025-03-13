/**
 * Creates a modal dialog (server-side only)
 * 
 * @param {string} titleId - ID for aria-describedby
 * @param {string} title - Modal title
 * @param {string} children - Modal content
 * @returns {string} HTML string of the modal
 */
export function Modal({ titleId, title, children }) {
  return `
    <div hidden aria-modal="true" role="dialog" class="su-modal" ${titleId ? `aria-describedby="${titleId}"` : ''} data-modal="modal">
      ${!titleId && title ? `<h2>${title}</h2>` : ''}
      <span data-focus-scope-start="true" hidden=""></span>
      <div class="su-modal-content">
        ${children}
      </div>

      <button type="button" class="su-component-close su-text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="su-w-[1.1em] su-h-[1.1em]">
          <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
        </svg>
        <span>Close</span>
      </button>
    </div>
  `;
}
