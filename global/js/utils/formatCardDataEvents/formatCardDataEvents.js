/**
 *
 * @param {object} event
 * the event object
 *
 * @param {string} event.title
 * the event's title
 *
 * @param {string} event.description
 * the event's description
 *
 * @param {array} event.event_instances
 * the event instances is where the start and end dates
 * will be pulled out from
 *
 * @param {string} event.url
 * the event's URL
 *
 * @param {string} event.photo_url
 * the event's photo URL
 *
 * @param {array} event.departments
 * assumed to be the location of the image's alt text (best candidate thus far)
 *
 * @param {object} event.filters
 * location for the event types
 *
 * @returns {object}
 */
export function formatCardDataEvents({
  event: {
    title,
    description,
    // eslint-disable-next-line camelcase
    event_instances,
    // eslint-disable-next-line camelcase
    localist_url,
    // eslint-disable-next-line camelcase
    photo_url,
    filters,
  },
}) {
  // start date (date) and end date
  // eslint-disable-next-line camelcase
  const [instance] = event_instances;
  const endDate = instance.event_instance.end;
  const date = instance.event_instance.start;

  // liveUrl
  // eslint-disable-next-line camelcase
  const liveUrl = localist_url;

  // image
  const imageAlt = title;
  // eslint-disable-next-line camelcase
  const imageUrl = photo_url;

  // taxonomy
  const taxonomy = filters.event_types ? filters.event_types[0].name : "";
  const taxonomyUrl = null;

  // type
  const type = null;

  const videoUrl = null;

  return {
    title,
    description,
    liveUrl,
    imageUrl,
    imageAlt,
    taxonomy,
    taxonomyUrl,
    type,
    videoUrl,
    date,
    endDate,
  };
}
