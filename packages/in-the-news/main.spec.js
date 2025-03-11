import { cardDataAdapter } from "../../global/js/utils";
import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
          {
              type: "Video",
              title: "Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East",
              liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east",
              description: "This is a custom feature desc",
              imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0022/63364/photo-1460661419201-fd4cecdf8a8b.jpeg",
              taxonomy: null,
              taxonomyUrl: null,
              videoUrl: "Vh-rvUKOOp8",
              date: "2024-01-01 00:00:00",
              source: null,
              authorName: null,
              authorEmail: null,
              quote: "A sanctuary, it's a forever thing. And so we want to know not only what's here now, but how it's changing over time.",
              ctaText: "Read the story on NPR",
              imageURL: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0020/63353/photo-1461749280684-dccba630e2f6.jpg"
          },
          {
              type: "Book",
              title: "Researchers illuminate inner workings of new-age soft semiconductors",
              liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/researchers-illuminate-inner-workings-of-new-age-soft-semiconductors",
              description: "Teaser 1 custom description",
              imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0028/63379/squiz-dxp.png",
              imageAlt: "",
              taxonomy: null,
              taxonomyUrl: null,
              videoUrl: "",
              date: "2024-01-01 00:00:00",
              source: null,
              authorName: null,
              authorEmail: null
          },
          {
              type: "News",
              title: "Stanford releases preliminary enrollment data for Class of 2028",
              liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028",
              description: "<p>The class is the first to be admitted under last year's U.S. Supreme Court ruling on college admissions. Stanford will continue and expand outreach activities in support of diversity broadly defined.</p>",
              imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63356/photo-1496171367470-9ed9a91ea931.jpeg",
              imageAlt: "",
              taxonomy: null,
              taxonomyUrl: null,
              videoUrl: "",
              date: "2024-01-01 00:00:00",
              source: null,
              authorName: null,
              authorEmail: null
          }
      ]),
    })),
    matrixCardService: vi.fn()
}));

