import { svgIcons } from "./index";

/**
 * Renders out the icon heading
 *
 * @param {string} title
 * The title text
 *
 * @param {string} icon
 * The icon to display before the title text
 *
 * @param {string} headingSize
 * The semantic heading tag
 *
 * @param {string} color
 * The colour variant to display
 *
 * @return {string}
 */
export function SidebarHeading({
    title,
    icon,
    headingSize = "h2",
    color = "grey",
    }) {

    const iconMap = new Map();
    iconMap.set("announcement", {
        light: svgIcons["announcement"]({variant: "light"}),
        dark: svgIcons["announcement"]({variant:"dark"}),
    });
    iconMap.set("eventscalendar", {
        light: svgIcons["eventsCalendar"]({variant:"light"}),
        dark: svgIcons["eventsCalendar"]({variant:"dark"}),
    });
    iconMap.set("bullseyePointer", {
        light: svgIcons["bullseyePointer"]({variant:"light"}),
        dark: svgIcons["bullseyePointer"]({variant:"dark"}),
    });
    iconMap.set("Featured reading", {
        light: svgIcons["featuredReading"]({variant:"light"}),
        dark: svgIcons["featuredReading"]({variant:"dark"}),
    });
    iconMap.set("Featured audio", {
        light: svgIcons["featuredAudio"]({variant:"light"}),
        dark: svgIcons["featuredAudio"]({variant:"dark"}),
    });
    iconMap.set("mediagallery", {
        light: svgIcons["mediaGallery"]({variant:"light"}),
        dark: svgIcons["mediaGallery"]({variant:"dark"}),
    });
    iconMap.set("trendingup", {
        light: svgIcons["trendingUp"]({variant:"light"}),
        dark: svgIcons["trendingUp"]({variant:"dark"}),
    });

    const colorClassMap = new Map();
    colorClassMap.set(
        "grey",
        "su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"
    );
    colorClassMap.set(
        "black",
        "su-text-black dark:su-text-white su-font-bold su-text-20 md:su-text-28 su-items-start"
    );
    colorClassMap.set(
        "media",
        "su-text-black-90 dark:su-text-black-20 su-font-semibold su-text-18 su-items-center"
    );

    return title !== '' ? `
        <${headingSize} class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans ${colorClassMap.get(color)}">
            ${iconMap.get(icon) && "light" in iconMap.get(icon) && "dark" in iconMap.get(icon) ? `
            <span data-test="icon" class="dark:su-hidden">
                ${iconMap.get(icon).light}
            </span>
            <span data-test="icon" class="su-hidden dark:su-block">
                ${iconMap.get(icon).dark}
            </span>
            ` : ''}
            <span>${title}</span>
        </${headingSize}>
    ` : '';
}

export default SidebarHeading;