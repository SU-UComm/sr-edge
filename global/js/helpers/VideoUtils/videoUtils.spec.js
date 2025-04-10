/**
 * @jest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as videoUtils from './videoUtils.js'; 

describe('[Video helper: postMessageToVimeo]', () => {
  it('Should post a message to the iframe with correct command', () => {
    const mockPostMessage = vi.fn();
    const iframe = document.createElement('iframe');

    Object.defineProperty(iframe, 'contentWindow', {
      writable: true,
      value: { postMessage: mockPostMessage },
    });

    videoUtils.postMessageToVimeo(iframe, 'play');

    expect(mockPostMessage).toHaveBeenCalledWith(
      JSON.stringify({ method: 'play' }),
      '*'
    );
  });
});

describe('[Video helper: setControlLabel]', () => {
  let button, playIcon, pauseIcon;

  beforeEach(() => {
    button = document.createElement('button');
    playIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pauseIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    playIcon.setAttribute('data-control', 'play');
    pauseIcon.setAttribute('data-control', 'pause');

    button.appendChild(playIcon);
    button.appendChild(pauseIcon);

    button.setAttribute('data-label-play', 'Play video');
    button.setAttribute('data-label-pause', 'Pause video');
    document.body.appendChild(button);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Should set pause state correctly when playing', () => {
    videoUtils.setControlLabel(button, false);

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(playIcon.classList.contains('su-hidden')).toBe(true);
    expect(playIcon.hidden).toBe(true);
    expect(pauseIcon.classList.contains('su-hidden')).toBe(false);
    expect(pauseIcon.hidden).toBe(false);
    expect(button.innerHTML).toContain('Pause video');
  });

  it('Should set play state correctly when paused', () => {
    videoUtils.setControlLabel(button, true);

    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(playIcon.classList.contains('su-hidden')).toBe(false);
    expect(playIcon.hidden).toBe(false);
    expect(pauseIcon.classList.contains('su-hidden')).toBe(true);
    expect(pauseIcon.hidden).toBe(true);
    expect(button.innerHTML).toContain('Play video');
  });
});
