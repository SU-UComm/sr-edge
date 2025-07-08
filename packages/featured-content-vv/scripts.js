import { Modal } from '../../global/js/helpers';

/**
 * Initialize the Featured content with vertical video component
 */
export default function init() {
    // Find all featured content components on the page
    const components = document.querySelectorAll('[data-component="featured-content"]');

    components.forEach(component => {
        // Initialize modals for YouTube videos
        const thumbnails = component.querySelectorAll('[data-video-thumbnail]');
        thumbnails.forEach(thumbnail => {
            const videoId = thumbnail.getAttribute('data-video-id');
            if (videoId) {
                const modalId = `youtube-modal-${videoId}`;
                const modalContent = document.createElement('div');
                modalContent.className = 'su-hidden';
                modalContent.id = modalId;
                modalContent.setAttribute('role', 'dialog');
                modalContent.setAttribute('aria-modal', 'true');
                modalContent.setAttribute('aria-labelledby', `youtube-modal-title-${videoId}`);

                const modalTitle = document.createElement('h2');
                modalTitle.className = 'su-sr-only';
                modalTitle.id = `youtube-modal-title-${videoId}`;
                modalTitle.textContent = 'YouTube Video';

                const embedVideo = document.createElement('div');
                embedVideo.className = 'su-relative su-w-full su-aspect-[16/9]';
                embedVideo.innerHTML = `
                    <iframe
                        class="su-absolute su-inset-0 su-w-full su-h-full"
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                `;

                modalContent.appendChild(modalTitle);
                modalContent.appendChild(embedVideo);
                component.appendChild(modalContent);

                Modal({
                    trigger: thumbnail,
                    content: modalContent,
                    uniqueId: modalId,
                    describedby: 'card-modal'
                });
            }
        });
    });
} 