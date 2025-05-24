/**
 * Globals
 */
export const STANDALONE_VISUAL_HERO_SELECTOR = 'section[data-component="standalone-visual-hero"]';
export const STANDALONE_VISUAL_HERO_HIDDEN_CLASS = 'su-hidden';
export const STANDALONE_VISUAL_HERO_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const STANDALONE_VISUAL_HERO_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const STANDALONE_VISUAL_HERO_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
  const iframe = modal.querySelector(STANDALONE_VISUAL_HERO_MODAL_IFRAME);
  if (iframe) {
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0', 'autoplay=1');
    iframe.setAttribute('src', newSrc);
  }

  modal.classList.remove(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
  const iframe = modal.querySelector(STANDALONE_VISUAL_HERO_MODAL_IFRAME);
  if (iframe) {
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1', 'autoplay=0');
    iframe.setAttribute('src', newSrc);
  }

  modal.classList.add(STANDALONE_VISUAL_HERO_HIDDEN_CLASS);
  modal.hidden = true;
  document.body.style.overflow = '';
}

/**
 * Modal init function
 * @param {HTMLElement} section - The section DOM element
 */
export function _modalInit(section) {
  const openModalBtn = section.querySelectorAll(STANDALONE_VISUAL_HERO_OPEN_MODAL_BTN);
  const closeBtn = section.querySelectorAll(STANDALONE_VISUAL_HERO_CLOSE_MODAL_BTN);
  let currentModal = null;

  openModalBtn.forEach(btn => {
    btn.addEventListener('click', function () {
      const uniqueId = btn.dataset.modalId;

      currentModal = section.querySelector(`div[data-modal-id="${uniqueId}"]`);

      if (!currentModal) return;

      const modalContent = currentModal.querySelector('.su-modal-content');

      if (!currentModal.dataset.listenerAdded) {
        modalContent && currentModal.addEventListener('click', (event) => {
          if (!modalContent.contains(event.target)) {
            closeModal(currentModal);
          }
        });

        currentModal.dataset.listenerAdded = 'true';
      }

      openModal(currentModal);
    });
  });

  closeBtn.forEach(btn => {
    btn.addEventListener('click', function () {
      currentModal && closeModal(currentModal);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      currentModal && closeModal(currentModal);
    }
  });
}

/**
 * DOMContentLoaded Init
 */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(STANDALONE_VISUAL_HERO_SELECTOR).forEach(section => {
    _modalInit(section);
  });
});
