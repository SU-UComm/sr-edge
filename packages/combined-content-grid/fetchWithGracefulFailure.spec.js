import { describe, expect, it } from 'vitest';
import {
    fetchWithGracefulFailure,
    formatComponentErrorComment,
    prependErrorComments,
} from './fetchWithGracefulFailure';

describe('[fetchWithGracefulFailure]', () => {
    it('returns the resolved value when the promise succeeds', async () => {
        const result = await fetchWithGracefulFailure(Promise.resolve(['card']), 'Failed to fetch cards');

        expect(result).toEqual({ value: ['card'], errorComment: null });
    });

    it('returns an HTML error comment when the promise rejects', async () => {
        const result = await fetchWithGracefulFailure(
            Promise.reject(new Error('Events API returned 400 Bad Request')),
            'Failed to fetch event cards data',
        );

        expect(result.value).toBeNull();
        expect(result.errorComment).toBe(
            '<!-- Error occurred in the Combined Content Grid component: Failed to fetch event cards data. Events API returned 400 Bad Request -->',
        );
    });

    it('prepends non-empty error comments before rendered HTML', () => {
        const html = '<section data-component="combined-content-grid"></section>';
        const comments = [
            formatComponentErrorComment('Failed to fetch event cards data. Events API returned 400'),
        ];

        expect(prependErrorComments(comments, html)).toBe(`${comments[0]}${html}`);
        expect(prependErrorComments([], html)).toBe(html);
    });
});