/**
 * this function converts audience (personalisation profiles)
 * from their Matrix taxonomies (faculty, student, "") to
 * their Funnelback equivalent: (Faculty/staff, Student, External)
 *
 * @param {string} profile
 * the personalisation value
 *
 * @returns {string}
 */
export function translatePersonalisationProfile(profile) {
  switch (profile) {
    case "faculty":
      return "Faculty/staff";
    case "student":
      return "Student";
    default:
      return "External";
  }
}
