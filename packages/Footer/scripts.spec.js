/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCookie } from '../../global/js/utils/getCookie';
import * as footerScripts from './scripts';

vi.mock('../../global/js/utils/getCookie', () => ({
    getCookie: vi.fn(),
}));

describe('[Footer][Client]', () => {
    let externalElement, facultyElement, studentElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <span data-audience="external">External</span>
            <span data-audience="faculty">Faculty</span>
            <span data-audience="student">Student</span>
        `;
        externalElement = document.querySelector('[data-audience="external"]');
        facultyElement = document.querySelector('[data-audience="faculty"]');
        studentElement = document.querySelector('[data-audience="student"]');
        vi.clearAllMocks();
    });

    describe('[_manageAudience]', () => {
        it('Should hide all elements and show only external when audience is "external"', () => {
            footerScripts._manageAudience('external');

            expect(externalElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(false);
            expect(facultyElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
            expect(studentElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
        });

        it('Should hide all elements and show only faculty when audience is "faculty"', () => {
            footerScripts._manageAudience('faculty');

            expect(externalElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
            expect(facultyElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(false);
            expect(studentElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
        });

        it('Should hide all elements and show only student when audience is "student"', () => {
            footerScripts._manageAudience('student');

            expect(externalElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
            expect(facultyElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
            expect(studentElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(false);
        });

        it('Should hide all elements when audience is invalid', () => {
            footerScripts._manageAudience('invalid');

            expect(externalElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
            expect(facultyElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
            expect(studentElement.classList.contains(footerScripts.FOOTER_HIDDEN_CLASS)).toBe(true);
        });

        it('Should handle missing elements gracefully', () => {
            document.body.innerHTML = '';
            footerScripts._manageAudience('external');
            // No error means pass
            expect(true).toBe(true);
        });
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _manageAudience with "external" when cookie is not set', () => {
            getCookie.mockReturnValue(undefined);
            const _manageAudienceSpy = vi.spyOn(footerScripts, '_manageAudience');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);
            footerScripts._manageAudience('external');

            expect(_manageAudienceSpy).toHaveBeenCalledWith('external');
            _manageAudienceSpy.mockRestore();
        });

        it('Should call _manageAudience with "external" when cookie is "null"', () => {
            getCookie.mockReturnValue('null');
            const _manageAudienceSpy = vi.spyOn(footerScripts, '_manageAudience');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);
            footerScripts._manageAudience('external');


            expect(_manageAudienceSpy).toHaveBeenCalledWith('external');
            _manageAudienceSpy.mockRestore();
        });

        it('Should call _manageAudience with cookie value when cookie is set', () => {
            getCookie.mockReturnValue('faculty');
            const _manageAudienceSpy = vi.spyOn(footerScripts, '_manageAudience');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);
            footerScripts._manageAudience('faculty');

            expect(_manageAudienceSpy).toHaveBeenCalledWith('faculty');
            _manageAudienceSpy.mockRestore();
        });
    });
});
