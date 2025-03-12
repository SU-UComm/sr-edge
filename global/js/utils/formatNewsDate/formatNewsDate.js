/**
 * Date formatter for some cards
 *
 * @param {object} prop.time
 * The timestamp, comes from the date prop of the main component
 *
 * @returns {string} The formatted date
 */
export function formatNewsDate(dateString) {
  if (!dateString) return null;

  const sDate = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(sDate);
  return `${formattedDate}`;
}

export default formatNewsDate;
