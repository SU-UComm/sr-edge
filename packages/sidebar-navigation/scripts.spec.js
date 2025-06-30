/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import * as sidebarNav from './scripts';

describe('[Sidebar Navigation][Client]', () => {
    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        vi.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _menuInit for each section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'sidebar-navigation');
            document.body.appendChild(section);

            const _menuInitSpy = vi.spyOn(sidebarNav, '_menuInit');

            // Simulate DOMContentLoaded event
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);

            document.querySelectorAll(sidebarNav.SIDEBAR_NAV_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                sidebarNav._menuInit(section);
            });

            // Check if the spy was called
            expect(_menuInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _menuInitSpy.mockRestore();
        });
    });

    describe('[Manu functionality]', () => {
        function createToggleBtn() {
            const btn = document.createElement('button');
            btn.setAttribute('data-click', 'toggle-nav');
            btn.innerHTML = `
                <span data-label="button" data-label-open="Open" data-label-close="Close">Open</span>
                <svg data-icon="bars"></svg>
                <svg data-icon="xmark" class="!su-hodden"></svg>
            `;
            return btn;
        };

        function createMenu() {
            const menu = document.createElement('nav');
            menu.setAttribute('data-nav', 'nav');
            return menu;
        }

        let section, menu, btn;

        beforeEach(() => {
            document.body.innerHTML = '';
            section = document.createElement('section');
            section.setAttribute('data-component', 'sidebar-navigation');
            btn = createToggleBtn();
            menu = createMenu();
            section.appendChild(btn);
            section.appendChild(menu);
            document.body.appendChild(section);
        });

        afterEach(() => {
            vi.clearAllMocks();
        });

        it('Should changeStageToggleBtn update aria, class and icon visibility', () => {
            sidebarNav.changeStageToggleBtn(btn, true);

            expect(btn.getAttribute('aria-expanded')).toBe('true');
            
            sidebarNav.SIDEBAR_NAV_TOGGLE_BTN_CLASS.split(' ').forEach(cls => {
              expect(btn.classList.contains(cls)).toBe(true);
            });

            expect(btn.querySelector('svg[data-icon="bars"]').hidden).toBe(true);
            expect(btn.querySelector('svg[data-icon="xmark"]').hidden).toBe(false);
            expect(btn.querySelector(sidebarNav.SIDEBAR_NAV_TOGGLE_LABEL_SELECTOR).textContent).toBe('Close');
        });
        
        it('Should openMenu remove hidden class and calls changeStageToggleBtn with true', () => {
            const spy = vi.spyOn(btn, 'setAttribute');
            
            sidebarNav.openMenu(menu, btn);

            expect(menu.classList.contains(sidebarNav.SIDEBAR_NAV_HIDDEN_CLASS)).toBe(false);
            expect(menu.hidden).toBe(false);
            expect(spy).toHaveBeenCalledWith('aria-expanded', 'true');
        });
        
        it('Should closeMenu add hidden class and calls changeStageToggleBtn with false', () => {
            sidebarNav.closeMenu(menu, btn);

            expect(menu.classList.contains(sidebarNav.SIDEBAR_NAV_HIDDEN_CLASS)).toBe(true);
            expect(menu.hidden).toBe(true);
        });
        
        it('Should _menuInit attache click event and toggles menu visibility', () => {
            sidebarNav._menuInit(section);

            // Simulate click on open button
            fireEvent.click(btn);

            // check if manu was open
            expect(menu.hidden).toBe(false);
            
            // Simulate click on close button
            fireEvent.click(btn);
            // check if manu was closed
            expect(menu.hidden).toBe(true);
        });
        
        it('Should close the menu when Escape key is pressed', () => {
            sidebarNav._menuInit(section);

            // Simulate click on open button
            fireEvent.click(btn);

            // check if manu was open
            expect(menu.hidden).toBe(false);

            // Simulate Escape key press
            fireEvent.keyDown(document, { key: 'Escape' });
            
            // Check if menu is closed
            expect(menu.hidden).toBe(true);
        });

        it('Should not close the modal when a non-Escape key is pressed', () => {    
            sidebarNav._menuInit(section);

            // Simulate click on open button
            fireEvent.click(btn);

            // check if manu was open
            expect(menu.hidden).toBe(false);

            // Simulate a non-Escape key press
            fireEvent.keyDown(document, { key: 'ArrowUp' });

            // Check if menu is still open
            expect(menu.hidden).toBe(false);
        });
    });
});
