import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

// Mock fetch globally
vi.stubGlobal('fetch', vi.fn());

describe('[Subtopics Subnav Component]', () => {
    const mockFnsCtx = { resolveUri: vi.fn(), assetId: '141667' };
    
    const defaultMockData = {
        title: "Stories for you",
        parent: {
            url: 'https://example.com',
            title: "Example Title",
        },
        isTopLevel: true
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://funnelback.example.com/json',
            API_IDENTIFIER: 'sample-api',
            BASE_DOMAIN: 'https://news.stanford.edu/',
        },
        ctx: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when title is not a string', async () => {
            const mockData = { ...defaultMockData, title: 123 };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Subtopics Subnav component:',
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
            // Mock the fetch response
            const mockSubnavData = {
                title: "Stories for you",
                parent: {
                    url: 'https://example.com',
                    title: "Example Title",
                },
                isTopLevel: true,
                topicId: '141667',
                children: [
                    {
                        asset_name: "Child Topic 1",
                        asset_url: "https://example.com/child1"
                    },
                    {
                        asset_name: "Child Topic 2", 
                        asset_url: "https://example.com/child2"
                    }
                ]
            };

            // Configure the mocked fetch
            fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockSubnavData)
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain("data-component='subtopic-subnav-component'");
            expect(result).toContain("data-list='subnav'");
            expect(fetch).toHaveBeenCalledWith('https://news.stanford.edu/_api/mx/subtopicsubnav?edge=true&topic=141667&gfbg=gbg');
        });  

        it('Should not render expected HTML with args not provided', async () => {
            const result = await main();

            expect(result).toContain('<!-- Error occurred in the Subtopics Subnav component');
        }); 

        it('Should not render expected HTML with empty data', async () => {
            const result = await main({}, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Subtopics Subnav component');
        });                            
    });
});