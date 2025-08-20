import { describe, it, expect, vi, beforeEach } from "vitest";
import { cardDataAdapter, funnelbackCardService, linkedHeadingService, uuid, formatNewsDate, isRealExternalLink } from "../../global/js/utils";
import { Card } from "../../global/js/helpers";
import component from "./main.js";

// Mock dependencies
vi.mock("../../global/js/utils", () => ({
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                uniqueID: "mock-id-1",
                type: "News",
                title: "Test Article 1",
                description: "Test description 1",
                date: "2024-01-01",
                liveUrl: "https://example.com/article1",
                imageUrl: "https://example.com/image1.jpg",
                imageAlt: "Test image 1",
                taxonomy: "Research",
                taxonomyUrl: "https://example.com/research",
                videoUrl: null
            },
            {
                uniqueID: "mock-id-2",
                type: "Video",
                title: "Test Video 1",
                description: "Test video description",
                date: "2024-01-02",
                liveUrl: "https://example.com/video1",
                imageUrl: "https://example.com/video1.jpg",
                imageAlt: "Test video 1",
                taxonomy: "Innovation",
                taxonomyUrl: "https://example.com/innovation",
                videoUrl: "abc123",
                size: "vertical-video"
            },
            {
                uniqueID: "mock-id-3",
                type: "Feature",
                title: "Test Feature 1",
                description: "Test feature description",
                date: "2024-01-03",
                liveUrl: "https://example.com/feature1",
                imageUrl: "https://example.com/feature1.jpg",
                imageAlt: "Test feature 1",
                taxonomy: "Stories",
                taxonomyUrl: "https://example.com/stories",
                videoUrl: null
            }
        ])
    })),
    funnelbackCardService: vi.fn(),
    linkedHeadingService: vi.fn().mockResolvedValue({
        title: "Mock Heading",
        ctaLink: "https://example.com",
        ctaNewWindow: false,
        ctaText: "View All"
    }),
    uuid: vi.fn().mockReturnValue("mock-uuid"),
    formatNewsDate: vi.fn().mockImplementation(date => `Formatted: ${date}`),
    isRealExternalLink: vi.fn().mockImplementation(url => url?.includes('external')),
    processEditor: vi.fn().mockImplementation(template => template)
}));

vi.mock("../../global/js/helpers", () => ({
    Card: vi.fn().mockImplementation((data, options) => 
        `<article class="mock-vertical-card" data-type="${data.type}" data-title="${data.title}">${data.title}</article>`
    )
}));

vi.mock("xss", () => ({
    default: vi.fn().mockImplementation(str => `sanitized:${str}`)
}));

vi.mock("./search-cards.hbs", () => ({
    default: vi.fn().mockImplementation(data => 
        `<section data-component="search-cards">${data.searchCardsGrid || 'no cards'}</section>`
    )
}));

