import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicAssetUri } from '../../global/js/utils';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();

console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    basicAssetUri: vi.fn(),
    isRealExternalLink: vi.fn((url) => url.startsWith('http'))
}));

describe('[ButtonRow]', () => {
    const mockFnsCtx = {
        resolveUri: vi.fn(),
    };
    const defaultButtons = [
        {
            buttonText: 'Primary Button',
            internalUrl: '/primary-link',
            externalUrl: undefined,
            isNewWindow: false,
        },
        {
            buttonText: 'External Link',
            internalUrl: undefined,
            externalUrl: 'https://external.com',
            isNewWindow: true,
        }
    ];
    const defaultMockInfo = {
        fns: mockFnsCtx,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        basicAssetUri.mockResolvedValueOnce({
            url: 'https://example.com/internal-link',
        });
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters are provided.', async () => {
            const result = await main();
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when no info was provided', async () => {
            const result = await main(defaultButtons);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx is invalid', async () => {
            const mockInfo = { test: 'test' };
            const result = await main(defaultButtons, mockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "info.fns" cannot be undefined or null. The {} was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when buttons array is missing', async () => {
            const mockData = {};
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "buttons" field must be a non-empty array. The undefined was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when buttons array is empty', async () => {
            const mockData = { buttons: [] };
            const result = await main(mockData, defaultMockInfo);
            expect(result).toBe(
                '<!-- Error occurred in the Button Row component: The "buttons" field must be a non-empty array. The [] was received. -->'
            );
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should render button row with internal URLs', async () => {
            const mockButtons = [{
                buttonText: 'Internal Link',
                internalUrl: '/internal-link',
            }];
            const result = await main({ buttons: mockButtons }, defaultMockInfo);

            expect(result).to.contain('data-component="button-row"');
            expect(result).to.contain('Internal Link');
            expect(result).to.contain('/internal-link');
            expect(result).not.contain('svg-inline--fa fa-arrow-up');
        });

        it('Should handle external links correctly', async () => {
            const mockButtons = [{
                buttonText: 'External Link',
                externalUrl: 'https://external.com',
                isNewWindow: true,
            }];
            const result = await main({ buttons: mockButtons }, defaultMockInfo);
            
            expect(result).to.contain('data-component="button-row"');
            expect(result).to.contain('External Link');
            expect(result).to.contain('https://external.com');
            expect(result).to.contain('svg-inline--fa fa-arrow-up');
            expect(result).to.contain('target="_blank"');
        });

        it('Should handle multiple buttons correctly', async () => {
            const result = await main({ buttons: defaultButtons }, defaultMockInfo);

            expect(result).to.contain('data-component="button-row"');
            expect(result).to.contain('Primary Button');
            expect(result).to.contain('https://example.com/internal-link');

            expect(result).to.contain('External Link');
            expect(result).to.contain('https://external.com');
            expect(result).to.contain('svg-inline--fa fa-arrow-up');
            expect(result).to.contain('target="_blank"');            
        });

        it('Should handle no URL buttons correctly', async () => {
            const mockButtons = [
                ...defaultButtons,
                {
                    buttonText: 'External Link',
                    internalUrl: '',
                    externalUrl: '',
                    isNewWindow: true,
                }
            ]           

            const result = await main({ buttons: mockButtons }, defaultMockInfo);

            expect(result).to.contain('data-component="button-row"');
            expect(result).to.contain('Primary Button');
            expect(result).to.contain('https://example.com/internal-link');

            expect(result).to.contain('External Link');
            expect(result).to.contain('https://external.com');
            expect(result).to.contain('svg-inline--fa fa-arrow-up');
            expect(result).to.contain('target="_blank"');

            // no empty links!
            expect(result).not.to.contain('href=""');
        });
    });
});