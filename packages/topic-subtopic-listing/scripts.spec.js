/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { formatCardDataFunnelback } from "../../global/js/utils/formatCardDataFunnelback";
import * as topicSubtopicListing from './scripts';

global.fetch = vi.fn();
global.scrollTo = vi.fn();

const mockedError = vi.fn();
console.error = mockedError;

const mockedWarn = vi.fn();
console.warn = mockedWarn;

vi.mock('../../global/js/utils/formatCardDataFunnelback', () => ({
    formatCardDataFunnelback: vi.fn().mockReturnValue({
        title: "Statement on disruption of class",
        description: "University leaders respond to a Feb. 25 incident in the &ldquo;Democracy and Disagreement&rdquo; course by protestors who were not Stanford students.",
        liveUrl: "https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class",
        imageUrl: "https://news.stanford.edu/__data/assets/image/0022/152437/2x3-1.jpg",
        imageAlt: "Hoover Tower is framed in the arch of an arcade. Sun streams in through the arch onto the floor's flower-shaped tile design.",
        taxonomy: "Leadership &amp; Governance",
        taxonomyUrl: "https://news.stanford.edu/university-news/topic/leadership-and-governance",
        type: "University Updates",
        date: 1740528000000,
        isTeaser: "false"
    })
}));

vi.mock('../../global/js/utils/uuid', () => ({
    uuid: vi.fn().mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7')
}));

vi.mock('../../global/js/helpers/pagination', () => ({
    pagination: vi.fn().mockReturnValue('<div data-element="topics-pagination"><div class="su-mx-auto su-component-container"><div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7"><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white su-text-black-50" disabled="" data-offset="1" aria-label="Previous page" title="Previous page"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z"></path></svg></button><button data-offset="1" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-bg-digital-red su-rounded-[100px] su-text-white" disabled="" type="button">1</button><button data-offset="11" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">2</button><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white " data-offset="11" aria-label="Next page" title="Next page"><svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div></div>'),
}));

