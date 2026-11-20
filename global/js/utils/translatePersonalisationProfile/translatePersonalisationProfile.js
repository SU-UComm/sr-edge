import { normalizePersonaCookieValue } from '../localCampaignPersona';

/**
 * this function converts audience (personalisation profiles)
 * from their Matrix taxonomies (faculty, student, "") to
 * their Funnelback equivalent: (Faculty/staff, Student, Local, External)
 *
 * @param {string} profile
 * the personalisation value
 *
 * @returns {string}
 */
export function translatePersonalisationProfile(profile) {
  const normalizedProfile = normalizePersonaCookieValue(profile);

  switch (normalizedProfile) {
      case 'local':
          return 'Local';
      case 'faculty':
          return 'Faculty/staff';
      case 'student':
          return 'Student';
      default:
          return 'External';
  }
}