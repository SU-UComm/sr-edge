import {
  Announcement,
  EventsCalendar,
  BullseyePointer,
  FeaturedReading,
  FeaturedAudio,
  MediaGallery,
  TrendingUp
} from "../SVG-library";

/**
 * Creates a sidebar heading with an optional icon (server-side only)
 * 
 * @param {Object} props Configuration object
 * @param {string} props.title The title text
 * @param {string} props.icon The icon to display before the title text
 * @param {string} props.headingSize The semantic heading tag (defaults to "h2")
 * @param {string} props.color The color variant to display (defaults to "grey")
 * @returns {string} HTML string
 */
export function SidebarHeading({
  title,
  icon,
  headingSize = "h2",
  color = "grey"
}) {
  if (!title) return "";

  const iconMap = new Map([
    ['announcement', {
      light: Announcement({ variant: "light" }),
      dark: Announcement({ variant: "dark" })
    }],
    ['eventscalendar', {
      light: EventsCalendar({ variant: "light" }),
      dark: EventsCalendar({ variant: "dark" })
    }],
    ['bullseyePointer', {
      light: BullseyePointer({ variant: "light" }),
      dark: BullseyePointer({ variant: "dark" })
    }],
    ['Featured reading', {
      light: FeaturedReading({ variant: "light" }),
      dark: FeaturedReading({ variant: "dark" })
    }],
    ['Featured audio', {
      light: FeaturedAudio({ variant: "light" }),
      dark: FeaturedAudio({ variant: "dark" })
    }],
    ['mediagallery', {
      light: MediaGallery({ variant: "light" }),
      dark: MediaGallery({ variant: "dark" })
    }],
    ['trendingup', {
      light: TrendingUp({ variant: "light" }),
      dark: TrendingUp({ variant: "dark" })
    }]
  ]);

  const colorClassMap = new Map([
    ['grey', "su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"],
    ['black', "su-text-black dark:su-text-white su-font-bold su-text-20 md:su-text-28 su-items-start"],
    ['media', "su-text-black-90 dark:su-text-black-20 su-font-semibold su-text-18 su-items-center"]
  ]);

  return `
    <${headingSize} class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans ${colorClassMap.get(color) || ''}">
      ${iconMap.has(icon) ? `
        <span data-test="icon" class="dark:su-hidden">
          ${iconMap.get(icon).light}
        </span>
        <span data-test="icon" class="su-hidden dark:su-block">
          ${iconMap.get(icon).dark}
        </span>
      ` : ""}
      <span>${title}</span>
    </${headingSize}>
  `;
}
