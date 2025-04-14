import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

describe('[Link List]', () => {
    const defaultMockData = {
        dataUrl: "https://news.stanford.edu/__data/assets/js_file/0028/129619/site-data.js",
        title: "Stories for you"
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters are provided.', async () => {
            const result = await main();
            
            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when dataUrl is undefined', async () => {
            const mockData = { ...defaultMockData, dataUrl: undefined };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when dataUrl is not a string', async () => {
            const mockData = { ...defaultMockData, dataUrl: 123 };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when dataUrl is not an empty string', async () => {
            const mockData = { ...defaultMockData, dataUrl: '' };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "dataUrl" field cannot be undefined and must be a non-empty string. The "" was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is undefined', async () => {
            const mockData = { ...defaultMockData, title: undefined };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "title" field cannot be undefined and must be a string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not a string', async () => {
            const mockData = { ...defaultMockData, title: 123 };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "title" field cannot be undefined and must be a string. The 123 was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title is not an empty string', async () => {
            const mockData = { ...defaultMockData, title: '' };
            const result = await main(mockData);

            expect(result).toBe(
                '<!-- Error occurred in the Link List component: The "title" field cannot be undefined and must be a string. The "" was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {  
        it('Should render expected HTML with proper data', async () => {
            const result = await main(defaultMockData);

            expect(result).toMatchInlineSnapshot(`"<section data-component="link-list"><div id="link-list" data-role="link-list-wrapper" class="su-link-list-no-stories su-fixed su-opacity-0 su--bottom-[100 su-left-0 su-left-1/2 su-right-1/2 su-translate-x-[-50%] su-max-w-[482px] su-p-20 su-bg-foggy-light lg:dark:su-bg-black-true dark:su-bg-black su-linklist-mob-width su-rounded-tl-[8px] su-rounded-tr-[8px] su-transition su-z-[49] su-px-30 su-linklist-mob-width lg:su-z-[1] lg:su-bg-white lg:su-relative lg:su-bottom-0 lg:su-opacity-100 lg:su-p-0 lg:su-w-full"><div class="su-flex"><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 27 27' fill='none' class='' ><g clipPath='url(#clip0_2402_1235)'><path d='M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z' fill='url(#paint0_linear_2402_1235)' /></g><defs><linearGradient id='paint0_linear_2402_1235'><stop class='su-stop-red' /><stop offset='1' class='su-stop-plum' /></linearGradient><clipPath id='clip0_2402_1235'><rect width='27' height='27' fill='white' /></clipPath></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg xmlns='http://www.w3.org/2000/svg' width='27' height='27' viewBox='0 0 27 27' fill='none' class='' ><g clipPath='url(#clip0_2402_1235)'><path d='M13.5 23.625C19.0899 23.625 23.625 19.0898 23.625 13.5C23.625 7.91016 19.0899 3.375 13.5 3.375C7.91021 3.375 3.37505 7.91016 3.37505 13.5C3.37505 13.7057 3.38032 13.9113 3.39614 14.117L0.0949707 15.0873C0.0316894 14.5652 4.88181e-05 14.0379 4.88181e-05 13.5C4.88181e-05 6.04336 6.04341 0 13.5 0C20.9567 0 27 6.04336 27 13.5C27 20.9566 20.9567 27 13.5 27C12.9622 27 12.4348 26.9684 11.9127 26.9051L12.8831 23.6039C13.0887 23.6145 13.2944 23.625 13.5 23.625ZM13.6213 21.0938L14.6602 17.5605C16.4268 17.0543 17.7188 15.4301 17.7188 13.5053C17.7188 11.1744 15.8309 9.28652 13.5 9.28652C11.5752 9.28652 9.94575 10.5785 9.44478 12.3451L5.9063 13.3787C5.96958 9.23906 9.34458 5.90625 13.5 5.90625C17.6924 5.90625 21.0938 9.30762 21.0938 13.5C21.0938 17.6555 17.761 21.0305 13.6213 21.0938ZM2.05669 16.2686L12.8567 13.0939C13.4948 12.9041 14.0907 13.5 13.9061 14.1434L10.7315 24.9434C10.5153 25.6764 9.50806 25.766 9.16528 25.0805L7.65181 22.0588C7.61489 21.9902 7.57271 21.9217 7.51997 21.8637L2.87935 26.5043C2.22017 27.1635 1.14966 27.1635 0.490479 26.5043C-0.168701 25.8451 -0.168701 24.7746 0.490479 24.1154L5.1311 19.4748C5.0731 19.4221 5.00981 19.3746 4.93599 19.343L1.91958 17.8348C1.23403 17.492 1.32368 16.4848 2.05669 16.2686Z' fill='url(#bullseyePointerDarkGradient)' /></g><defs><linearGradient id='bullseyePointerDarkGradient'><stop class='su-stop-teal' /><stop offset='1' class='su-stop-green' /></linearGradient><clipPath id='clip0_2402_1235'><rect width='27' height='27' fill='white' /></clipPath></defs></svg></span><span>Stories for you</span></h2><button class="su-text-digital-red dark:su-text-white su-rotate-[-90deg] lg:su-hidden" data-role="link-drawer-toggle" data-active="false" aria-controls="link-drawer" aria-label="link-drawer" type="button"><svg class='su-fill-transparent su-stroke-current ' data-testid='svg-chevron-right' xmlns='http://www.w3.org/2000/svg' width='18' height='19' viewBox='0 0 18 19' fill='none' aria-hidden='true'><path d='M6.75 4.25L12 9.5L6.75 14.75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /></svg></button></div><div class="su-max-h-1000 su-h-0 su-overflow-hidden su-transition lg:su-h-auto" id="link-drawer" data-role="link-drawer"></div></div></section>"`);
        });               
    });
});
