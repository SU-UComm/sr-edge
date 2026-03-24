import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

describe('[Fact Callout Component]', () => {
    const defaultMockData = {
        displayConfiguration: {
            icon: 'bar graph',
            factText: 'fact text',
            indicatorPosition: 'top',
            width: 'Wide'
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // General error checking
    describe('[Error Handling]', () => {
       it('Should throw an error when no parameters was provided.', async () => {
            const result = await main();

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "icon" field must be one of ["pie chart", "bar graph"]. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when icon is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    icon: 123,
                }
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "icon" field must be one of ["pie chart", "bar graph"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when icon is not one of ["pie chart", "bar graph"]', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    icon: 'test',
                }
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "icon" field must be one of ["pie chart", "bar graph"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when factText is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    factText: 123,
                }
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "factText" field must be a string type. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when indicatorPosition is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    indicatorPosition: 123,
                }
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "indicatorPosition" field must be one of ["top", "bottom"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when indicatorPosition is not one of ["top", "bottom"]', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    indicatorPosition: 'test',
                }
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "indicatorPosition" field must be one of ["top", "bottom"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when width is not a string', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    width: 123,
                }
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "width" field must be one of ["Wide", "Narrow"]. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when width is not one of ["Wide", "Narrow"]', async () => {
            const mockedData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    width: 'test',
                }
            };
            const result = await main(mockedData);

            expect(result).toBe('<!-- Error occurred in the Fact callout component: The "width" field must be one of ["Wide", "Narrow"]. The "test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
       
    });

    // Check if component renders correct HTML - classes, text, etc.
    describe('[Component Rendering]', () => {
        it('Should render the component with valid data', async () => {
            const result = await main(defaultMockData);

            expect(result).toContain('<section class="fact-wrapper');
            expect(result).toContain('su-container-wide');
            expect(result).toContain('fact text');
        });

        it('Should render correct width class in the output', async () => {
            const result = await main(defaultMockData);

            expect(result).toContain('su-container-wide');
        });

    });
});
