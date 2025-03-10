import { vi, describe, it, expect } from 'vitest';
import { uuid } from './uuid';

describe('[Unique ID]', () => {
    it('Should generate a valid UUID', () => {
        const id = uuid();
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        expect(uuidRegex.test(id)).toBe(true);
    });

    it('Should generate unique UUIDs', () => {
        const id1 = uuid();
        const id2 = uuid();

        expect(id1).not.toBe(id2);
    });

    it('Should generate alternativeUUID if crypto is undefined', () => {
        vi.stubGlobal('crypto', undefined);

        const id = uuid();
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        expect(uuidRegex.test(id)).toBe(true);
    });

    it('Should handle performance.now being undefined', () => {
        vi.stubGlobal('performance', { now: undefined });

        const id = uuid();
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        expect(uuidRegex.test(id)).toBe(true);
    });
});
