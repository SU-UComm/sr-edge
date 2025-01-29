import basicAssetUri from './basicAssetUri';
import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('[Basic Asset Uri]', () => {
    let mockFns;

    beforeEach(() => {
        mockFns = {
            resolveUri: vi.fn(),
        };
    });

    describe('[Error Handling]', () => {
        it('Should throw an error if fns is not an object or missing resolveUri function', async () => {
            await expect(
                basicAssetUri('test', 'matrix-asset://api-identifier/123'),
            ).rejects.toThrow(
                'Error occurred in the basicAssetUri function, fns cannot be undefined or null and must have resolveUri function within it. The "test" was received.',
            );

            await expect(
                basicAssetUri({}, 'matrix-asset://api-identifier/123'),
            ).rejects.toThrow(
                'Error occurred in the basicAssetUri function, fns cannot be undefined or null and must have resolveUri function within it. The "[object Object]" was received.',
            );
        });

        it('Should throw an error if assetUri is not a string or is an empty string', async () => {
            await expect(basicAssetUri(mockFns, '')).rejects.toThrow(
                'Error occurred in the basicAssetUri function, assetUri cannot be undefined and must be non-empty string. The "" was received.',
            );

            await expect(basicAssetUri(mockFns, null)).rejects.toThrow(
                'Error occurred in the basicAssetUri function, assetUri cannot be undefined and must be non-empty string. The "null" was received.',
            );
        });
    });

    describe('[basicAssetUri Function]', () => {
        it('Should call resolveUri with the correct assetUri', async () => {
            const assetUri = 'matrix-asset://api-identifier/123';
            const mockAssetData = { id: 123, name: 'Test Asset' };
            mockFns.resolveUri.mockResolvedValue(mockAssetData);

            const result = await basicAssetUri(mockFns, assetUri);

            expect(mockFns.resolveUri).toHaveBeenCalledWith(assetUri);
            expect(result).toBe(mockAssetData);
        });

        it('Should throw an error if resolveUri rejects', async () => {
            const assetUri = 'matrix-asset://api-identifier/123';
            mockFns.resolveUri.mockRejectedValue(new Error('Network Error'));

            await expect(basicAssetUri(mockFns, assetUri)).rejects.toThrow(
                'Network Error',
            );
        });
    });
});
