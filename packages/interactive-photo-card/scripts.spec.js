import { fireEvent } from '@testing-library/dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as photoCard from './scripts.js';

// Helper function to create test card elements
function createTestCard() {
    const card = document.createElement('div');
    card.setAttribute('data-component', 'interactive-photo-card');
    const inner = document.createElement('div');
    inner.setAttribute('data-card-inner', '');
    const content = document.createElement('div');
    content.setAttribute('data-card-inner-content', '');
    const button = document.createElement('button');
    content.appendChild(button);
    inner.appendChild(content);
    card.appendChild(inner);
    document.body.appendChild(card);
    return { card, inner, content, button };
}

describe('Interactive Photo Card Tests', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Constants tests
    describe('Constants', () => {
        it('should export correct selectors', () => {
            expect(photoCard.INTERACTIVE_PHOTO_CARD).toBe('[data-component="interactive-photo-card"]');
            expect(photoCard.CARD_INNER).toBe('[data-card-inner]');
            expect(photoCard.CARD_INNER_CONTENT).toBe('[data-card-inner-content]');
        });
    });

    describe('handleFlip function', () => {
        it('should reset rotation after full 360-degree turn', () => {
            const { inner } = createTestCard();
            photoCard.handleFlip(inner);
            photoCard.handleFlip(inner);
            const transformMatch = inner.style.transform.match(/rotateY\((\d+)deg\)/);
            const currentRotation = transformMatch ? parseInt(transformMatch[1]) : 0;
            expect(currentRotation).toBe(0);
        });

        it('should handle null match result gracefully', () => {
            const { inner } = createTestCard();
            inner.style.transform = 'rotateX(45deg)';
            photoCard.handleFlip(inner);
            expect(inner.style.transform).toBe('rotateY(180deg)');
        });
    });

    describe('toggleCardsVisibility function', () => {
      it('should toggle aria-hidden state', () => {
          const { content, button } = createTestCard();
          // Create a spy for the function
          const spy = vi.spyOn(photoCard, 'toggleCardsVisibility');
          photoCard.toggleCardsVisibility([content]);
          
          expect(content.getAttribute('aria-hidden')).toBe('true');
          expect(button.getAttribute('aria-hidden')).toBe('true');
          
          photoCard.toggleCardsVisibility([content]);
          
          expect(content.getAttribute('aria-hidden')).toBe('false');
          expect(button.getAttribute('aria-hidden')).toBe('false');
          expect(spy).toHaveBeenCalled();
      });
  });

  describe('initInteractivePhotoCardContent function', () => {
      it('should initialize click handlers for card content', () => {
          const { card } = createTestCard();
          const content = card.querySelector('[data-card-inner-content]');
          const addEventListenerSpy = vi.spyOn(content, 'addEventListener');
          photoCard.initInteractivePhotoCardContent(card);
          
          expect(addEventListenerSpy).toHaveBeenCalled();
          expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      });

      it('should handle empty NodeList gracefully', () => {
        const card = document.createElement('div');
        card.setAttribute('data-component', 'interactive-photo-card');
        document.body.appendChild(card);
        
        photoCard.initInteractivePhotoCardContent(card);
        // Assert that no error was thrown
        expect(() => photoCard.initInteractivePhotoCardContent(card)).not.toThrow();
        
        // Verify DOM wasn't modified
        expect(card.children.length).toBe(0);
    });
  });

    describe('initInteractivePhotoCard function', () => {
        it('should initialize event listener successfully', () => {
            const { card, inner } = createTestCard();
            photoCard.initInteractivePhotoCard(card);
            fireEvent.click(inner);
            const transformMatch = inner.style.transform.match(/rotateY\((\d+)deg\)/);
            const currentRotation = transformMatch ? parseInt(transformMatch[1]) : 0;
            expect(currentRotation).toBe(180);
        });

        it('should log error when card inner is missing', () => {
            vi.spyOn(console, 'error');
            const cardWithoutInner = document.createElement('div');
            cardWithoutInner.setAttribute('data-component', 'interactive-photo-card');
            document.body.appendChild(cardWithoutInner);
            photoCard.initInteractivePhotoCard(cardWithoutInner);
            expect(console.error).toHaveBeenCalledWith('Could not find card inner element for component');
        });
    });

    describe('DOM Content Loaded Initialization', () => {
        it('should initialize all photo cards when DOM is loaded', () => {
            const cardCount = 3;
            Array.from({ length: cardCount }).forEach(() => {
                createTestCard();
            });
            document.dispatchEvent(new Event('DOMContentLoaded'));
            const cards = document.querySelectorAll(photoCard.INTERACTIVE_PHOTO_CARD);
            expect(cards.length).toBe(cardCount);
            
            cards.forEach(card => {
                fireEvent.click(card.querySelector(photoCard.CARD_INNER));
                const currentRotation = parseInt(
                    card.querySelector(photoCard.CARD_INNER).style.transform.match(/rotateY\((\d+)deg\)/)?.[1]
                );
                expect(currentRotation).toBe(180);
            });
        });
    });
});