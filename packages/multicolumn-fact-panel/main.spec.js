/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
  containerClasses: vi.fn().mockReturnValue('su-container-class')
}));

describe('[Multicolumn Fact Panel]', () => {
    const defaultMockData = {
        title: "Sample Title",
        eyebrow: "Sample Eyebrow",
        facts: [
            {
                icon: "heart",
                iconSet: "regular",
                content: "<p>Fact 1</p>"
            },
            {
                icon: "calculator",
                iconSet: "solid",
                content: "<p>Fact 2</p>"
            }
        ],
        paddingY: "6"
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when title is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                title: [1,2,3]
            };
            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Fact Panel component: The "title" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when eyebrow is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                eyebrow: [1,2,3]
            };
            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Fact Panel component: The "eyebrow" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when facts is not an array', async () => {
            const mockData = {
                ...defaultMockData,
                facts: "not an array"
            };
            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Fact Panel component: The "facts" field must be an array. The "not an array" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when paddingY is not a string', async () => {
            const mockData = {
                ...defaultMockData,
                paddingY: [1,2,3]
            };
            const result = await main(mockData);
            
            expect(result).toContain('<!-- Error occurred in the Multicolumn Fact Panel component: The "paddingY" field must be a string. The [1,2,3] was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Rendering]', () => {
        it('Should render the component with all fields', async () => {
            const result = await main(defaultMockData);
            
            expect(result).toContain(`data-component='multicolumn-fact-panel'`);
            expect(result).toContain('Sample Title');
            expect(result).toContain('Sample Eyebrow');
            expect(result).toContain('Fact 1');
            expect(result).toContain('Fact 2');
            expect(result).toContain('fa-heart');
            expect(result).toContain('fa-calculator');
        });

        it('Should render without optional fields', async () => {
            const result = await main({
                facts: defaultMockData.facts
            });
            
            expect(result).toContain(`data-component='multicolumn-fact-panel'`);
            expect(result).not.toContain('Sample Title');
            expect(result).not.toContain('Sample Eyebrow');
            expect(result).toContain('Fact 1');
            expect(result).toContain('Fact 2');
        });
    });
});
