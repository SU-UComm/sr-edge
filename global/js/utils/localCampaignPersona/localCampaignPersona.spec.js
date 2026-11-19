import { describe, expect, it } from 'vitest';
import {
    audienceForUi,
    getLocalPersonaFromSearchParams,
    normalizePersonaCookieValue,
    shouldApplyLocalPersona,
} from './localCampaignPersona';

describe('[localCampaignPersona]', () => {
    describe('[normalizePersonaCookieValue]', () => {
        it('Should strip wrapping double quotes', () => {
            expect(normalizePersonaCookieValue('"student"')).toBe('student');
        });

        it('Should treat string null as missing', () => {
            expect(normalizePersonaCookieValue('null')).toBe(null);
        });

        it('Should decode URI-encoded values', () => {
            expect(normalizePersonaCookieValue('%22faculty%22')).toBe('faculty');
        });
    });

    describe('[getLocalPersonaFromSearchParams]', () => {
        it('Should return "local" when utm_medium and utm_campaign match', () => {
            const params = new URLSearchParams(
                'utm_medium=email&utm_campaign=local',
            );

            expect(getLocalPersonaFromSearchParams(params)).toBe('local');
        });

        it('Should return null when only utm_medium matches', () => {
            const params = new URLSearchParams('utm_medium=email');

            expect(getLocalPersonaFromSearchParams(params)).toBe(null);
        });

        it('Should return null when only utm_campaign matches', () => {
            const params = new URLSearchParams('utm_campaign=local');

            expect(getLocalPersonaFromSearchParams(params)).toBe(null);
        });

        it('Should return null when params are missing', () => {
            expect(getLocalPersonaFromSearchParams(new URLSearchParams())).toBe(
                null,
            );
        });
    });

    describe('[shouldApplyLocalPersona]', () => {
        const localParams = new URLSearchParams(
            'utm_medium=email&utm_campaign=local',
        );

        it('Should apply when campaign matches and cookie is unset', () => {
            expect(shouldApplyLocalPersona(undefined, localParams)).toBe(true);
            expect(shouldApplyLocalPersona(null, localParams)).toBe(true);
            expect(shouldApplyLocalPersona('external', localParams)).toBe(true);
        });

        it('Should not apply when cookie is already local', () => {
            expect(shouldApplyLocalPersona('local', localParams)).toBe(false);
        });

        it('Should not apply when cookie is student or faculty', () => {
            expect(shouldApplyLocalPersona('student', localParams)).toBe(false);
            expect(shouldApplyLocalPersona('faculty', localParams)).toBe(false);
        });

        it('Should not apply when cookie is quoted student or faculty', () => {
            expect(shouldApplyLocalPersona('"student"', localParams)).toBe(false);
            expect(shouldApplyLocalPersona('"faculty"', localParams)).toBe(false);
        });

        it('Should not apply when campaign params do not match', () => {
            expect(
                shouldApplyLocalPersona(null, new URLSearchParams()),
            ).toBe(false);
        });
    });

    describe('[audienceForUi]', () => {
        it('Should map missing or null cookie to external', () => {
            expect(audienceForUi(undefined)).toBe('external');
            expect(audienceForUi(null)).toBe('external');
            expect(audienceForUi('null')).toBe('external');
        });

        it('Should map local to external for UI', () => {
            expect(audienceForUi('local')).toBe('external');
            expect(audienceForUi('"local"')).toBe('external');
        });

        it('Should pass through student and faculty', () => {
            expect(audienceForUi('student')).toBe('student');
            expect(audienceForUi('faculty')).toBe('faculty');
        });
    });
});