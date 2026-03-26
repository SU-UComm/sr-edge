import { describe, expect, it } from "vitest";
import { formatCardDataImage } from "./formatCardDataImage";

describe("[formatCardDataImage]", () => {
  it("extracts dimensions from Matrix attribute objects", () => {
    const result = formatCardDataImage({
      url: "https://example.test/image.jpg",
      attributes: {
        alt: { value: "Alt text" },
        width: { value: "1500" },
        height: { value: "1000" },
      },
    });

    expect(result).toMatchObject({
      alt: "Alt text",
      width: 1500,
      height: 1000,
      orientation: "h",
    });
  });

  it("falls back to embedded EXIF-like dimensions when present", () => {
    const result = formatCardDataImage({
      url: "https://example.test/image.jpg",
      attributes: {
        embedded_data: {
          value: {
            imagewidth: { value: "800" },
            imageheight: { value: "1200" },
          },
        },
      },
    });

    expect(result).toMatchObject({
      width: 800,
      height: 1200,
      orientation: "v",
    });
  });

  it("infers dimensions from common URL patterns when attributes are missing", () => {
    const result = formatCardDataImage({
      url: "https://picsum.photos/1200/400",
      attributes: {},
    });

    expect(result).toMatchObject({
      width: 1200,
      height: 400,
      orientation: "h",
    });
  });

  it("falls back to varieties when width/height are missing or zero", () => {
    const result = formatCardDataImage({
      url: "https://example.test/image.jpg",
      attributes: {
        width: { value: "0" },
        height: { value: "0" },
        varieties: {
          value: {
            data: {
              v1: { variety_width: 100, variety_height: 100 },
              v2: { variety_width: 1500, variety_height: 1000 },
            },
          },
        },
      },
    });

    expect(result).toMatchObject({
      width: 1500,
      height: 1000,
      orientation: "h",
    });
  });
});