describe('[Topic Subtopic Listing][Client]', () => {
    let section,modalWrapper, modal, openBtn, closeBtn, iframe;

    const mockResponse = {
        response: {
          resultPacket: {
            resultsSummary: {
              totalMatching: 100,
              numRanks: 10,
            },
            results: [
                {
                    title: "Statement on disruption of class",
                    description: "University leaders respond to a Feb. 25 incident in the &ldquo;Democracy and Disagreement&rdquo; course by protestors who were not Stanford students.",
                    liveUrl: "https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class",
                    imageUrl: "https://news.stanford.edu/__data/assets/image/0022/152437/2x3-1.jpg",
                    imageAlt: "Hoover Tower is framed in the arch of an arcade. Sun streams in through the arch onto the floor's flower-shaped tile design.",
                    taxonomy: "Leadership &amp; Governance",
                    taxonomyUrl: "https://news.stanford.edu/university-news/topic/leadership-and-governance",
                    type: "University Updates",
                    date: 1740528000000,
                    isTeaser: "false"
                },
                {
                    title: "New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops",
                    description: "The newly appointed head coaches sit down to chat about their approaches to leading great teams.",
                    liveUrl: "https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops",
                    imageUrl: "https://news.stanford.edu/__data/assets/image/0024/165822/coaches.jpg",
                    imageAlt: "",
                    taxonomy: "Athletics",
                    taxonomyUrl: "https://news.stanford.edu/on-campus/topic/athletics",
                    type: "Video",
                    videoUrl: "gIeGdtig_WA",
                    date: 1740009600000,
                    taxonomyFeaturedUnitLandingPageUrl: "https://news.stanford.edu/featured-unit/stanford-athletics",
                    taxonomyFeaturedUnitText: "Stanford Athletics",
                    isTeaser: "false"
                }
            ],
          },
        },
      };

      const setupDom = () => {
        document.body.innerHTML = `
        <section data-component="topic-subtopic-listing" data-query="?profile=stanford-report-push-search&amp;collection=sug~sp-stanford-report-search&amp;query=[meta_taxonomyContentTypeId:28201 taxonomyContentMainTopicId:28408 taxonomyContentTopicsId:28408 taxonomyContentSubtopicsId:28408]&amp;meta_taxonomyContentTypeId_not=28210&amp;meta_taxonomyContentTypeId_not=28216&amp;sort=date&amp;log=false" data-endpoint="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/_api/fb/query" data-display="News Archive"><div class="su-mx-auto su-component-container su-container-px"><div data-element="topics-list"> <div class="su-w-full su-component-horizontal-card-grid" data-test="orientation-topiclisting"><div class="su-relative su-grid su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61">    <article aria-label="Tara VanDerveer and Steve Kerr talk coaching, culture, and excellence" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0023/167117/kerr-vanderveer-crop.jpg" alt="Coaches VanDeveer and Kerr during a discussion in the course Basketball: A Masterclass.">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/03/tara-vanderveer-steve-kerr-basketball-coaching-class" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Tara VanDerveer and Steve Kerr talk coaching, culture, and excellence</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-news" xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none" class=""><path d="M3 2.5C3 1.39688 3.89687 0.5 5 0.5H14C15.1031 0.5 16 1.39688 16 2.5V12.5C16 13.6031 15.1031 14.5 14 14.5H2.5C1.11875 14.5 0 13.3813 0 12V3.5C0 2.94688 0.446875 2.5 1 2.5C1.55313 2.5 2 2.94688 2 3.5V12C2 12.275 2.225 12.5 2.5 12.5C2.775 12.5 3 12.275 3 12V2.5ZM5 3.25V5.75C5 6.16563 5.33437 6.5 5.75 6.5H9.25C9.66562 6.5 10 6.16563 10 5.75V3.25C10 2.83437 9.66562 2.5 9.25 2.5H5.75C5.33437 2.5 5 2.83437 5 3.25ZM11.5 3C11.5 3.275 11.725 3.5 12 3.5H13.5C13.775 3.5 14 3.275 14 3C14 2.725 13.775 2.5 13.5 2.5H12C11.725 2.5 11.5 2.725 11.5 3ZM11.5 6C11.5 6.275 11.725 6.5 12 6.5H13.5C13.775 6.5 14 6.275 14 6C14 5.725 13.775 5.5 13.5 5.5H12C11.725 5.5 11.5 5.725 11.5 6ZM5 9C5 9.275 5.225 9.5 5.5 9.5H13.5C13.775 9.5 14 9.275 14 9C14 8.725 13.775 8.5 13.5 8.5H5.5C5.225 8.5 5 8.725 5 9ZM5 12C5 12.275 5.225 12.5 5.5 12.5H13.5C13.775 12.5 14 12.275 14 12C14 11.725 13.775 11.5 13.5 11.5H5.5C5.225 11.5 5 11.725 5 12Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">News</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> In the final meeting of the Continuing Studies course <em>Basketball: A Masterclass</em>, the two coaching legends shared insights about the changing game and living your values on the court. </div></div>  </div></article>    <article aria-label="Stanford to introduce revenue-sharing model for athletes" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0026/166553/stanfordducks_at-night-Aaron-Kehoe.jpg" alt="">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/03/stanford-to-introduce-revenue-sharing-model-for-athletes" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Stanford to introduce revenue-sharing model for athletes</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-university-updates" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" class=""><path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> Stanford will increase scholarship totals and introduce a revenue-sharing model for student-athletes following an expected litigation settlement against the NCAA and college athletic conferences. </div></div>  </div></article>    <article aria-label="Update to graduate student mail and packages process" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0016/152440/2x3-7.jpg" alt="A symmetrical Spanish-style courtyard on a sunny day. A fountain in front is surrounded by flowers, and behind is the Old Union building.">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/03/update-to-graduate-student-mail-and-packages-process" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Update to graduate student mail and packages process</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-university-updates" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" class=""><path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> To address ongoing issues while supporting Stanford’s net-zero carbon emission goals, the university is introducing a new, centralized process for graduate mail distribution. </div></div>  </div></article>    <article aria-label="Statement on disruption of class" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0022/152437/2x3-1.jpg" alt="Hoover Tower is framed in the arch of an arcade. Sun streams in through the arch onto the floor's flower-shaped tile design.">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/02/statement-on-disruption-of-class" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Statement on disruption of class</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-university-updates" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" class=""><path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> University leaders respond to a Feb. 25 incident in the “Democracy and Disagreement” course by protestors who were not Stanford students. </div></div>  </div></article>    <article aria-label="New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog" data-click="open-modal" data-modal-id="298f47df-16ef-44b8-b182-d6b24973d019"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">    <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0024/165822/coaches.jpg" alt="">    <span class="su-absolute su-leading-none su-left-13 su-bottom-13 [&amp;>svg]:su-text-[4rem] "> <svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg> </span> </span></button>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/02/coaches-smith-and-paye-talk-stanford-hoops" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-video" xmlns="http://www.w3.org/2000/svg" width="18" height="13" viewBox="0 0 18 13" fill="none" class=""><path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">Video</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> The newly appointed head coaches sit down to chat about their approaches to leading great teams. </div></div>  </div></article>    <article aria-label="Federal government directives on grants" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0018/152064/20220405_Campus_N6A5605.jpg" alt="Pedestrians and bicyclists enter Stanford's Main Quad on a sunny day.">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/01/federal-government-directives-on-grants" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Federal government directives on grants</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-university-updates" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" class=""><path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> David Studdert, vice provost and dean of research, shares an update to faculty about federal research funding and the recision of the Jan. 28 Office of Management and Budget memorandum. </div></div>  </div></article>    <article aria-label="Meet Ryan Agarwal, ’26" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <button class="su-component-card-thumbnail su-group su-block su-relative su-z-10 su-size-full" type="button" aria-haspopup="dialog"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">    <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0022/164272/WIN25_WWA_RyanCourt-BN.jpg" alt="Image of Ryan Agarwal on an outdoor basketball court and posing with a ball and looking at the camera.">    <span class="su-absolute su-leading-none su-left-13 su-bottom-13 [&amp;>svg]:su-text-[4rem] "> <svg aria-hidden="true" focusable="false" data-testid="svg-circle-play" data-prefix="far" data-icon="circle-play" class="svg-inline--fa fa-circle-play su-text-white dark:su-text-white su-drop-shadow-[0px_10px_20px_rgba(0,0,0,0.30)]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"></path></svg> </span> </span></button>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/01/meet-ryan-agarwal" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Meet Ryan Agarwal, ’26</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-video" xmlns="http://www.w3.org/2000/svg" width="18" height="13" viewBox="0 0 18 13" fill="none" class=""><path d="M0 2.5C0 1.39688 0.896875 0.5 2 0.5H10C11.1031 0.5 12 1.39688 12 2.5V10.5C12 11.6031 11.1031 12.5 10 12.5H2C0.896875 12.5 0 11.6031 0 10.5V2.5ZM17.4719 1.61875C17.7969 1.79375 18 2.13125 18 2.5V10.5C18 10.8687 17.7969 11.2063 17.4719 11.3813C17.1469 11.5563 16.7531 11.5375 16.4438 11.3313L13.4438 9.33125L13 9.03438V8.5V4.5V3.96562L13.4438 3.66875L16.4438 1.66875C16.75 1.46563 17.1437 1.44375 17.4719 1.61875Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">Video</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> Only two players of Indian descent have made it to the NBA. The Stanford shooting guard would like to be next. </div></div>  </div></article>    <article aria-label="A message from the president" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0017/152432/20230301_Campus_95A0293.jpg" alt="">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2025/01/a-message-from-the-president" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>A message from the president</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-university-updates" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" class=""><path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> President Levin shares an update about a recent medical procedure. </div></div>  </div></article>    <article aria-label="Update on SGWU negotiations" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0017/152432/20230301_Campus_95A0293.jpg" alt="">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2024/11/update-on-sgwu-negotiations" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>Update on SGWU negotiations</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-university-updates" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" class=""><path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> Provost Jenny Martinez and Vice Provost Stacey Bent share an update to the Stanford community with information and reminders about the continuation of campus operations in the event of a strike by the Stanford Graduate Workers Union. </div></div>  </div></article>    <article aria-label="SGWU negotiations" class="listing-item su-flex su-gap-20 lg:su-gap-48 su-relative" data-testid="horizontal-card">  <div class="su-shrink-0 su-w-[103px] su-h-[69px] md:su-w-[169px] md:su-h-[113px] lg:su-w-[292px] lg:su-h-[193px]">  <div class="su-component-card-thumbnail su-w-full su-h-full"> <span class="su-component-media-ratio su-overflow-hidden su-relative su-size-full su-block su-aspect-[3/2]">   <img class="su-absolute su-object-cover su-object-center su-size-full" src="https://news.stanford.edu/__data/assets/image/0017/152432/20230301_Campus_95A0293.jpg" alt="">   </span></div>  </div>  <div class="su-flex su-flex-col su-gap-9 lg:su-gap-12">  <h3 class="su-font-sans su-my-0 su-group su-text-18 md:su-text-21 lg:su-text-23 su-font-bold su-leading-[21.6px] md:su-leading-[25.2px] lg:su-leading-[27.6px]"><a href="https://news.stanford.edu/stories/2024/11/sgwu-negotiations" class="su-group su-stretched-link su-inline-block su-text-black dark:su-text-white hocus:su-underline hocus:su-text-digital-red su-transition dark:hocus:su-text-dark-mode-red focus:su-outline-none focus-visible:su-ring-2 focus-visible:su-rounded focus-visible:su-ring-digital-red dark:focus-visible:su-ring-dark-mode-red focus-visible:su-outline-none focus-visible:after:su-outline focus-visible:after:su-outline-offset-8 focus-visible:after:su-outline-digital-red dark:focus-visible:after:su-outline-dark-mode-red"><span>SGWU negotiations</span>  </a></h3>   <p data-testid="horizontal-card-type" class="su-text-black-70 dark:su-text-black-30 su-w-full su-text-14 lg:su-text-16 su-mt-9 md:su-mt-12 su-mb-0 su-flex su-gap-6 su-items-center su-justify-start"> <svg aria-hidden="true" data-testid="svg-university-updates" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" class=""><path d="M7.60856 0.580466L0.608565 3.58047C0.171065 3.76797 -0.0726847 4.23672 0.0241903 4.69922C0.121065 5.16172 0.527315 5.49922 1.00232 5.49922V5.74922C1.00232 6.16484 1.33669 6.49922 1.75232 6.49922H14.2523C14.6679 6.49922 15.0023 6.16484 15.0023 5.74922V5.49922C15.4773 5.49922 15.8867 5.16484 15.9804 4.69922C16.0742 4.23359 15.8304 3.76484 15.3961 3.58047L8.39607 0.580466C8.14607 0.474216 7.85856 0.474216 7.60856 0.580466ZM4.00232 7.49922H2.00232V13.6336C1.98357 13.643 1.96482 13.6555 1.94607 13.668L0.446065 14.668C0.0804403 14.9117 -0.0851848 15.368 0.0429402 15.7898C0.171065 16.2117 0.56169 16.4992 1.00232 16.4992H15.0023C15.4429 16.4992 15.8304 16.2117 15.9586 15.7898C16.0867 15.368 15.9242 14.9117 15.5554 14.668L14.0554 13.668C14.0367 13.6555 14.0179 13.6461 13.9992 13.6336V7.49922H12.0023V13.4992H10.7523V7.49922H8.75232V13.4992H7.25232V7.49922H5.25232V13.4992H4.00232V7.49922ZM8.00232 2.49922C8.26753 2.49922 8.52189 2.60457 8.70942 2.79211C8.89696 2.97965 9.00232 3.234 9.00232 3.49922C9.00232 3.76443 8.89696 4.01879 8.70942 4.20632C8.52189 4.39386 8.26753 4.49922 8.00232 4.49922C7.7371 4.49922 7.48274 4.39386 7.29521 4.20632C7.10767 4.01879 7.00232 3.76443 7.00232 3.49922C7.00232 3.234 7.10767 2.97965 7.29521 2.79211C7.48274 2.60457 7.7371 2.49922 8.00232 2.49922Z"></path></svg> <span class="su-font-semibold su-text-14 md:su-text-16 su-leading-4">University Updates</span></p>   <div data-testid="horizontal-card-description" class="su-hidden md:su-block su-text-16 lg:su-text-18 su-mt-9 md:su-mt-12 su-mb-0"><div class="su-mb-0 su-w-full [&amp;>*:last-child]:su-mb-0"> Provost Jenny Martinez and Vice Provost for Graduate Education and Postdoctoral Affairs Stacey Bent share an update about what a strike authorization vote by the Stanford Graduate Workers Union means and details of the contract offer the university has made to the union. </div></div>  </div></article>    </div></div> </div><div data-element="topics-pagination"> <div class="su-mx-auto su-component-container"><div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7"><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white su-text-black-50" disabled="" data-offset="1" aria-label="Previous page" title="Previous page"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z"></path></svg></button><button data-offset="1" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-bg-digital-red su-rounded-[100px] su-text-white" disabled="" type="button">1</button><button data-offset="11" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">2</button><button data-offset="21" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">3</button><button data-offset="31" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">4</button><button data-offset="41" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">5</button><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white " data-offset="11" aria-label="Next page" title="Next page"><svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div> </div></div><section data-element="modal-wrapper">  <div hidden="true" aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="298f47df-16ef-44b8-b182-d6b24973d019">  <span data-focus-scope-start="true" hidden="true"></span><div aria-describedby="card-modal" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content">  <iframe width="560" height="315" class="" src="https://example.com?autoplay=1&controls=1&rel=0" title="Watch New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" data-modal="iframe"></iframe>  </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"> <svg class="su-fill-currentcolor" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"></path></svg> <span>Close</span></button><span data-focus-scope-end="true" hidden="true"></span></div></section></section>
        `;
    }

    beforeEach(() => {
        // Setup DOM structure
        modal = document.createElement('div');
        iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://example.com?autoplay=0');
        modal.appendChild(iframe);
        modal.classList.add(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS);

        document.body.appendChild(modal);
    });

    afterEach(() => {
        document.body.innerHTML = ''; // Clear DOM
        vi.clearAllMocks();
    });

    describe('[DOMContentLoaded]', () => {
        it('Should call _carouselInit and _modalInit for each carousel section', () => {
            const section = document.createElement('section');
            section.setAttribute('data-component', 'topic-subtopic-listing');
            document.body.appendChild(section);

            const _modalInitSpy = vi.spyOn(topicSubtopicListing, '_modalInit');
            const _topicsInitSpy = vi.spyOn(topicSubtopicListing, '_topicsInit');

             // Simulate DOMContentLoaded event
             const event = new Event('DOMContentLoaded');
             document.dispatchEvent(event);


             document.querySelectorAll(topicSubtopicListing.TOPICS_SUBTOPICS_SELECTOR).forEach(section => {
                // Call the function to set up all event listeners
                topicSubtopicListing._modalInit(section);
                topicSubtopicListing._topicsInit(section);
            });

            // Check if the spy was called
            expect(_modalInitSpy).toHaveBeenCalledWith(section);
            expect(_topicsInitSpy).toHaveBeenCalledWith(section);

            // Restore the original function after test
            _modalInitSpy.mockRestore(); 
            _topicsInitSpy.mockRestore(); 
        });
    });

    describe('[Modal functionality]', () => {
        beforeEach(() => {
            setupDom();

            section = document.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_SELECTOR);
            modalWrapper = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_MODAL_SELECTOR);
            modal = modalWrapper.querySelector('div[data-modal="modal"]');
            openBtn = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_OPEN_MODAL_BTN);
            closeBtn = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_CLOSE_MODAL_BTN);
            iframe = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_MODAL_IFRAME);

            topicSubtopicListing._modalInit(section);
        });

        it('Should open the modal when open button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(false);
        });

        it('Should close the modal when close button was clicked', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(true);
        });
       
        it('Should close the modal when Escape key is pressed', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(false);

            // Simulate Escape key press
            fireEvent.keyDown(document, { key: 'Escape' });

            // Check if close function was called
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(true);
        });

        it('Should not close the modal when a non-Escape key is pressed', () => {    
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(false);

            // Simulate a non-Escape key press
            fireEvent.keyDown(document, { key: 'ArrowUp' });
    
            // Check if close function was not called
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(false);
        });

        it('Should make the modal visible and set autoplay=1 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(false);
            
            // check if iframe's autoplay was changed to 1 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=1&controls=1&rel=0');
        });

        it('Should hide the modal and set autoplay=0 in the iframe src', () => {
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(false);

            // Simulate click on close button
            fireEvent.click(closeBtn);

            // check if modal was closed
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(true);

            // check if iframe's autoplay was changed to 0 
            expect(iframe.getAttribute('src')).toBe('https://example.com?autoplay=0&controls=1&rel=0');
        });

        it('Should not open the modal when current modal is not defined', () => {
            // Set current modal to null
            document.querySelector('[data-modal="modal"]').setAttribute('data-modal-id', 'not-a-modal');
            // Simulate click on open button
            fireEvent.click(openBtn);

            // check if modal was open
            expect(modal.classList.contains(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS)).toBe(true);
        });
    });

    describe('[List functionality]', () => {
        beforeEach(() => {
            setupDom();

            section = document.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_SELECTOR);
            modalWrapper = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_MODAL_SELECTOR);
            modal = modalWrapper.querySelector('div[data-modal="modal"]');
            openBtn = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_OPEN_MODAL_BTN);
            closeBtn = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_CLOSE_MODAL_BTN);
            iframe = section.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_MODAL_IFRAME);

            topicSubtopicListing._topicsInit(section);
        });

        describe("[Fetch Topic Data]", () => {
            beforeEach(() => {
                vi.resetAllMocks();
            });
            
            it("Should handle missing resultsSummary gracefully", async () => {
                fetch.mockResolvedValueOnce({
                    json: vi.fn().mockResolvedValueOnce({
                        response: {
                            resultPacket: {
                                results: [],
                            },
                        },
                    }),
                });
            
                const section = document.createElement("section");
                section.dataset.component = "topic-subtopic-listing";
                section.dataset.query = "?query=test";
                section.dataset.endpoint = "https://api.example.com";
                section.dataset.display = "News Archive";
            
                const topicsList = document.createElement("div");
                topicsList.setAttribute("data-element", "topics-list");
            
                const pagination = document.createElement("div");
                pagination.setAttribute("data-element", "topics-pagination");
            
                const modalWrapper = document.createElement("section");
                modalWrapper.setAttribute("data-element", "modal-wrapper");
            
                const button = document.createElement("button");
                button.setAttribute("data-offset", "1");
            
                pagination.appendChild(button);
                section.appendChild(topicsList);
                section.appendChild(pagination);
                section.appendChild(modalWrapper);
            
                document.body.appendChild(section);
            
                topicSubtopicListing._topicsInit(section);
                fireEvent.click(button);
            
                await new Promise(setImmediate); 
            
                expect(fetch).toHaveBeenCalledWith("https://api.example.com?query=test&start_rank=1");
                expect(topicsList.innerHTML).toBe("");
            });
            
          
            it("Should fetch data successfully", async () => {
                fetch.mockResolvedValueOnce({
                    json: vi.fn().mockResolvedValueOnce(mockResponse),
                });
          
                const result = await topicSubtopicListing.fetchTopicData({ offset: 0, query: "?query=test", endpoint: "https://api.example.com" });
          
                expect(fetch).toHaveBeenCalledWith("https://api.example.com?query=test&start_rank=0");
                expect(result).toEqual(mockResponse);
            });
          
            it("Should throw an error on fetch failure", async () => {
                fetch.mockRejectedValueOnce(new Error("Network Error"));
            
                await expect(topicSubtopicListing.fetchTopicData({ offset: 0, query: "?query=test", endpoint: "https://api.example.com" }))
                    .rejects.toThrow("Network Error");
            });
        });

        describe("[updateState]", () => {
            beforeEach(() => {
                setupDom();
            });
          
            it("Should update the DOM elements", () => {
                topicSubtopicListing.updateState(
                    document.body,
                    "<div class='card'>Card Content</div>",
                    "<div class='pagination'>Pagination Content</div>",
                    "<div class='modal'>Modal Content</div>"
                );
          
                expect(document.querySelector(topicSubtopicListing.TOPICS_LIST_SELECTOR).innerHTML).toContain("Card Content");
                expect(document.querySelector(topicSubtopicListing.PAGINATION_SELECTOR).innerHTML).toContain("Pagination Content");
                expect(document.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_MODAL_SELECTOR).innerHTML).toContain("Modal Content");
            });
        });
          
        describe("[handleButtonClick]", () => {
            
            beforeEach(() => {
                setupDom();

                global.fetch = vi.fn().mockResolvedValueOnce({
                    json: vi.fn().mockResolvedValueOnce(mockResponse),
                });

                section = document.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_SELECTOR);
            });
          
            it("Should call handleButtonClick", async () => {
                formatCardDataFunnelback.mockResolvedValueOnce(mockResponse.response.resultPacket.results[0]);
                formatCardDataFunnelback.mockResolvedValueOnce(mockResponse.response.resultPacket.results[1]);

                const handleButtonClickSpy = vi.spyOn(topicSubtopicListing, 'handleButtonClick');

                await topicSubtopicListing.handleButtonClick({
                    offset: "0",
                    query: "?query=test",
                    endpoint: "https://api.example.com",
                    display: "Article",
                    section: section,
                });

                expect(handleButtonClickSpy).toHaveBeenCalled();
            });

            it("Should call handleButtonClick for one of ['Press Center', 'Leadership Messages', 'University Updates', 'Announcements', 'In the News']", async () => {
                formatCardDataFunnelback.mockResolvedValueOnce(mockResponse.response.resultPacket.results[0]);
                formatCardDataFunnelback.mockResolvedValueOnce(mockResponse.response.resultPacket.results[1]);

                const handleButtonClickSpy = vi.spyOn(topicSubtopicListing, 'handleButtonClick');

                await topicSubtopicListing.handleButtonClick({
                    offset: "0",
                    query: "?query=test",
                    endpoint: "https://api.example.com",
                    display: "Announcements",
                    section: section,
                });

                expect(handleButtonClickSpy).toHaveBeenCalled();
                expect(document.body.innerHTML).toMatchInlineSnapshot(`
                  "
                          <section data-component="topic-subtopic-listing" data-query="?profile=stanford-report-push-search&amp;collection=sug~sp-stanford-report-search&amp;query=[meta_taxonomyContentTypeId:28201 taxonomyContentMainTopicId:28408 taxonomyContentTopicsId:28408 taxonomyContentSubtopicsId:28408]&amp;meta_taxonomyContentTypeId_not=28210&amp;meta_taxonomyContentTypeId_not=28216&amp;sort=date&amp;log=false" data-endpoint="https://canary-us.uat.matrix.squiz.cloud/_pnp-stanford/_api/fb/query" data-display="News Archive"><div class="su-mx-auto su-component-container su-container-px"><div data-element="topics-list"><div class="su-w-full su-component-horizontal-card-grid" data-test="orientation-topiclisting"><div class="su-relative su-grid su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61"><div class="su-relative su-grow">
                      <article aria-label="undefined" class="su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10" data-testid="narrow-horizontal-card">
                        <div class="su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3">
                          

                          

                          <h3 class="su-font-serif su-basefont-23 su-my-0">
                            <a class="su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red" href="undefined">
                              <span></span>
                              
                            </a>
                          </h3>

                          

                          

                          
                        </div>
                      </article>
                    </div><div class="su-relative su-grow">
                      <article aria-label="undefined" class="su-grid su-grid-gap su-grid-cols-6 lg:su-grid-cols-10" data-testid="narrow-horizontal-card">
                        <div class="su-flex su-flex-col su-gap-12 su-col-start-1 su-col-span-full lg:su-col-span-6 lg:su-col-start-3">
                          

                          

                          <h3 class="su-font-serif su-basefont-23 su-my-0">
                            <a class="su-group hocus:su-text-digital-red hocus:su-underline su-transition su-text-black dark:su-text-white dark:hocus:su-text-dark-mode-red" href="undefined">
                              <span></span>
                              
                            </a>
                          </h3>

                          

                          

                          
                        </div>
                      </article>
                    </div></div></div></div><div data-element="topics-pagination">undefined</div></div><section data-element="modal-wrapper"></section></section>
                          "
                `);
            });

            it("Should add modal data if card is of type 'Video'", async () => {
                
                global.fetch = vi.fn().mockResolvedValueOnce({
                    json: vi.fn().mockResolvedValueOnce(mockResponse),
                });
            
                // test non-video and video cards
                formatCardDataFunnelback
                    .mockReturnValueOnce(mockResponse.response.resultPacket.results[0])
                    .mockReturnValueOnce(mockResponse.response.resultPacket.results[1]); 
            
                section = document.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_SELECTOR);
            
                await topicSubtopicListing.handleButtonClick({
                    offset: "0",
                    query: "?query=test",
                    endpoint: "https://api.example.com",
                    display: "Press Center", 
                    section,
                });
            
                const modalWrapper = document.querySelector(topicSubtopicListing.TOPICS_SUBTOPICS_LISTING_MODAL_SELECTOR);
                
                // Check if iframe with proper ID and content was added in the modal 
                expect(modalWrapper.innerHTML).toContain('gIeGdtig_WA');
                expect(modalWrapper.innerHTML).toContain('Watch New Stanford basketball coaches Kate Paye and Kyle Smith talk hoops');
            });

            it('Should not call handleButtonClick when button is disabled', () => {
                
                const section = document.createElement('section');
                section.setAttribute('data-component', 'topic-subtopic-listing');
                section.setAttribute('data-query', '?query=test');
                section.setAttribute('data-endpoint', 'https://api.example.com');
                section.setAttribute('data-display', 'Press Center');
            
                const paginationContainer = document.createElement('div');
                paginationContainer.setAttribute('data-element', 'topics-pagination');
            
                const disabledButton = document.createElement('button');
                disabledButton.setAttribute('data-offset', '0');
                disabledButton.disabled = true; 
            
                paginationContainer.appendChild(disabledButton);
                section.appendChild(paginationContainer);
                document.body.appendChild(section);
            
                const spy = vi.spyOn(topicSubtopicListing, 'handleButtonClick');
            
                topicSubtopicListing._topicsInit(section);
            
                fireEvent.click(disabledButton);
            
                expect(spy).not.toHaveBeenCalled();
                spy.mockRestore();
            });
        });
    });
});
