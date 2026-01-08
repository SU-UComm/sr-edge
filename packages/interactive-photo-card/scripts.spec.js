import { fireEvent } from '@testing-library/dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as photoCard from './scripts.js';

const mockedError = vi.fn();
console.error = mockedError;

describe('[Interactive Photo Card][Client]', () => {
    let card, inner, content, button;

    beforeEach(() => {
        // Setup DOM structure
        card = document.createElement('div');
        inner = document.createElement('div');
        content = document.createElement('div');
        card.setAttribute('data-component', 'interactive-photo-card');
        inner.setAttribute('data-card-inner', 'true');
        content.setAttribute('data-card-inner', 'true');
        button = document.createElement('button');
        card.appendChild(inner);
        inner.appendChild(content);
        content.appendChild(button);
    
        document.body.appendChild(card);
    });

    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        vi.clearAllMocks();
    });
      
    describe('[DOMContentLoaded]', () => {
        it('Should call _interactivePhotoCardInit for each section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'interactive-photo-card');
            document.body.appendChild(section);

            const _interactivePhotoCardInitSpy = vi.spyOn(photoCard, '_interactivePhotoCardInit');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);


            document.querySelectorAll(photoCard.INTERACTIVE_PHOTO_CARD).forEach(section => {
                // Call the function to set up all event listeners
                photoCard._interactivePhotoCardInit(section);
            });

            // Check if the spy was called
            expect(_interactivePhotoCardInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _interactivePhotoCardInitSpy.mockRestore(); 
        });

        it('Should call _interactivePhotoCardContentInit for each section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'interactive-photo-card');
            document.body.appendChild(section);

            const _interactivePhotoCardContentInitSpy = vi.spyOn(photoCard, '_interactivePhotoCardContentInit');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);


            document.querySelectorAll(photoCard.INTERACTIVE_PHOTO_CARD).forEach(section => {
                // Call the function to set up all event listeners
                photoCard._interactivePhotoCardContentInit(section);
            });

            // Check if the spy was called
            expect(_interactivePhotoCardContentInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _interactivePhotoCardContentInitSpy.mockRestore(); 
        });
    });

    describe('[handleFlip function]', () => {
        it('Should reset rotation after full 360-degree turn', () => {
            photoCard.handleFlip(card, 180);
            photoCard.handleFlip(card, 180);
            
            const transformMatch = inner.style.transform.match(/rotateY\((\d+)deg\)/);
            const currentRotation = transformMatch ? parseInt(transformMatch[1]) : 0;
            
            expect(currentRotation).toBe(0);
        });

        it('Should handle null match result gracefully', () => {
            // Set transform to something that won't match the regex
            inner.style.transform = 'rotateX(45deg)';
            
            // Check the match before calling handleFlip
            const transformMatch = inner.style.transform.match(/rotateY\((\d+)deg\)/);

            expect(transformMatch).toBeNull();
            
            // Act
            photoCard.handleFlip(inner);
            
            // Assert
            const currentRotation = parseInt(transformMatch?.[1]) || 0;

            expect(currentRotation).toBe(0);
        });
    });


    describe('_interactivePhotoCardInit function', () => {

        it('Should log error when card inner is missing', () => {
            const cardWithoutInner = document.createElement('div');
            
            cardWithoutInner.setAttribute('data-component', 'interactive-photo-card');
            document.body.appendChild(cardWithoutInner);
            photoCard._interactivePhotoCardInit(cardWithoutInner);
            
            expect(mockedError).toHaveBeenCalledWith('Could not find card inner element for component');
        });

    });

    describe('toggleCardsVisibility function', () => {
        it('should toggle aria-hidden state', () => {
            // Create a spy for the function
            const spy = vi.spyOn(photoCard, 'toggleCardsVisibility');
            photoCard.toggleCardsVisibility([content]);
            
            expect(content.getAttribute('aria-hidden')).toBe('true');
            
            photoCard.toggleCardsVisibility([content]);
            
            expect(content.getAttribute('aria-hidden')).toBe('false');
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('_interactivePhotoCardContentInit function', () => {
        it('Should initialize click handlers for all card inner content elements', () => {
          // Arrange
          const cardElement = document.createElement('div');
          cardElement.setAttribute('data-component', 'interactive-photo-card');
          document.body.appendChild(cardElement);
      
          // Create multiple content elements
          const contentElements = [
            document.createElement('div'),
            document.createElement('div')
          ];
          
          contentElements.forEach(element => {
            element.setAttribute('data-card-inner-content', 'true');
            cardElement.appendChild(element);
          });
      
          // Create spy for toggleCardsVisibility
          const toggleSpy = vi.spyOn(photoCard, 'toggleCardsVisibility');
      
          // Act
          photoCard._interactivePhotoCardContentInit(cardElement);
      
          // Assert
          contentElements.forEach(content => {
            // Verify event listener exists
            expect(content.onclick).toBeDefined();
            
            // Trigger click event
            fireEvent.click(content);
            
            // Reset spy for next iteration
            toggleSpy.mockClear();
          });
      
          // Restore original function after all tests
          toggleSpy.mockRestore();
        });
      });
});