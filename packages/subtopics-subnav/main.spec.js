import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

describe('[Subtopics Subnav Component]', () => {
    const defaultMockData = {
        title: "Stories for you",
        parent: {
            url: 'https://example.com',
            title: "Example Title",
        },
        isTopLevel: true
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when title is not a string', async () => {
            const mockData = { ...defaultMockData, title: 123 };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Subtopics Subnav component: The "title" field must be a string. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when parent is not an object', async () => {
            const mockData = { ...defaultMockData, parent: 123 };
            const result = await main(mockData);
            
            expect(result).toBe(
                '<!-- Error occurred in the Subtopics Subnav component: The "parent" field must be an object. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when isTopLevel was not a boolean', async () => {
            const mockData = { ...defaultMockData, isTopLevel: 123 };
            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Subtopics Subnav component: The "isTopLevel" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
      
    });

    describe('[Main Function]', () => {  
        it('Should render expected HTML with proper data', async () => {
            const result = await main(defaultMockData);

            expect(result).toMatchInlineSnapshot(`"<section data-component='subtopic-subnav-component'><div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='listing__header'><h1 class='su-text-black su-font-bold su-font-serif dark:su-text-white su-text-center su-text-[39px] md:su-text-[54px] lg:su-text-[70px] su-leading-[46.57px] md:su-leading-[64.8px] lg:su-leading-[84px] su-mb-0' >Stories for you</h1><div data-list='subnav'></div></div></div></section>"`);
        });  

        it('Should render expected HTML with args not provided', async () => {
            const result = await main();

            expect(result).toMatchInlineSnapshot(`"<section data-component='subtopic-subnav-component'><div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='listing__header'><div data-list='subnav'></div></div></div></section>"`);
        }); 

        it('Should render expected HTML with empty data', async () => {
            const result = await main({});

            expect(result).toMatchInlineSnapshot(`"<section data-component='subtopic-subnav-component'><div class='su-mx-auto su-component-container su-container-large su-container-px'><div class='listing__header'><div data-list='subnav'></div></div></div></section>"`);
        });                            
    });
});