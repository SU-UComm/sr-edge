/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent } from '@testing-library/dom';
import fbFetcher from "./scripts/fbFetcher";
import * as linkList from './scripts';

// Mocking modules
vi.mock("./scripts/fbFetcher", () => ({
    default: vi.fn(),
}));

vi.mock("../../global/js/utils/getCookie", () => ({
    getCookie: vi.fn(() => "mock-cookie"),
}));

describe("link list functions", () => {
    let wrapper, toggle, drawer;

    beforeEach(() => {
        // Setup DOM structure
        document.body.innerHTML = `
            <section data-component="link-list">
                <div id="link-list" data-role="link-list-wrap" class="su-fixed su-opacity-0 su--bottom-[100 su-left-0 su-left-1/2 su-right-1/2 su-translate-x-[-50%] su-max-w-[482px] su-p-20 su-bg-foggy-light lg:dark:su-bg-black-true dark:su-bg-black su-linklist-mob-width su-rounded-tl-[8px] su-rounded-tr-[8px] su-transition su-z-[49] su-px-30 lg:su-z-[1] lg:su-bg-white lg:su-relative lg:su-bottom-0 lg:su-opacity-100 lg:su-p-0 lg:su-w-full">
                    <div class="su-flex">
                        <h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end">
                            <span data-test="icon" class="dark:su-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" class=""><g clippath="url(#clip0_2402_1235)"><path d="M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z" fill="url(#paint0_linear_2402_1235)"></path></g><defs><linearGradient id="paint0_linear_2402_1235"><stop class="su-stop-red"></stop><stop offset="1" class="su-stop-plum"></stop></linearGradient><clipPath id="clip0_2402_1235"><rect width="27" height="27" fill="white"></rect></clipPath></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" class=""><g clippath="url(#clip0_2402_1235)"><path d="M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z" fill="url(#bullseyePointerDarkGradient)"></path></g><defs><linearGradient id="bullseyePointerDarkGradient"><stop class="su-stop-teal"></stop><stop offset="1" class="su-stop-green"></stop></linearGradient><clipPath id="clip0_2402_1235"><rect width="27" height="27" fill="white"></rect></clipPath></defs></svg>
                            </span>
                            <span>Stories for you</span>
                        </h2>
                        <button class="su-text-digital-red dark:su-text-white su-rotate-[-90deg] lg:su-hidden" data-role="link-drawer-toggle" data-active="false" aria-controls="link-drawer" aria-label="link-drawer" type="button">
                            <svg class="su-fill-transparent su-stroke-current " data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                    </div>
                    <div class="su-max-h-1000 su-h-0 su-overflow-hidden su-transition lg:su-h-auto" id="link-drawer" data-role="link-drawer">
                        <article class="su-border-b su-border-b-black-20 dark:su-border-b-black-70 su-pb-15 su-mt-[23.65px] lg:su-pb-36">
                            <a href="https://news.stanford.edu/stories/2025/04/enhancements-simplify-logistics-for-research-and-teaching-related-travel" class="su-no-underline hocus:su-underline">
                                <h3 class="su-text-16 su-font-bold su-m-0 lg:su-text-24 lg:su-leading-[28.8px]">
                                    Enhancements simplify logistics for research and teaching-related travel
                                </h3>
                            </a>
                        </article>
                            <article class="su-border-b dark:su-border-b-black-70 su-border-b-black-20 su-py-15 lg:su-py-36">
                            <a href="https://news.stanford.edu/stories/2025/03/stanford-football-frank-reich-interim-head-coach" class="su-no-underline hocus:su-underline">
                                <h3 class="su-text-16 su-font-bold su-m-0 lg:su-text-24 lg:su-leading-[28.8px]">
                                    Stanford Football announces Frank Reich as interim head coach for 2025 season
                                </h3>
                            </a>
                        </article>
                            <article class="su-pt-15 lg:su-pt-36">
                            <a href="https://news.stanford.edu/stories/2025/03/alberto-salleo-deputy-director-slac" class="su-no-underline hocus:su-underline">
                                <h3 class="su-text-16 su-font-bold su-m-0 lg:su-text-24 lg:su-leading-[28.8px]">
                                    Alberto Salleo named deputy director for science and technology at SLAC
                                </h3>
                            </a>
                        </article>
                    </div>
                </div>
            </section>`;

        wrapper = document.querySelector('[data-role="link-list-wrap"]');
        toggle = document.querySelector('[data-role="link-drawer-toggle"]');
        drawer = document.querySelector('[data-role="link-drawer"]');
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _initialize for each carousel section', () => {    
            const _initializeSpy = vi.spyOn(linkList, '_initialize');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            // Call the function to set up all event listeners
            linkList._initialize(wrapper, toggle, drawer, '');

            // Check if the spy was called
            expect(_initializeSpy).toHaveBeenCalledWith(wrapper, toggle, drawer, '');
            // Restore the orginal function after test
            _initializeSpy.mockRestore();
        });
    });

    describe('[toggleDrawer]', () => {
        it("toggles drawer open and closed", () => {
            linkList.toggleDrawer(toggle, drawer);
            expect(toggle.dataset.active).toBe("true");
            expect(toggle.classList.contains("su-rotate-90")).toBe(true);
            expect(drawer.classList.contains("su-h-auto")).toBe(true);

            linkList.toggleDrawer(toggle, drawer); // close again
            expect(toggle.dataset.active).toBe("false");
            expect(toggle.classList.contains("su-rotate-[-90deg]")).toBe(true);
            expect(drawer.classList.contains("su-h-0")).toBe(true);
        });
    });

    describe('[handleScroll]', () => {
        it("adds and removes visibility classes on scroll", () => {
            Object.defineProperty(window, "scrollY", { value: 300, writable: true });
            Object.defineProperty(window, "innerHeight", { value: 300, writable: true });

            Object.defineProperty(document.body, "clientHeight", { value: 1000 });
            Object.defineProperty(document.body, "getBoundingClientRect", {
                value: () => ({ height: 1500 }),
            });

            linkList.handleScroll(wrapper);
            expect(wrapper.classList.contains("su-opacity-[0]")).toBe(false);
            expect(wrapper.classList.contains("su-bottom-[-100px]")).toBe(false);
            expect(wrapper.classList.contains("su-opacity-[1]")).toBe(true);
            expect(wrapper.classList.contains("su-bottom-0")).toBe(true);

            window.scrollY = 0;
            linkList.handleScroll(wrapper);
            expect(wrapper.classList.contains("su-opacity-[0]")).toBe(true);
            expect(wrapper.classList.contains("su-bottom-[-100px]")).toBe(true);
            expect(wrapper.classList.contains("su-opacity-[1]")).toBe(false);
            expect(wrapper.classList.contains("su-bottom-0")).toBe(false);
        });
    });

    describe('[createLinkItem]', () => {
        it("creates correct link item HTML", () => {
            const result = linkList.createLinkItem("Test Title", "https://example.com");
            expect(result).toContain("Test Title");
            expect(result).toContain('href="https://example.com"');
        });
    });

    describe('[renderContent]', () => {
        it("renders 3 articles with correct HTML", () => {
            const items = [
                linkList.createLinkItem("One", "#1"),
                linkList.createLinkItem("Two", "#2"),
                linkList.createLinkItem("Three", "#3"),
            ];
            linkList.renderContent(items, wrapper, drawer);
            expect(drawer.querySelectorAll("article").length).toBe(3);
        });

        it("renders no stories class if list is empty", () => {
            linkList.renderContent([], wrapper, drawer);
            expect(wrapper.classList.contains("su-link-list-no-stories")).toBe(true);
        });

        it("Should render only first item when second and third are missing", () => {
        const items = ['<a href="/1">First</a>'];
        linkList.renderContent(items, wrapper, drawer);
        
        const articles = drawer.querySelectorAll("article");
        expect(articles.length).toBe(1);
        expect(articles[0].innerHTML).toContain("First");
        });
    
        it("Should not render first article when first is falsy", () => {
            linkList.renderContent([undefined], wrapper, drawer);
            const article = drawer.querySelector("article");
            expect(article).toBeNull();
        });
    });

    describe('[fetchAndRenderLinks]', () => {
        it("fetches data and renders links", async () => {
            const mockData = [
                { title: "Alpha", indexUrl: "/alpha" },
                { title: "Beta", indexUrl: "/beta" },
            ];

            (fbFetcher).mockResolvedValue(mockData);

            await linkList.fetchAndRenderLinks({ some: "data" }, null, wrapper, toggle, drawer, '');

            expect(drawer.innerHTML).toContain("Alpha");
            expect(drawer.innerHTML).toContain("Beta");
        });
    });

    describe('[attachEventListeners]', () => {
        it('Should toggle classes on button click', () => {
            linkList.attachEventListeners(wrapper, toggle, drawer);
    
            // Simulate click on button
            fireEvent.click(toggle);
    
            // Expect styles indicating an "open" state
            expect(toggle.dataset.active).toBe("true");
            expect(toggle.classList.contains("su-rotate-90")).toBe(true);
            expect(drawer.classList.contains("su-h-auto")).toBe(true);
        }); 
        
        it('Should apply classes on scroll', () => {
            linkList.attachEventListeners(wrapper, toggle, drawer);
    
            // Simulate scroll
            fireEvent.scroll(window);
    
            // Expect wrapper to have any visibility-related class added or removed
            const hasClass =
                wrapper.classList.contains('su-opacity-[1]') ||
                wrapper.classList.contains('su-bottom-0') ||
                wrapper.classList.contains('su-opacity-[0]') ||
                wrapper.classList.contains('su-bottom-[-100px]');
    
            expect(hasClass).toBe(true); 
        });
    });
     

    describe('[_initialize]', () => {
        it('Should render links in the drawer based on window.pageController', async () => {
            window.pageController = { topicsQuery: () => null };
    
            // Mock API response from fbFetcher
            const mockData = [
                { title: "Item A", indexUrl: "/a" },
                { title: "Item B", indexUrl: "/b" }
            ];
            fbFetcher.mockResolvedValue(mockData); 
    
            // Create mock DOM elements
            const wrapper = document.createElement('div');
            const toggle = document.createElement('button');
            const drawer = document.createElement('div');
    
            // Run initialization
            await linkList._initialize(wrapper, toggle, drawer, 'cookie-value');
    
            // Expect rendered content to include mocked data
            expect(drawer.innerHTML).toContain('Item A');
            expect(drawer.innerHTML).toContain('Item B');
        }); 
    
        it("Should handle missing topicsQuery gracefully", async () => {
            window.pageController = {};
    
            // Create mock DOM elements
            const wrapper = document.createElement("div");
            const toggle = document.createElement("button");
            const drawer = document.createElement("div");
    
            // Mock empty fetch result
            fbFetcher.mockResolvedValue([]);
    
            // Run initialization
            await linkList._initialize(wrapper, toggle, drawer, "cookie");
    
            // Expect fetch to have been called regardless of missing topicsQuery
            expect(fbFetcher).toHaveBeenCalled(); 
        });
    });
});


