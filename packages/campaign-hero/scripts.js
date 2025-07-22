import { Modal } from '../../global/js/helpers';

/**
 * Initialize the Campaign Hero component
 */
export function _campaignHeroInit(component) {
    
    // Handle background video controls
    const videoControl = component.querySelector('[data-video-control]');
    if (videoControl) {
        const iframe = component.querySelector('iframe');
        const controlText = videoControl.querySelector('[data-video-control-text]');
        const playIcon = videoControl.querySelector('[data-video-control-icon="play"]');
        const pauseIcon = videoControl.querySelector('[data-video-control-icon="pause"]');
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
        const modalElement = document.getElementById(modalId);

        if (modalElement) {
            Modal({
                trigger,
                content: modalElement,
                uniqueId: modalId,
                describedby: 'card-modal'
            });
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
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-component="campaign-hero"]').forEach(section => {
        _campaignHeroInit(section);
    });    
});