describe("Search Cards Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Basic functionality", () => {
        it("should render successfully with valid input", async () => {
            const args = {
                headingConfiguration: {
                    title: "Test Heading",
                    ctaText: "View All"
                },
                contentConfiguration: {
                    cards: [
                        { id: "171710" },
                        { id: "174814" }
                    ]
                },
                displayConfiguration: {
                    searchQuery: "?profile=stanford-report-push-search&collection=sug~sp-stanford-report-search&sort=date&log=false"
                }
            };

            const info = {
                env: {
                    FB_JSON_URL: "https://test-funnelback.com"
                },
                fns: {
                    resolveUri: vi.fn()
                },
                ctx: {
                    editor: false
                }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('data-component="search-cards"');
            expect(result).toContain('mock-vertical-card');
            expect(funnelbackCardService).toHaveBeenCalled();
            expect(linkedHeadingService).toHaveBeenCalled();
        });

        it("should handle edit mode with default values", async () => {
            const args = {};
            const info = {
                env: {
                    FB_JSON_URL: "https://test-funnelback.com"
                },
                ctx: {
                    editor: true
                }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('data-component="search-cards"');
        });
    });

    describe("Error handling", () => {
        it("should return error for missing cards in non-edit mode", async () => {
            const args = {
                contentConfiguration: {
                    cards: []
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: {
                    FB_JSON_URL: "https://test-funnelback.com"
                },
                ctx: {
                    editor: false
                }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('<!-- Error occurred in the Search Cards component:');
        });

        it("should return error for missing search query in non-edit mode", async () => {
            const args = {
                contentConfiguration: {
                    cards: [{ id: "test" }]
                },
                displayConfiguration: {
                    searchQuery: ""
                }
            };

            const info = {
                env: {
                    FB_JSON_URL: "https://test-funnelback.com"
                },
                ctx: {
                    editor: false
                }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('<!-- Error occurred in the Search Cards component:');
        });

        it("should handle funnelback service errors gracefully", async () => {
            const mockError = new Error("Funnelback service error");
            vi.mocked(funnelbackCardService).mockRejectedValueOnce(mockError);

            const args = {
                contentConfiguration: {
                    cards: [{ id: "test" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: {
                    FB_JSON_URL: "https://test-funnelback.com"
                },
                ctx: {
                    editor: false
                }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('<!-- Error occurred in the Search Cards component:');
            expect(result).toContain('Funnelback service error');
        });
    });

    describe("Card grid functionality", () => {
        it("should generate proper grid layout for 2 cards", async () => {
            const mockCards = [
                {
                    uniqueID: "card-1",
                    type: "News",
                    title: "Test Card 1",
                    description: "Description 1",
                    date: "2024-01-01",
                    liveUrl: "https://example.com/1",
                    imageUrl: "https://example.com/image1.jpg",
                    imageAlt: "Image 1",
                    taxonomy: "Research",
                    taxonomyUrl: "https://example.com/research",
                    videoUrl: null
                },
                {
                    uniqueID: "card-2",
                    type: "Feature",
                    title: "Test Card 2",
                    description: "Description 2",
                    date: "2024-01-02",
                    liveUrl: "https://example.com/2",
                    imageUrl: "https://example.com/image2.jpg",
                    imageAlt: "Image 2",
                    taxonomy: "Innovation",
                    taxonomyUrl: "https://example.com/innovation",
                    videoUrl: null
                }
            ];

            // Mock the adapter to return our test cards
            vi.mocked(cardDataAdapter).mockImplementation(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(mockCards)
            }));

            const args = {
                contentConfiguration: {
                    cards: [{ id: "1" }, { id: "2" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('su-basis-1/2');
            expect(result).toContain('data-controller-subscribe="stanford-search"');
            expect(result).toContain('data-test="search-card-0"');
            expect(result).toContain('data-test="search-card-1"');
            expect(Card).toHaveBeenCalledTimes(2);
        });

        it("should generate proper grid layout for 3 cards", async () => {
            const args = {
                contentConfiguration: {
                    cards: [{ id: "1" }, { id: "2" }, { id: "3" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('su-basis-1/3');
            expect(result).toContain('data-test="search-card-2"');
            expect(Card).toHaveBeenCalledTimes(3);
        });

        it("should limit cards to maximum of 3", async () => {
            const args = {
                contentConfiguration: {
                    cards: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            const result = await component.main(args, info);
            
            expect(Card).toHaveBeenCalledTimes(3);
            expect(result).toContain('data-test="search-card-2"');
            expect(result).not.toContain('data-test="search-card-3"');
        });
    });

    describe("Card data processing", () => {
        it("should properly sanitize and format card data", async () => {
            const args = {
                contentConfiguration: {
                    cards: [{ id: "test" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            await component.main(args, info);
            
            expect(Card).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "sanitized:Test Article 1",
                    description: "sanitized:Test description 1",
                    date: "Formatted: 2024-01-01",
                    taxonomy: "sanitized:Research"
                }),
                expect.objectContaining({
                    size: "small",
                    showExcerpt: true,
                    showImage: true,
                    showDate: true,
                    showTaxonomy: true,
                    orientation: "vertical"
                })
            );
        });

        it("should handle video cards with modal data", async () => {
            const mockVideoCard = {
                uniqueID: "video-card",
                type: "Video",
                title: "Test Video",
                description: "Video description",
                date: "2024-01-01",
                liveUrl: "https://example.com/video",
                imageUrl: "https://example.com/video.jpg",
                imageAlt: "Video thumbnail",
                taxonomy: "Media",
                taxonomyUrl: "https://example.com/media",
                videoUrl: "abc123",
                size: "vertical-video"
            };

            vi.mocked(cardDataAdapter).mockImplementation(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([mockVideoCard])
            }));

            const args = {
                contentConfiguration: {
                    cards: [{ id: "video" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            const result = await component.main(args, info);
            
            expect(result).toContain('mock-vertical-card');
            expect(Card).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Video",
                    videoUrl: "abc123"
                }),
                expect.any(Object)
            );
        });

        it("should handle external links correctly", async () => {
            const mockExternalCard = {
                uniqueID: "external-card",
                type: "News",
                title: "External Article",
                description: "External description",
                date: "2024-01-01",
                liveUrl: "https://external.com/article",
                imageUrl: "https://external.com/image.jpg",
                imageAlt: "External image",
                taxonomy: "External",
                taxonomyUrl: "https://external.com/category",
                videoUrl: null
            };

            vi.mocked(cardDataAdapter).mockImplementation(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([mockExternalCard])
            }));

            vi.mocked(isRealExternalLink).mockReturnValue(true);

            const args = {
                contentConfiguration: {
                    cards: [{ id: "external" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            await component.main(args, info);
            
            expect(Card).toHaveBeenCalledWith(
                expect.objectContaining({
                    isRealExternalLink: true,
                    liveUrl: "https://external.com/article"
                }),
                expect.any(Object)
            );
        });
    });

    describe("Service integration", () => {
        it("should call cardDataAdapter with correct configuration", async () => {
            const args = {
                contentConfiguration: {
                    cards: [{ id: "test" }]
                },
                displayConfiguration: {
                    searchQuery: "?profile=test&collection=test"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            await component.main(args, info);
            
            expect(cardDataAdapter).toHaveBeenCalled();
            const adapterInstance = vi.mocked(cardDataAdapter).mock.results[0].value;
            expect(adapterInstance.setCardService).toHaveBeenCalledWith(funnelbackCardService);
            expect(adapterInstance.getCards).toHaveBeenCalledWith(["test"]);
        });

        it("should call linkedHeadingService with heading configuration", async () => {
            const headingConfig = {
                title: "Custom Title",
                ctaText: "Custom CTA",
                ctaLink: "https://custom.com"
            };

            const args = {
                headingConfiguration: headingConfig,
                contentConfiguration: {
                    cards: [{ id: "test" }]
                },
                displayConfiguration: {
                    searchQuery: "valid-query"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://test-funnelback.com" },
                ctx: { editor: false }
            };

            await component.main(args, info);
            
            expect(linkedHeadingService).toHaveBeenCalledWith(headingConfig);
        });

        it("should configure funnelbackCardService with correct URL and query", async () => {
            const args = {
                contentConfiguration: {
                    cards: [{ id: "test" }]
                },
                displayConfiguration: {
                    searchQuery: "?profile=custom&collection=custom"
                }
            };

            const info = {
                env: { FB_JSON_URL: "https://custom-funnelback.com" },
                ctx: { editor: false }
            };

            await component.main(args, info);
            
            expect(funnelbackCardService).toHaveBeenCalledWith(
                "https://custom-funnelback.com?profile=custom&collection=custom"
            );
        });
    });
});
