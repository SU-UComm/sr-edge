export function carouselImages(data) {
  return data
    .map(({ url, alt, caption }) => {
      return `
        <article class="c-carousel-image-slide ${caption ? "has-caption" : "has-no-caption"}">
          <div class="c-carousel-image">
            <img src="${url}" alt="${alt}">
          </div>
          ${caption ? `<div class="c-carousel-caption"><p>${caption}</p></div>` : ""}
        </article>
      `;
    })
    .join(""); // Returns a single string containing all articles
}
