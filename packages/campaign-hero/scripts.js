/**
 * Globals variables 
 * @constant {string} CAMPAIGN_HERO_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} CAMPAIGN_HERO_MODAL_IFRAME - Selector for the modal iframe.
 */
export const CAMPAIGN_HERO_HIDDEN_CLASS = 'su-hidden';
export const CAMPAIGN_HERO_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(CAMPAIGN_HERO_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(CAMPAIGN_HERO_HIDDEN_CLASS);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(CAMPAIGN_HERO_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(CAMPAIGN_HERO_HIDDEN_CLASS);
    modal.hidden = true;
    document.body.style.overflow = '';
}

/**
 * Initialize the Campaign Hero component
 */
export function _campaignHeroInit(component) {

    let currentModal = null;
    
    // Handle background video controls
    const videoControl = component.querySelector('[data-video-control]');
    if (videoControl) {
        const iframe = component.querySelector('iframe');
        const controlText = videoControl.querySelector('[data-video-control-text]');
        const playIcon = videoControl.querySelector('[data-control-icon="play"]');
        const pauseIcon = videoControl.querySelector('[data-control-icon="pause"]');
        let isPlaying = true;
        let isUserPaused = false;

        // Toggle play/pause when button is clicked
        videoControl.addEventListener('click', () => {
            isUserPaused = !isUserPaused;
            isPlaying = !isPlaying;
            updateVideoState();
        });

        // Send postMessage to Vimeo iframe to play/pause video
        function updateVideoState() {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                    JSON.stringify({ method: isPlaying ? 'play' : 'pause' }),
                    '*'
                );

                // Update UI
                controlText.textContent = `${isPlaying ? 'Pause' : 'Play'} background`;
                playIcon.classList.toggle('su-hidden', isPlaying);
                pauseIcon.classList.toggle('su-hidden', !isPlaying);
            }
        }

        // Pause video when it's out of viewport using IntersectionObserver
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                // Only set play/pause based on IntersectionObserver if video is not manually paused
                if (!isUserPaused) {
                    isPlaying = entry.isIntersecting;
                    updateVideoState();
                }
            },
            { threshold: 0 }
        );

        if (iframe) observer.observe(iframe);
    }

    // Initialize modals for YouTube videos
    const modalTriggers = component.querySelectorAll('[data-modal-trigger]');
    
    modalTriggers.forEach(trigger => {
        const modalId = trigger.getAttribute('data-modal-trigger');
        const modalElement = component.querySelector(`[data-modal-id="${modalId}"]`);

        trigger && trigger.addEventListener('click', function() {
            // Set current modal
            currentModal = modalElement;
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

    const closeBtns = component.querySelectorAll('[data-modal-close]');
    closeBtns && closeBtns.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            currentModal && closeModal(currentModal);
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            currentModal && closeModal(currentModal);
        }
    });
} 

/**
 * Initializes campaign hero when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `[data-component="campaign-hero"]` selector
 * and applies the `_campaignHeroInit` function to each of them.
 *
 * @listens DOMContentLoaded
 */
export function initCampaignHeroListeners() {
    const campaignHeroSections = document.querySelectorAll('[data-component="campaign-hero"]');
    
    if ( campaignHeroSections.length > 0) {
        campaignHeroSections.forEach(section => {
            _campaignHeroInit(section);
        });
    }
}

// Listen on both DOMContentLoaded and livePreviewUpdated events
document.addEventListener('DOMContentLoaded', initCampaignHeroListeners);
document.addEventListener('livePreviewUpdated', initCampaignHeroListeners);
