export function updateStoryHeadline(relatedStory, pageController, storyHeadline, HEADER_HIDDEN_CLASS = 'su-hidden') {
  if (relatedStory && pageController && storyHeadline) {
      const storyHeadlineAnnouncement = storyHeadline.querySelector('h2[data-story="announcement"]');
      const storyHeadlineLink = storyHeadline.querySelector('a[data-story="link"]');
      pageController?.contentType && storyHeadlineAnnouncement && (storyHeadlineAnnouncement.textContent = pageController.contentType === "Video" ? "Watch next:" : "Read next:");
  
      if (relatedStory?.displayUrl && relatedStory?.title && storyHeadlineLink) {
        storyHeadlineLink.textContent = relatedStory.title;
        storyHeadlineLink.href = relatedStory.displayUrl;
      }
  
      if (pageController?.title || relatedStory?.displayUrl) {
        storyHeadline.classList.remove(HEADER_HIDDEN_CLASS);
      }
    }
  }
  