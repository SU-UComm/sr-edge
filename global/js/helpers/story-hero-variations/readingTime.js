export function readingTime(text) {
  if (!text) return 0;
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}
