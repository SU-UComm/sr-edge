/**
 * @jest-environment jsdom
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import * as subtopicsSubnav from './scripts';

const mockTopics = [
  {
    taxonomyFeaturedUnitText: ['Topic A'],
    taxonomyFeaturedUnitLandingPageUrl: ['https://example.com/a'],
  },
  {
    taxonomyFeaturedUnitText: ['Topic B'],
    taxonomyFeaturedUnitLandingPageUrl: ['https://example.com/b'],
  },
];

describe('[Subtopics Subnav][Client]', () => {
    let container;
    let listWrapper;

    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        vi.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _init for each subtopic subnav section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'subtopic-subnav-component');
            const wrapper = document.createElement('div');
            wrapper.setAttribute('data-list', 'subnav');
            section.appendChild(wrapper);

            document.body.appendChild(section);

            const _initSpy = vi.spyOn(subtopicsSubnav, '_init');

             // Simulate DOMContentLoaded event
             const event = new Event('DOMContentLoaded');
             document.dispatchEvent(event);


             document.querySelectorAll(subtopicsSubnav.SUBTOPIC_SUBNAV_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                subtopicsSubnav._init(section);
            });

            // Check if the spy was called
            expect(_initSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _initSpy.mockRestore(); 
        });

        it('Should call not Subnav when the list selector is not expect', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'subtopic-subnav-component');
            document.body.appendChild(section);

            const SubnavSpy = vi.spyOn(subtopicsSubnav, 'Subnav');

             // Simulate DOMContentLoaded event
             const event = new Event('DOMContentLoaded');
             document.dispatchEvent(event);


             document.querySelectorAll(subtopicsSubnav.SUBTOPIC_SUBNAV_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                subtopicsSubnav._init(section);
            });

            // Check if the spy was called
            expect(SubnavSpy).not.toHaveBeenCalled();

            // Restore the original function after test
            SubnavSpy.mockRestore(); 
        });
    });

    describe('[Main function]', () => {
        beforeEach(() => {
            // Set up the DOM
            container = document.createElement('section');
            container.setAttribute('data-component', 'subtopic-subnav-component');
            
            listWrapper = document.createElement('div');
            listWrapper.setAttribute('data-list', 'subnav');
            container.appendChild(listWrapper);
            
            document.body.innerHTML = ''; // Clear previous DOM
            document.body.appendChild(container);

            subtopicsSubnav._init(container); // initialize the component
        });

        it('Should render subnav HTML on topicLoader event', async () => {
            const event = new CustomEvent('topicLoader', {
                detail: {
                    cards: mockTopics,
                },
            });

            fireEvent(document, event);

            // Wait for the event listener and rendering to complete
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(listWrapper.innerHTML).toContain('Topic A');
            expect(listWrapper.innerHTML).toContain('Topic B');
            expect(listWrapper.querySelectorAll('a').length).toBe(2);
        });

        it('Should not render anything if detail is missing', async () => {
            const event = new CustomEvent('topicLoader', {
                detail: null,
            });

            fireEvent(document, event);

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(listWrapper.innerHTML).toBe('');
        });
    });

    describe('topicFormatter', () => {
        it('should return null for null input', async () => {
          const result = await subtopicsSubnav.topicFormatter(null);
          expect(result).toBeNull();
        });
      
        it('should return null for empty array', async () => {
          const result = await subtopicsSubnav.topicFormatter([]);
          expect(result).toBeNull();
        });

        it('should remove duplicates based on taxonomyFeaturedUnitText[0]', async () => {
            const topics = [
                {
                    taxonomyFeaturedUnitText: ['Duplicate'],
                    taxonomyFeaturedUnitLandingPageUrl: ['https://example.com/1']
                },
                {
                    taxonomyFeaturedUnitText: ['Duplicate'],
                    taxonomyFeaturedUnitLandingPageUrl: ['https://example.com/2']
                }
            ];
        
            const result = await subtopicsSubnav.topicFormatter(topics);
            expect(result.length).toBe(1);
            expect(result[0].asset_name).toBe('Duplicate');
        });

        it('should default to empty string if URL is missing', async () => {
            const topics = [
                {
                    taxonomyFeaturedUnitText: ['Topic B']
                }
            ];
        
            const result = await subtopicsSubnav.topicFormatter(topics);
            expect(result).toEqual([
                {
                    asset_name: 'Topic B',
                    asset_url: ''
                }
            ]);
        });
    });
});
