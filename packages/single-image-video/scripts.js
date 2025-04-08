// Constants
export const VIDEO_PLAYER_SELECTOR = '[data-role="video-player"]';
export const VIDEO_CONTROL_SELECTOR = '[data-role="video-control"]';

document.addEventListener('DOMContentLoaded', function () {
  const videoPlayer = document.querySelector(VIDEO_PLAYER_SELECTOR);
  const videoPlayerControl = document.querySelector(VIDEO_CONTROL_SELECTOR);

  if (!videoPlayer || !videoPlayerControl) return;

  const data = { method: 'pause' };

  videoPlayerControl.addEventListener('click', () => {
    videoPlayer.contentWindow.postMessage(JSON.stringify(data), '*');

    if (data.method === 'pause') {
      data.method = 'play';
      return;
    }

    data.method = 'pause';
  });
});
