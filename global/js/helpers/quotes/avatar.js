/**
 * Creates an avatar image with a decorative border
 *
 * @param {string} image - The avatar image URL
 * @param {string} avatarSize - The size of the avatar (small, medium, large)
 * @param {string} alt - Alt text for the image
 * @return {string} HTML string of the avatar
 */
export function avatar({ image, avatarSize = "small", alt = "" }) {
  const avatarWrapperClasses = new Map();
  avatarWrapperClasses.set(
    "small",
    "su-min-w-[56px] su-w-[56px] su-h-[56px] su-p-3"
  );
  avatarWrapperClasses.set(
    "medium",
    "su-min-w-[165px] su-w-[165px] su-h-[165px] su-p-7"
  );
  avatarWrapperClasses.set(
    "large",
    "su-min-w-[218px] su-w-[218px] su-h-[218px] su-p-9"
  );

  const avatarImageClasses = new Map();
  avatarImageClasses.set("small", "su-w-50 su-h-50 su-top-3 su-left-3");
  avatarImageClasses.set("medium", "su-size-150 su-top-7 su-left-8");
  avatarImageClasses.set("large", "su-size-200 su-top-9 su-left-9");

  return image ? `
    <div
      data-test="size-${avatarSize}"
      class="su-component-avatar su-relative su-block su-rounded-full su-bg-gradient-light-red-h su-overflow-hidden ${avatarWrapperClasses.get(avatarSize)}"
    >
      <img
        class="su-absolute su-rounded-full su-object-cover su-object-center ${avatarImageClasses.get(avatarSize)}"
        src="${image}"
        alt="${alt}"
      />
    </div>
  ` : "";
}
