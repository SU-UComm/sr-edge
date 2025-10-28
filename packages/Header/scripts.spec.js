import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cdpSetConsent } from '../../global/js/utils/cdpSetConsent';
import { cdpSetPersona } from '../../global/js/utils/cdpSetPersona';
import { setCookie } from '../../global/js/utils/setCookie';
import { getCookie } from '../../global/js/utils/getCookie';

// Mock external utilities and modules
vi.mock('../../global/js/utils/cdpSetConsent', () => ({
    cdpSetConsent: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../global/js/utils/cdpSetPersona', () => ({
    cdpSetPersona: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../global/js/utils/setCookie', () => ({
    setCookie: vi.fn(),
}));

vi.mock('../../global/js/utils/getCookie', () => ({
    getCookie: vi.fn(() => JSON.stringify({ CDPConsent: true })),
}));

vi.mock('./scripts/reportHeader', () => ({
    ReportHeader: vi.fn(),
}));

vi.mock('./scripts/relatedStory', () => ({
    default: vi.fn(() =>
        Promise.resolve({
            title: 'Related Story Title',
            displayUrl: '/related-story-url',
        }),
    ),
}));

describe('[Header Component][Client]', () => {
    describe('[Functions]', () => {
        let header;

        beforeEach(async () => {
            // Minimal DOM setup for initial tests
            document.body.innerHTML = `
            <section data-subcomponent="header-cookie-consent-banner"></section>
            <section data-subcomponent="header-current-story-headline" class="su-hidden">
            <div data-current-story="headline">
                <h1 data-story="title"></h1>
                <div>
                <h2 data-story="announcement"></h2>
                <p><a data-story="link"></a></p>
                </div>
            </div>
            </section>
        `;

            // Required event for feature code to work
            document.personaChangeEvent = new Event('personaChange');

            // Import the module after DOM is set
            header = await import('./scripts');
        });

        it('Should hide the consent banner', () => {
            const banner = document.querySelector(
                'section[data-subcomponent="header-cookie-consent-banner"]',
            );
            expect(banner.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                false,
            );

            header._hideConsentBanner();

            expect(banner.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                true,
            );
        });

        // Accepting consent Should hide the banner and set internal state
        it('Should accept consent and hide the banner', async () => {
            const banner = document.querySelector(
                'section[data-subcomponent="header-cookie-consent-banner"]',
            );
            expect(banner.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                false,
            );

            await header.handleConsent(true);

            expect(banner.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                true,
            );
            expect(header.consent).toBe(true);
        });

        it('Should reject consent and hide the banner', async () => {
            const banner = document.querySelector(
                'section[data-subcomponent="header-cookie-consent-banner"]',
            );
            expect(banner.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                false,
            );

            await header.handleConsent(false);

            expect(cdpSetConsent).toHaveBeenCalledWith(0);
            expect(header.consent).toBe(false);
            expect(banner.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                true,
            );
        });

        it('Should setup clearPreferences button with correct attributes on load', async () => {
            vi.mocked(getCookie).mockImplementation(() => JSON.stringify({ CDPConsent: true }));
        
            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <button data-click="clear-preferences" disabled></button>
              <button data-click="accept-consent"></button>
              <button data-click="reject-consent"></button>
              <button data-click="student-persona"></button>
              <button data-click="faculty-persona"></button>
            `;
        
            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));
        
            const clearPreferences = document.querySelector('button[data-click="clear-preferences"]');
        
            expect(clearPreferences).not.toBeNull();
            expect(clearPreferences.disabled).toBe(false);
            expect(clearPreferences.getAttribute('aria-pressed')).toBe('false');
            expect(clearPreferences.classList.contains('su-text-digital-blue')).toBe(true);
        });
        
        // Calling _manageAudience Should show the selected audience and update button states
        it('Should manage audience correctly in _manageAudience', () => {
            document.body.innerHTML = `
            <div data-audience="external" class=""></div>
            <div data-audience="student" class=""></div>
            <div data-audience="faculty" class=""></div>
            <button data-click="student-persona" aria-pressed="false"></button>
            <button data-click="faculty-persona" aria-pressed="false"></button>
        `;

            const external = document.querySelector(
                '[data-audience="external"]',
            );
            const student = document.querySelector('[data-audience="student"]');
            const faculty = document.querySelector('[data-audience="faculty"]');
            const studentButton = document.querySelector(
                'button[data-click="student-persona"]',
            );
            const facultyButton = document.querySelector(
                'button[data-click="faculty-persona"]',
            );

            header._manageAudience('student');

            expect(
                external.classList.contains(header.HEADER_HIDDEN_CLASS),
            ).toBe(true);
            expect(faculty.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                true,
            );
            expect(student.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                false,
            );

            expect(studentButton.getAttribute('aria-pressed')).toBe('true');
            expect(facultyButton.getAttribute('aria-pressed')).toBe('false');
        });

        it('Should not throw when consent banner is missing', () => {
            document.body.innerHTML = '';
            expect(() => header._hideConsentBanner()).not.toThrow();
        });

        it('Should set persona, dispatch event, and reload when no prior consent exists', async () => {
            const reloadSpy = vi
                .spyOn(window.location, 'reload')
                .mockImplementation(() => {});
            const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

            // Required DOM structure
            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <div data-audience="external"></div>
              <div data-audience="student"></div>
              <div data-audience="faculty"></div>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
            `;

            header = await import('./scripts');

            // Required event for persona switching
            document.personaChangeEvent = new Event('personaChange');

            await header.handlePersona('student', null);

            expect(header.consent).toBe(true);
            expect(cdpSetConsent).toHaveBeenCalledWith(1);
            expect(cdpSetPersona).toHaveBeenCalledWith(
                'persona-selector',
                'student',
            );
            expect(setCookie).toHaveBeenCalledWith(
                'preferences_personalisation',
                'student',
                true,
                130,
            );
            expect(dispatchSpy).toHaveBeenCalled();
            expect(reloadSpy).toHaveBeenCalled();

            reloadSpy.mockRestore();
        });

        it('Should reset to "external" if the same persona is selected again', async () => {
            const reloadSpy = vi
                .spyOn(window.location, 'reload')
                .mockImplementation(() => {});
            const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

            // Required DOM structure
            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <div data-audience="external"></div>
              <div data-audience="student"></div>
              <div data-audience="faculty"></div>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
            `;

            header = await import('./scripts');

            // Required event
            document.personaChangeEvent = new Event('personaChange');

            await header.handlePersona('student', 'student');

            expect(cdpSetPersona).toHaveBeenCalledWith(
                'persona-selector',
                'external',
            );
            expect(setCookie).toHaveBeenCalledWith(
                'preferences_personalisation',
                'external',
                true,
                130,
            );
            expect(dispatchSpy).toHaveBeenCalled();
            expect(reloadSpy).toHaveBeenCalled();

            reloadSpy.mockRestore();
        });

        it('Should clear consent and set persona to null when removeConsent is true', async () => {
            const reloadSpy = vi
                .spyOn(window.location, 'reload')
                .mockImplementation(() => {});
            const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <div data-audience="external"></div>
              <div data-audience="student"></div>
              <div data-audience="faculty"></div>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
            `;

            header = await import('./scripts');

            document.personaChangeEvent = new Event('personaChange');

            await header.handlePersona(null, null, true);

            expect(cdpSetConsent).toHaveBeenCalledWith(0);
            expect(header.consent).toBe(false);
            expect(cdpSetPersona).toHaveBeenCalledWith(
                'persona-selector',
                null,
            );
            expect(setCookie).toHaveBeenCalledWith(
                'preferences_personalisation',
                null,
                true,
                130,
            );
            expect(dispatchSpy).toHaveBeenCalled();
            expect(reloadSpy).toHaveBeenCalled();

            reloadSpy.mockRestore();
        });

        it('Should initialize ReportHeader when HEADER_SELECTOR exists', async () => {
            document.body.innerHTML = `
              <header data-component="header-component"></header>
              <button data-click="student-persona"></button>
              <button data-click="faculty-persona"></button>
            `;

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');

            document.dispatchEvent(new Event('DOMContentLoaded'));

            const reportHeader = (await import('./scripts/reportHeader'))
                .ReportHeader;
            expect(reportHeader).toHaveBeenCalled();
        });

        it('Should call relatedStoryData if isStory is true', async () => {
            // Import the mock BEFORE importing scripts to get the same instance
            const { default: relatedStoryDataMock } = await import('./scripts/relatedStory');

            document.body.innerHTML = `
              <header data-component="header-component"></header>
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <button data-click="student-persona"></button>
              <button data-click="faculty-persona"></button>
            `;

            window.pageController = { isStory: true };
            
            vi.mocked(getCookie).mockImplementation((name) => {
                if (name === 'squiz.cdp.consent') return JSON.stringify({ CDPConsent: true });
                if (name === 'preferences_personalisation') return 'student';
                return null;
            });

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');

            document.dispatchEvent(new Event('DOMContentLoaded'));

            expect(relatedStoryDataMock).toHaveBeenCalledWith(
                window.pageController,
                'student',
            );
        });

        it('Should not update nav link classes when pageController id does not match link dataset id', async () => {
            document.body.innerHTML = `
              <header data-component="header-component"></header>
              <a data-menu="main-nav" data-id="999" class="su-border-transparent"></a>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
            `;
        
            window.pageController = { id: '123' }; 
            window.suHeaderProps = { pageData: {}, audienceData: 'student' };
        
            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));
        
            const nonMatchingLink = document.querySelector('a[data-id="999"]');
        
            expect(nonMatchingLink.classList.contains('su-border-transparent')).toBe(true);
            expect(nonMatchingLink.classList.contains('!su-text-digital-red')).toBe(false);
        });

        it('Should correctly add all highlight classes when pageController id matches link dataset id', async () => {
            document.body.innerHTML = `
              <header data-component="header-component"></header>
              <a data-menu="main-nav" data-id="123" class="su-border-transparent"></a>
              <a data-menu="main-nav" data-id="456" class="su-border-transparent"></a>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
            `;
        
            window.pageController = { id: '123' };
            window.suHeaderProps = { pageData: {}, audienceData: 'student' };
        
            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));
        
            const matchingLink = document.querySelector('a[data-id="123"]');
            const nonMatchingLink = document.querySelector('a[data-id="456"]');
        
            expect(matchingLink.classList.contains('su-border-transparent')).toBe(false);
        
            expect(matchingLink.classList.contains('!su-text-digital-red')).toBe(true);
            expect(matchingLink.classList.contains('su-border-digital-red')).toBe(true);
            expect(matchingLink.classList.contains('dark:su-border-dark-mode-red')).toBe(true);
            expect(matchingLink.classList.contains('dark:!su-text-dark-mode-red')).toBe(true);
        
            expect(nonMatchingLink.classList.contains('su-border-transparent')).toBe(true);
            expect(nonMatchingLink.classList.contains('!su-text-digital-red')).toBe(false);
        });
        
        
        it('Should hide banner and enable clearPreferences button when consentData exists', async () => {
            vi.mocked(getCookie).mockImplementation(() =>
                JSON.stringify({ CDPConsent: true }),
            );

            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <button data-click="clear-preferences" disabled></button>
              <button data-click="accept-consent"></button>
              <button data-click="reject-consent"></button>
              <button data-click="student-persona"></button>
              <button data-click="faculty-persona"></button>
            `;

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');

            document.dispatchEvent(new Event('DOMContentLoaded'));

            const banner = document.querySelector(
                'section[data-subcomponent="header-cookie-consent-banner"]',
            );
            const clearPreferences = document.querySelector(
                'button[data-click="clear-preferences"]',
            );

            expect(banner.classList.contains(header.HEADER_HIDDEN_CLASS)).toBe(
                true,
            );
            expect(clearPreferences.disabled).toBe(false);
            expect(clearPreferences.getAttribute('aria-pressed')).toBe('false');
            expect(
                clearPreferences.classList.contains('su-text-digital-blue'),
            ).toBe(true);
        });

        it('Should set consent to true when acceptConsent button clicked', async () => {
            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <div data-audience="external" class=""></div>
              <div data-audience="student" class=""></div>
              <div data-audience="faculty" class=""></div>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
              <button data-click="clear-preferences" disabled></button>
              <button data-click="accept-consent"></button>
              <button data-click="reject-consent"></button>
            `;

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));

            const acceptButton = document.querySelector(
                'button[data-click="accept-consent"]',
            );
            await acceptButton.click();

            expect(header.consent).toBe(true);
        });

        it('Should set consent to false when rejectConsent button clicked', async () => {
            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <div data-audience="external" class=""></div>
              <div data-audience="student" class=""></div>
              <div data-audience="faculty" class=""></div>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
              <button data-click="clear-preferences" disabled></button>
              <button data-click="accept-consent"></button>
              <button data-click="reject-consent"></button>
            `;

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));

            const rejectButton = document.querySelector(
                'button[data-click="reject-consent"]',
            );
            await rejectButton.click();

            expect(header.consent).toBe(false);
        });

        it('Should select student persona when studentPersona button is clicked', async () => {
            getCookie.mockImplementation((name) => {
                if (name === 'preferences_personalisation') return '"student"';
                return null;
            });

            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <div data-audience="external" class=""></div>
              <div data-audience="student" class="su-hidden"></div>
              <div data-audience="faculty" class=""></div>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
              <button data-click="accept-consent"></button>
              <button data-click="reject-consent"></button>
              <button data-click="clear-preferences" disabled></button>
            `;

            window.suHeaderProps = { audienceData: null };

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));

            const studentButton = document.querySelector(
                'button[data-click="student-persona"]',
            );
            const studentAudience = document.querySelector(
                '[data-audience="student"]',
            );

            studentButton.click();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(
                studentAudience.classList.contains(header.HEADER_HIDDEN_CLASS),
            ).toBe(false);
            expect(studentButton.getAttribute('aria-pressed')).toBe('true');
        });

        it('Should select faculty persona when facultyPersona button is clicked', async () => {
            getCookie.mockImplementation((name) => {
                if (name === 'preferences_personalisation') return '"faculty"';
                return null;
            });

            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <div data-audience="external" class=""></div>
              <div data-audience="student" class=""></div>
              <div data-audience="faculty" class="su-hidden"></div>
              <button data-click="student-persona" aria-pressed="false"></button>
              <button data-click="faculty-persona" aria-pressed="false"></button>
              <button data-click="accept-consent"></button>
              <button data-click="reject-consent"></button>
              <button data-click="clear-preferences" disabled></button>
            `;

            window.suHeaderProps = { audienceData: null };

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));

            const facultyButton = document.querySelector(
                'button[data-click="faculty-persona"]',
            );
            const facultyAudience = document.querySelector(
                '[data-audience="faculty"]',
            );

            facultyButton.click();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(
                facultyAudience.classList.contains(header.HEADER_HIDDEN_CLASS),
            ).toBe(false);
            expect(facultyButton.getAttribute('aria-pressed')).toBe('true');
        });

        it('Should clear preferences when clearPreferences button is clicked', async () => {
            const reloadSpy = vi
                .spyOn(window.location, 'reload')
                .mockImplementation(() => {});
            const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

            vi.mocked(getCookie).mockImplementation((name) => {
                if (name === 'squiz.cdp.consent')
                    return JSON.stringify({ CDPConsent: true });
                return null;
            });

            document.body.innerHTML = `
              <section data-subcomponent="header-cookie-consent-banner"></section>
              <button data-click="clear-preferences" disabled></button>
              <button data-click="student-persona"></button>
              <button data-click="faculty-persona"></button>
            `;

            header = await import('./scripts');
            document.personaChangeEvent = new Event('personaChange');
            document.dispatchEvent(new Event('DOMContentLoaded'));

            const clearPreferences = document.querySelector(
                'button[data-click="clear-preferences"]',
            );
            clearPreferences?.click();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(cdpSetConsent).toHaveBeenCalledWith(0);
            expect(cdpSetPersona).toHaveBeenCalledWith(
                'persona-selector',
                null,
            );
            expect(setCookie).toHaveBeenCalledWith(
                'preferences_personalisation',
                null,
                true,
                130,
            );
            expect(dispatchSpy).toHaveBeenCalled();
            expect(reloadSpy).toHaveBeenCalled();

            reloadSpy.mockRestore();
        });
    });
});
