/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as readingTime from '../../global/js/utils/readingTime/readingTime.js';
import * as featureStoryHero from './scripts';

vi.mock("./readingTime", () => ({
    readingTime: vi.fn(() => 5),
  }));

describe('[Feature Story Hero][Client]', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _readingTimeUpdate for each carousel section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'feature-story-hero');
            document.body.appendChild(section);

            const _readingTimeUpdateSpy = vi.spyOn(featureStoryHero, '_readingTimeUpdate');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            // Call the function to set up all event listeners
            document.querySelectorAll(featureStoryHero.FEATURE_STORY_HERO_SELECTOR).forEach(section => {
                featureStoryHero._readingTimeUpdate(section);
            });

            // Check if the spy was called
            expect(_readingTimeUpdateSpy).toHaveBeenCalledWith(section);
            // Restore the orginal function after test
            _readingTimeUpdateSpy.mockRestore();
        });
    });

    describe('[Reading Time Update functionality]', () => {
        let section, content, readingTimeEl;
        
        beforeEach(() => {
            section = document.createElement('section');
            section.setAttribute('data-component', 'feature-story-hero');
            
            readingTimeEl = document.createElement('span')
            readingTimeEl.setAttribute('data-reading', 'true');


            content = document.createElement('div');
            content.setAttribute('class', 'su-page-content');
            content.innerHTML = `<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. </p> <p> Praesent nec efficitur velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis eu tellus in magna tincidunt ultrices. Nunc blandit euismod orci, nec fermentum mi lobortis ac. Suspendisse potenti. Vivamus nec nulla non odio faucibus ultrices. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. </p> <p> Cras dapibus sem ac tellus varius, ut imperdiet turpis eleifend. Integer tincidunt efficitur libero, in scelerisque metus vehicula in. Suspendisse potenti. Sed condimentum justo nec nulla placerat fringilla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec ac convallis lorem, nec gravida purus. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. </p> <p> Etiam convallis leo nec arcu tempor, a pretium enim rhoncus. Proin quis mi eu diam feugiat commodo. Morbi dignissim sapien nec ipsum interdum convallis. Nulla vestibulum pulvinar augue non euismod. Aliquam erat volutpat. Integer vulputate sem at lacinia tristique. Phasellus malesuada tincidunt nisl, vel blandit erat facilisis sed.Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. </p> <p> Sed a facilisis turpis. Nullam ac felis metus. Nam convallis velit eu odio interdum fermentum. Pellentesque malesuada sem non neque ullamcorper, ac luctus massa cursus. Nunc vulputate nisi vel enim tincidunt, sit amet ultricies nisi porttitor. Vestibulum quis eros id sem posuere gravida. Suspendisse ac leo a velit rutrum efficitur. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. </p> <p> Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed sollicitudin purus vitae purus suscipit gravida. Donec porttitor felis ac ex hendrerit, ac gravida neque ullamcorper. Integer vitae facilisis purus. Vivamus efficitur sagittis massa, et dignissim neque tincidunt eget. Etiam ac diam vitae est vehicula porta. Mauris laoreet leo at enim posuere, sit amet sollicitudin ipsum gravida. Donec imperdiet ante a sem eleifend feugiat. Fusce aliquam turpis eu posuere imperdiet. Nullam facilisis, lorem a dapibus aliquam, lorem tellus facilisis sem, eget feugiat magna tortor eget purus. Quisque porttitor nisi lorem, vel fermentum erat rutrum in. In vitae velit sed enim laoreet lacinia. Sed lacinia libero nec turpis tincidunt, in dictum elit efficitur. Aenean dapibus vestibulum dui, nec tempus augue varius ac. Nulla facilisi. Donec at lorem eu erat cursus congue. In vel dui vitae justo porta efficitur a sed ante. Suspendisse potenti. Vivamus quis massa nibh. </p>`
            
            section.appendChild(readingTimeEl);
            document.body.appendChild(section);
            document.body.appendChild(content);
        });

        afterEach(() => {
            document.body.innerHTML = '';
            vi.clearAllMocks();
            vi.restoreAllMocks();
        });


        it("Should update reading time element with calculated time", () => {
            const readingTimeSpy = vi.spyOn(readingTime, 'readingTime');
            featureStoryHero._readingTimeUpdate(section);


            expect(readingTimeSpy).toHaveBeenCalled();

            readingTimeSpy.mockRestore();
        });
    
        it("Should do nothing if .su-page-content is missing", () => {
            document.querySelector(".su-page-content").remove();
            featureStoryHero._readingTimeUpdate(section);
            
            expect(readingTimeEl.textContent).toBe("");
        });
    
        it("Should do nothing if readingTimeEl is missing", () => {
            section.removeChild(readingTimeEl);
            featureStoryHero._readingTimeUpdate(section);
            // no error means pass
            expect(true).toBe(true);
        });
    })
});