describe('[In the news Content]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        headingConfiguration: {
          title: "In the news",
          ctaText: "View all",
          ctaUrl: "matrix-asset://api-identifier/89422",
      },
      featuredContent: {
          featuredTeaser: "matrix-asset://api-identifier/63436",
          personHeadshot: "matrix-asset://api-identifier/63353",
          featuredCtaText: "Read the story on NPR",
          featuredTeaserDescription: "This is a custom feature desc",
          featuredQuote: "A sanctuary, it’s a forever thing. And so we want to know not only what’s here now, but how it’s changing over time.”"
      },
      supplementaryTeaserOne: {
          teaserOne: "matrix-asset://api-identifier/63416",
          teaserOneDescription: "Teaser 1 custom description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent suscipit quis nunc non ultricies. Phasellus nisi orci, sagittis eu ligula ut, laoreet accumsan eros. Duis venenatis dolor vel eros gravida laoreet. Etiam accumsan nisl sapien, in convallis arcu volutpat eu. Etiam vehicula, sapien ac convallis fermentum, dui lectus porttitor magna, sit amet venenatis libero augue a justo. Nam convallis quam metus, vel luctus arcu pharetra euismod. Vestibulum imperdiet tempus blandit. Cras volutpat erat dui, ut volutpat massa porttitor sagittis. Etiam condimentum, mi vitae luctus efficitur, libero lorem faucibus lectus, sit amet aliquet eros nisi ut tortor. Nunc sit amet dignissim libero. Nullam nisi augue, gravida a arcu vel, sodales posuere odio. Nulla facilisis, nisl tincidunt fringilla faucibus, nisi risus viverra justo, sit amet tincidunt neque elit quis velit. Integer quam mauris, dapibus vehicula nisi ut, sodales aliquet dui. In ut mi purus. Proin feugiat gravida ex, lobortis iaculis erat interdum eu."
      },
      supplementaryTeaserTwo: {
          teaserTwo: "matrix-asset://api-identifier/63412",
          teaserTwoDescription: ""
      }
    };

    const defaultMockInfo = {
        env: {
            API_IDENTIFIER: 'sample-api',
            BASE_DOMAIN: 'https://example.com',
        },
        fns: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    
    describe('[Error Handling]', () => {
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    BASE_DOMAIN: 'https://example.com',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
                
        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        FB_JSON_URL: 'https://example.com/json',
                        BASE_DOMAIN: 'https://example.com',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        FB_JSON_URL: 'https://example.com/json',
                        API_IDENTIFIER: 'sample-api',
                    },
                },
                fns: mockFnsCtx
            }
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the In the news component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                env: {
                    FB_JSON_URL: 'https://example.com/json',
                    API_IDENTIFIER: 'sample-api',
                    BASE_DOMAIN: 'https://example.com',
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the In the news component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

it('Should throw an error when title is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      headingConfiguration: {
          title: [1,2,3], 
          ctaText: 'Read More',
          ctaUrl: 'https://example.com'
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "title" field must be a string type. The [1,2,3] was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when ctaText is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      headingConfiguration: {
          title: 'Latest News',
          ctaText: { text: 'Read More' }, 
          ctaUrl: 'https://example.com'
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "ctaText" field must be a string type. The {"text":"Read More"} was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when ctaUrl is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      headingConfiguration: {
          title: 'Latest News',
          ctaText: 'Read More',
          ctaUrl: true 
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "ctaUrl" field must be a string type. The true was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when featuredTeaser is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      featuredContent: {
        ...defaultMockData.featuredContent,
          featuredTeaser: [1,2,3],
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredTeaser" field must be a string type. The [1,2,3] was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when personHeadshot is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      featuredContent: {
        ...defaultMockData.featuredContent,
        personHeadshot: { url: 'headshot.jpg' },
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "personHeadshot" field must be a string type. The {"url":"headshot.jpg"} was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when featuredCtaText is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      featuredContent: {
        ...defaultMockData.featuredContent,
          featuredCtaText: true
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredCtaText" field must be a string type. The true was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it.skip('Should throw an error when featuredTeaserDescription is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      featuredContent: {
        ...defaultMockData.featuredContent,
          featuredTeaserDescription: null,
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredTeaserDescription" field must be a string type. The null was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when featuredQuote is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      featuredContent: {
          ...defaultMockData.featuredContent,
          featuredQuote: 12345
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "featuredQuote" field must be a string type. The 12345 was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when teaserOne is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      supplementaryTeaserOne: {
        ...defaultMockData.supplementaryTeaserOne,
        teaserOne: [1,2,3],
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserOne" field must be a string type. The [1,2,3] was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when teaserOneDescription is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      supplementaryTeaserOne: {
        ...defaultMockData.supplementaryTeaserOne,
        teaserOneDescription: { desc: 'Test' }
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserOneDescription" field must be a string type. The {"desc":"Test"} was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when teaserTwo is not a string', async () => {
  const mockData = {
      ...defaultMockData,
      supplementaryTeaserTwo: {
        ...defaultMockData.supplementaryTeaserTwo,
        teaserTwo: [1,2,3],
      }
  };
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserTwo" field must be a string type. The [1,2,3] was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});

it('Should throw an error when teaserTwoDescription is not a string', async () => {
  const mockData = {
    ...defaultMockData,
    supplementaryTeaserTwo: {
      ...defaultMockData.supplementaryTeaserTwo,
      teaserTwoDescription: { desc: 'Test' }
    }
};
  const result = await main(mockData, defaultMockInfo);
  expect(result).toContain('<!-- Error occurred in the In the news component: The "teaserTwoDescription" field must be a string type. The {"desc":"Test"} was received. -->');
  expect(mockedError).toBeCalledTimes(1);
});
    });



    describe('[Main Function]', () => {
        it.skip('Should return the expected HTML with valid data', async () => {

            cardDataAdapter.mockImplementationOnce(() => ({
                getCards: vi.fn().mockResolvedValue([
                  {
                      type: "Video",
                      title: "Remembering Oct. 7 and learning about Israel, Gaza, and the Middle East",
                      liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/remembering-oct.-7-and-learning-about-israel,-gaza,-and-the-middle-east",
                      description: "This is a custom feature desc",
                      imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0022/63364/photo-1460661419201-fd4cecdf8a8b.jpeg",
                      taxonomy: null,
                      taxonomyUrl: null,
                      videoUrl: "Vh-rvUKOOp8",
                      date: "2024-01-01 00:00:00",
                      source: null,
                      authorName: null,
                      authorEmail: null,
                      quote: "A sanctuary, it's a forever thing. And so we want to know not only what's here now, but how it's changing over time.",
                      ctaText: "Read the story on NPR",
                      imageURL: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0020/63353/photo-1461749280684-dccba630e2f6.jpg"
                  },
                  {
                      type: "Book",
                      title: "Researchers illuminate inner workings of new-age soft semiconductors",
                      liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/researchers-illuminate-inner-workings-of-new-age-soft-semiconductors",
                      description: "Teaser 1 custom description",
                      imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0028/63379/squiz-dxp.png",
                      imageAlt: "",
                      taxonomy: null,
                      taxonomyUrl: null,
                      videoUrl: "",
                      date: "2024-01-01 00:00:00",
                      source: null,
                      authorName: null,
                      authorEmail: null
                  },
                  {
                      type: "News",
                      title: "Stanford releases preliminary enrollment data for Class of 2028",
                      liveUrl: "https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/stories/stanford-releases-preliminary-enrollment-data-for-class-of-2028",
                      description: "<p>The class is the first to be admitted under last year's U.S. Supreme Court ruling on college admissions. Stanford will continue and expand outreach activities in support of diversity broadly defined.</p>",
                      imageUrl: "https://canary-us.uat.matrix.squiz.cloud/__data/assets/image/0023/63356/photo-1496171367470-9ed9a91ea931.jpeg",
                      imageAlt: "",
                      taxonomy: null,
                      taxonomyUrl: null,
                      videoUrl: "",
                      date: "2024-01-01 00:00:00",
                      source: null,
                      authorName: null,
                      authorEmail: null
                  }
              ])
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot();
        });
    });
});
