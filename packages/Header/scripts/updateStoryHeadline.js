export function updateStoryHeadline(relatedStory, pageController, storyHeadline, HEADER_HIDDEN_CLASS = 'su-hidden') {
  if (relatedStory && pageController && storyHeadline) {
      const storyHeadlineAnnouncement = storyHeadline.querySelector('h2[data-story="announcement"]');
      const storyHeadlineTitle = storyHeadline.querySelector('h1[data-story="title"]');
      const storyHeadlineLink = storyHeadline.querySelector('a[data-story="link"]');
      pageController?.contentType && storyHeadlineAnnouncement && (storyHeadlineAnnouncement.textContent = pageController.contentType === "Video" ? "Watch next:" : "Read next:");
      pageController?.title && storyHeadlineTitle && (storyHeadlineTitle.textContent = pageController.title);
  
      if (relatedStory?.displayUrl && relatedStory?.title && storyHeadlineLink) {
        storyHeadlineLink.textContent = relatedStory.title;
        storyHeadlineLink.href = relatedStory.displayUrl;
      }
  
      if (pageController?.title || relatedStory?.displayUrl) {
        storyHeadline.classList.remove(HEADER_HIDDEN_CLASS);
      }
    }
  }
  