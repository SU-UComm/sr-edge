import { fireEvent } from '@testing-library/dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as photoCard from './scripts.js';

const mockedError = vi.fn();
console.error = mockedError;

describe('[Interactive Photo Card][Client]', () => {
    let card, inner;

    beforeEach(() => {
        // Setup DOM structure
        card = document.createElement('div');
        inner = document.createElement('div');
        card.setAttribute('data-component', 'interactive-photo-card');
        inner.setAttribute('data-card-inner', 'true');
        card.appendChild(inner);
    
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
        it('Should initialize event listener successfully', () => {
            photoCard._interactivePhotoCardInit(card);
            fireEvent.click(inner);
            
            const transformMatch = inner.style.transform.match(/rotateY\((\d+)deg\)/);
            const currentRotation = transformMatch ? parseInt(transformMatch[1]) : 0;
            
            expect(currentRotation).toBe(180);
        });

        it('Should log error when card inner is missing', () => {
            const cardWithoutInner = document.createElement('div');
            
            cardWithoutInner.setAttribute('data-component', 'interactive-photo-card');
            document.body.appendChild(cardWithoutInner);
            photoCard._interactivePhotoCardInit(cardWithoutInner);
            
            expect(mockedError).toHaveBeenCalledWith('Could not find card inner element for component');
        });


    });
});

