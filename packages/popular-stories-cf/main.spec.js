import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchAdapter } from '../../global/js/utils/fetchAdapter';
import { popularStoriesFetcher } from './scripts/popularStoriesHelpers';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils/fetchAdapter', () => ({
    FetchAdapter: vi.fn().mockImplementation(() => ({
        request: vi.fn(),
        assets: vi.fn(),
        data: vi.fn(),
        fetch: vi.fn().mockResolvedValue(
            {
                "data": {
                    "viewer": {
                        "zones": [
                            {
                                "httpRequestsAdaptiveGroups": [
                                    {
                                        "count": 58043,
                                        "dimensions": {
                                            "clientRequestHTTPHost": "news.stanford.edu",
                                            "clientRequestPath": "/stories/2014/03/too-much-homework-031014"
                                        }
                                    },
                                    {
                                        "count": 56858,
                                        "dimensions": {
                                            "clientRequestHTTPHost": "news.stanford.edu",
                                            "clientRequestPath": "/stories/2024/06/stanford-explainer-crispr-gene-editing-and-beyond"
                                        }
                                    },
                                    {
                                        "count": 47335,
                                        "dimensions": {
                                            "clientRequestHTTPHost": "news.stanford.edu",
                                            "clientRequestPath": "/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air"
                                        }
                                    },
                                    {
                                        "count": 46737,
                                        "dimensions": {
                                            "clientRequestHTTPHost": "news.stanford.edu",
                                            "clientRequestPath": "/stories/2019/08/the-power-of-language-how-words-shape-people-culture"
                                        }
                                    },
                                    {
                                        "count": 45228,
                                        "dimensions": {
                                            "clientRequestHTTPHost": "news.stanford.edu",
                                            "clientRequestPath": "/stories/2005/06/youve-got-find-love-jobs-says"
                                        }
                                    },
                                    {
                                        "count": 42936,
                                        "dimensions": {
                                            "clientRequestHTTPHost": "news.stanford.edu",
                                            "clientRequestPath": "/stories/2025/03/microlightning-in-water-droplets-may-have-sparked-life-on-earth"
                                        }
                                    },
                                    {
                                        "count": 35231,
                                        "dimensions": {
                                            "clientRequestHTTPHost": "news.stanford.edu",
                                            "clientRequestPath": "/stories/2024/02/technology-in-education"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                "errors": null
            }
        )
    }))
}));

vi.mock('./scripts/popularStoriesHelpers.js', () => ({
    popularStoriesFetcher: vi.fn().mockResolvedValue([
        {
            "rank": 1,
            "score": 1000,
            "title": "Research reveals women take ‘substantial’ earnings hit during menopause",
            "collection": "sug~ds-stanford-report-push",
            "component": 5,
            "collapsed": null,
            "liveUrl": "https://news.stanford.edu/stories/2025/03/menopause-earnings-economics-study",
            "summary": "According to a new study from Stanford economist Petra Person, women who visit a health care provider with menopause-related symptoms are earning 10% less four years later.",
            "allSummaryText": null,
            "cacheUrl": "/s/cache?collection=sug~ds-stanford-report-push&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study&profile=stanford-report-push-search",
            "date": 1742774400000,
            "fileSize": 15504,
            "fileType": "xml",
            "tier": 1,
            "docNum": 7071,
            "exploreLink": null,
            "kmFromOrigin": null,
            "listMetadata": {
                "taxonomyFeaturedUnitText": [
                    "Stanford Institute for Economic Policy Research"
                ],
                "isTeaser": [
                    "false"
                ],
                "taxonomyContentSubtopicsId": [
                    "[]"
                ],
                "taxonomyAudienceId": [
                    "[\"28166\",\"28167\",\"28168\"]"
                ],
                "taxonomyContentMainTopicLandingPageUrl": [
                    "https://news.stanford.edu/research-and-scholarship/topic/health-and-medicine"
                ],
                "shortTitle": [
                    "Research reveals women take ‘substantial’ earnings hit during menopause"
                ],
                "taxonomyLegacyStoryType": [
                    "null"
                ],
                "descriptionPlain": [
                    "According to a new study from Stanford economist Petra Person, women who visit a health care provider with menopause-related symptoms are earning 10% less four years later."
                ],
                "imageAlt": [
                    "Headshot of Petra Person"
                ],
                "taxonomyContentMainTopicId": [
                    "28404"
                ],
                "pressCenter": [
                    "false"
                ],
                "taxonomyContentCategoryId": [
                    "28172"
                ],
                "taxonomyLandingPageId": [
                    "null"
                ],
                "publishToMobile": [
                    "true"
                ],
                "mainTopic": [
                    "Health & Medicine"
                ],
                "id": [
                    "167334"
                ],
                "assetHref": [
                    "https://news.stanford.edu/stories/2025/03/menopause-earnings-economics-study"
                ],
                "taxonomyContentTopicsId": [
                    "[]"
                ],
                "taxonomyLegacyTopicsId": [
                    "null"
                ],
                "taxonomyContentTypeId": [
                    "28193"
                ],
                "image": [
                    "https://news.stanford.edu/__data/assets/image/0026/167345/Petra-Person.jpg"
                ],
                "c": [
                    "<p>According to a new study from Stanford economist Petra Person, women who visit a health care provider with menopause-related symptoms are earning 10% less four years later.</p>"
                ],
                "taxonomyFeaturedUnitLandingPageUrl": [
                    "https://news.stanford.edu/featured-unit/stanford-institute-for-economic-policy-research"
                ],
                "d": [
                    "2025-03-24T00:00:00-07:00"
                ],
                "seoDescription": [
                    "According to a new study from Stanford economist Petra Person, women who visit a health care provider with menopause-related symptoms are earning 10% less four years later.."
                ],
                "taxonomyFeaturedUnitId": [
                    "28352"
                ],
                "taxonomyAudienceText": [
                    "External,Faculty/staff,Student"
                ],
                "taxonomyLegacyContentPartnerId": [
                    "null"
                ],
                "taxonomyMessageText": [
                    "Research enterprise"
                ],
                "t": [
                    "Research reveals women take ‘substantial’ earnings hit during menopause"
                ],
                "excludeFromIndex": [
                    "false"
                ],
                "taxonomyContentTypeText": [
                    "Research"
                ],
                "taxonomyContentMainTopicText": [
                    "Health &amp; Medicine"
                ],
                "taxonomyMessageId": [
                    "[\"28181\"]"
                ],
                "assetTypeCode": [
                    "page_content"
                ],
                "category": [
                    "Research & Scholarship"
                ],
                "teaserPlain": [
                    "According to a new study from Stanford economist Petra Person, women who visit a health care provider with menopause-related symptoms are earning 10% less four years later."
                ],
                "taxonomyContentCategoryText": [
                    "Research &amp; Scholarship"
                ],
                "teaser": [
                    "<p>According to a new study from Stanford economist Petra Person, women who visit a health care provider with menopause-related symptoms are earning 10% less four years later.</p>"
                ],
                "longTitle": [
                    "Research reveals women take ‘substantial’ earnings hit during menopause"
                ]
            },
            "tags": [],
            "quickLinks": null,
            "displayUrl": "https://news.stanford.edu/stories/2025/03/menopause-earnings-economics-study",
            "clickTrackingUrl": "/s/redirect?collection=sug~sp-stanford-report-search&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study&auth=cHiv9sCyeX79M%2BYJjLeS9A&profile=stanford-report-push-search&rank=1&query=%5BassetHref%3A%22%2Fstories%2F2014%2F03%2Ftoo-much-homework-031014%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fstanford-explainer-crispr-gene-editing-and-beyond%22+assetHref%3A%22%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fthe-power-of-language-how-words-shape-people-culture%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fyouve-got-find-love-jobs-says%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmicrolightning-in-water-droplets-may-have-sparked-life-on-earth%22+assetHref%3A%22%2Fstories%2F2024%2F02%2Ftechnology-in-education%22+assetHref%3A%22%2Fstories%2F2022%2F01%2Fknow-gen-z%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fhybrid-work-is-a-win-win-win-for-companies-workers%22+assetHref%3A%22%2Fstories%2F2024%2F07%2FA-12-campus-art-walks-to-take-this-summer%22+assetHref%3A%22%2Fstories%2F2020%2F07%2Fmeaning-declaration-independence-changed-time%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study%22+assetHref%3A%22%2Fstories%2F2023%2F04%2Ftechnology-might-be-making-education-worse%22+assetHref%3A%22%2Fstories%2F2010%2F09%2Fnaimark-stalin-genocide-092310%22+assetHref%3A%22%2Fstories%2F2024%2F01%2Feight-simple-meaningful-eco-friendly-actions-can-incorporate-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert%22+assetHref%3A%22%2Fstories%2F2021%2F09%2Fmindsets-clearing-lens-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fsix-big-ideas-united-states-electricity-crisis-report%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fsteve-jobs-2005-graduates-stay-hungry-stay-foolish%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fgregory-walton-ordinary-magic-psychology-studies%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fmeet-our-faculty-tadashi-tokieda%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions%22+assetHref%3A%22%2Fstories%2F2021%2F02%2Ffour-causes-zoom-fatigue-solutions%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fblending-disciplines-for-a-more-colorful-world%22+assetHref%3A%22%2Fstories%2F2024%2F10%2Fphilip-zimbardo-the-psychologist-behind-stanford-prison-experiment-dies-at-age-91%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fonline-dating-popular-way-u-s-couples-meet%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Ffood-research-stanford-sustainability-agriculture-aquaculture%22%5D+-taxonomyContentTypeId%3A28201+-taxonomyContentTypeId%3A28216+-taxonomyContentTypeId%3A28210+d%3E15Oct2024",
            "explain": null,
            "indexUrl": "https://news.stanford.edu/stories/2025/03/menopause-earnings-economics-study",
            "gscopesSet": [
                "news",
                "mobile",
                "allnews",
                "topicinstitutional",
                "pushnews"
            ],
            "customData": {},
            "relatedDocuments": {},
            "documentVisibleToUser": true,
            "promoted": false,
            "diversified": false
        },
        {
            "rank": 2,
            "score": 697,
            "title": "‘It really is the holy grail of curative medicine’",
            "collection": "sug~ds-stanford-report-push",
            "component": 5,
            "collapsed": null,
            "liveUrl": "https://news.stanford.edu/stories/2025/04/mark-skylar-scott-on-3d-printing-human-organs",
            "summary": "Stanford bioengineer Mark Skylar-Scott on his “science fiction” quest to 3D print human hearts and other organs on demand, using cells from a patient’s own body.",
            "allSummaryText": null,
            "cacheUrl": "/s/cache?collection=sug~ds-stanford-report-push&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs&profile=stanford-report-push-search",
            "date": 1743638400000,
            "fileSize": 14479,
            "fileType": "xml",
            "tier": 1,
            "docNum": 7116,
            "exploreLink": null,
            "kmFromOrigin": null,
            "listMetadata": {
                "taxonomyContentSubtopicsText": [
                    "Bioengineering"
                ],
                "isTeaser": [
                    "false"
                ],
                "taxonomyContentSubtopicsId": [
                    "[\"28578\"]"
                ],
                "taxonomyAudienceId": [
                    "[\"28166\",\"28167\",\"28168\"]"
                ],
                "taxonomyContentMainTopicLandingPageUrl": [
                    "https://news.stanford.edu/research-and-scholarship/topic/research-matters"
                ],
                "shortTitle": [
                    "‘It really is the holy grail of curative medicine’"
                ],
                "taxonomyLegacyStoryType": [
                    "null"
                ],
                "descriptionPlain": [
                    "Stanford bioengineer Mark Skylar-Scott on his &ldquo;science fiction&rdquo; quest to 3D print human hearts and other organs on demand, using cells from a patient&rsquo;s own body."
                ],
                "imageAlt": [
                    "Profile photo of Mark Skylar-Scott in his lab."
                ],
                "taxonomyContentMainTopicId": [
                    "167508"
                ],
                "pressCenter": [
                    "false"
                ],
                "taxonomyContentCategoryId": [
                    "28172"
                ],
                "taxonomyLandingPageId": [
                    "null"
                ],
                "publishToMobile": [
                    "true"
                ],
                "taxonomyContentTopicsText": [
                    "Science &amp; Engineering,Health &amp; Medicine"
                ],
                "mainTopic": [
                    "Research Matters"
                ],
                "id": [
                    "167067"
                ],
                "assetHref": [
                    "https://news.stanford.edu/stories/2025/04/mark-skylar-scott-on-3d-printing-human-organs"
                ],
                "taxonomyContentTopicsId": [
                    "[\"28406\",\"28404\"]"
                ],
                "subtopic": [
                    "Bioengineering"
                ],
                "taxonomyLegacyTopicsId": [
                    "null"
                ],
                "taxonomyContentTypeId": [
                    "28194"
                ],
                "image": [
                    "https://news.stanford.edu/__data/assets/image/0029/167069/20250313Mark-Skylar-Scott.jpg"
                ],
                "taxonomyAdditionalFeaturedUnitIds": [
                    "[]"
                ],
                "c": [
                    "<p>Stanford bioengineer Mark Skylar-Scott on his &ldquo;science fiction&rdquo; quest to 3D print human hearts and other organs on demand, using cells from a patient&rsquo;s own body.</p>"
                ],
                "d": [
                    "2025-04-03T00:00:00-07:00"
                ],
                "seoDescription": [
                    "Stanford bioengineer Mark Skylar-Scott on his &ldquo;science fiction&rdquo; quest to 3D print human hearts and other organs on demand, using cells from a patient’s own body.."
                ],
                "taxonomyAudienceText": [
                    "External,Faculty/staff,Student"
                ],
                "taxonomyLegacyContentPartnerId": [
                    "null"
                ],
                "t": [
                    "‘It really is the holy grail of curative medicine’"
                ],
                "excludeFromIndex": [
                    "false"
                ],
                "taxonomyContentTypeText": [
                    "Profile"
                ],
                "taxonomyContentMainTopicText": [
                    "Research Matters"
                ],
                "taxonomyMessageId": [
                    "[]"
                ],
                "topic": [
                    "Science & Engineering",
                    "Health & Medicine"
                ],
                "assetTypeCode": [
                    "page_content"
                ],
                "category": [
                    "Research & Scholarship"
                ],
                "teaserPlain": [
                    "Stanford bioengineer Mark Skylar-Scott on his &ldquo;science fiction&rdquo; quest to 3D print human hearts and other organs on demand, using cells from a patient&rsquo;s own body."
                ],
                "taxonomyContentCategoryText": [
                    "Research &amp; Scholarship"
                ],
                "teaser": [
                    "<p>Stanford bioengineer Mark Skylar-Scott on his &ldquo;science fiction&rdquo; quest to 3D print human hearts and other organs on demand, using cells from a patient’s own body.</p>"
                ],
                "longTitle": [
                    "‘It really is the holy grail of curative medicine’"
                ]
            },
            "tags": [],
            "quickLinks": null,
            "displayUrl": "https://news.stanford.edu/stories/2025/04/mark-skylar-scott-on-3d-printing-human-organs",
            "clickTrackingUrl": "/s/redirect?collection=sug~sp-stanford-report-search&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs&auth=tb7YXLpOGPr3OG8kN48Mrw&profile=stanford-report-push-search&rank=2&query=%5BassetHref%3A%22%2Fstories%2F2014%2F03%2Ftoo-much-homework-031014%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fstanford-explainer-crispr-gene-editing-and-beyond%22+assetHref%3A%22%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fthe-power-of-language-how-words-shape-people-culture%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fyouve-got-find-love-jobs-says%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmicrolightning-in-water-droplets-may-have-sparked-life-on-earth%22+assetHref%3A%22%2Fstories%2F2024%2F02%2Ftechnology-in-education%22+assetHref%3A%22%2Fstories%2F2022%2F01%2Fknow-gen-z%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fhybrid-work-is-a-win-win-win-for-companies-workers%22+assetHref%3A%22%2Fstories%2F2024%2F07%2FA-12-campus-art-walks-to-take-this-summer%22+assetHref%3A%22%2Fstories%2F2020%2F07%2Fmeaning-declaration-independence-changed-time%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study%22+assetHref%3A%22%2Fstories%2F2023%2F04%2Ftechnology-might-be-making-education-worse%22+assetHref%3A%22%2Fstories%2F2010%2F09%2Fnaimark-stalin-genocide-092310%22+assetHref%3A%22%2Fstories%2F2024%2F01%2Feight-simple-meaningful-eco-friendly-actions-can-incorporate-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert%22+assetHref%3A%22%2Fstories%2F2021%2F09%2Fmindsets-clearing-lens-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fsix-big-ideas-united-states-electricity-crisis-report%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fsteve-jobs-2005-graduates-stay-hungry-stay-foolish%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fgregory-walton-ordinary-magic-psychology-studies%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fmeet-our-faculty-tadashi-tokieda%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions%22+assetHref%3A%22%2Fstories%2F2021%2F02%2Ffour-causes-zoom-fatigue-solutions%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fblending-disciplines-for-a-more-colorful-world%22+assetHref%3A%22%2Fstories%2F2024%2F10%2Fphilip-zimbardo-the-psychologist-behind-stanford-prison-experiment-dies-at-age-91%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fonline-dating-popular-way-u-s-couples-meet%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Ffood-research-stanford-sustainability-agriculture-aquaculture%22%5D+-taxonomyContentTypeId%3A28201+-taxonomyContentTypeId%3A28216+-taxonomyContentTypeId%3A28210+d%3E15Oct2024",
            "explain": null,
            "indexUrl": "https://news.stanford.edu/stories/2025/04/mark-skylar-scott-on-3d-printing-human-organs",
            "gscopesSet": [
                "news",
                "topicscienceengineering",
                "mobile",
                "allnews",
                "topicinstitutional",
                "pushnews",
                "topichealthmedicine"
            ],
            "customData": {},
            "relatedDocuments": {},
            "documentVisibleToUser": true,
            "promoted": false,
            "diversified": true
        },
        {
            "rank": 3,
            "score": 531,
            "title": "Why is social connection so hard for Gen Z?",
            "collection": "sug~ds-stanford-report-push",
            "component": 5,
            "collapsed": null,
            "liveUrl": "https://news.stanford.edu/stories/2025/03/social-connections-gen-z-research-jamil-zaki",
            "summary": "Young adults crave closeness, says Stanford psychologist Jamil Zaki, but misjudge how much their peers want that, too. His research found strategies that can help nudge people to take a chance on one another.",
            "allSummaryText": null,
            "cacheUrl": "/s/cache?collection=sug~ds-stanford-report-push&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki&profile=stanford-report-push-search",
            "date": 1742428800000,
            "fileSize": 16519,
            "fileType": "xml",
            "tier": 1,
            "docNum": 7056,
            "exploreLink": null,
            "kmFromOrigin": null,
            "listMetadata": {
                "taxonomyFeaturedUnitText": [
                    "Stanford School of Humanities &amp; Sciences"
                ],
                "isTeaser": [
                    "false"
                ],
                "taxonomyContentSubtopicsId": [
                    "[]"
                ],
                "taxonomyAudienceId": [
                    "[\"28166\",\"28167\",\"28168\"]"
                ],
                "taxonomyContentMainTopicLandingPageUrl": [
                    "https://news.stanford.edu/research-and-scholarship/topic/social-sciences"
                ],
                "shortTitle": [
                    "Why is social connection so hard for Gen Z?"
                ],
                "taxonomyLegacyStoryType": [
                    "null"
                ],
                "descriptionPlain": [
                    "Young adults crave closeness, says Stanford psychologist Jamil Zaki, but misjudge how much their peers want that, too. His research found strategies that can help nudge people to take a chance on one another."
                ],
                "imageAlt": [
                    "Profile photo of Jamil Zaki on the Stanford campus."
                ],
                "taxonomyContentMainTopicId": [
                    "28407"
                ],
                "pressCenter": [
                    "false"
                ],
                "taxonomyContentCategoryId": [
                    "28172"
                ],
                "taxonomyLandingPageId": [
                    "null"
                ],
                "publishToMobile": [
                    "true"
                ],
                "taxonomyContentTopicsText": [
                    "Communication,Psychology"
                ],
                "mainTopic": [
                    "Social Sciences"
                ],
                "id": [
                    "167085"
                ],
                "assetHref": [
                    "https://news.stanford.edu/stories/2025/03/social-connections-gen-z-research-jamil-zaki"
                ],
                "taxonomyContentTopicsId": [
                    "[\"28592\",\"28588\"]"
                ],
                "taxonomyLegacyTopicsId": [
                    "null"
                ],
                "taxonomyContentTypeId": [
                    "28205"
                ],
                "image": [
                    "https://news.stanford.edu/__data/assets/image/0026/167084/jz_2024.jpeg"
                ],
                "c": [
                    "<p>Young adults crave closeness, says Stanford psychologist Jamil Zaki, but misjudge how much their peers want that, too. His research found strategies that can help nudge people to take a chance on one another.</p>"
                ],
                "taxonomyFeaturedUnitLandingPageUrl": [
                    "https://news.stanford.edu/featured-unit/stanford-school-of-humanities-and-sciences"
                ],
                "d": [
                    "2025-03-20T00:00:00-07:00"
                ],
                "seoDescription": [
                    "Young adults crave closeness, says Stanford psychologist Jamil Zaki, but misjudge how much their peers want that, too. His research found strategies that can help nudge people to take a chance on one another.."
                ],
                "taxonomyFeaturedUnitId": [
                    "28363"
                ],
                "taxonomyAudienceText": [
                    "External,Faculty/staff,Student"
                ],
                "taxonomyLegacyContentPartnerId": [
                    "null"
                ],
                "taxonomyMessageText": [
                    "Research enterprise"
                ],
                "t": [
                    "Why is social connection so hard for Gen Z?"
                ],
                "excludeFromIndex": [
                    "false"
                ],
                "taxonomyContentTypeText": [
                    "Q&amp;A"
                ],
                "taxonomyContentMainTopicText": [
                    "Social Sciences"
                ],
                "taxonomyMessageId": [
                    "[\"28181\"]"
                ],
                "topic": [
                    "Communication",
                    "Psychology"
                ],
                "assetTypeCode": [
                    "page_content"
                ],
                "category": [
                    "Research & Scholarship"
                ],
                "teaserPlain": [
                    "Young adults crave closeness, says Stanford psychologist Jamil Zaki, but misjudge how much their peers want that, too. His research found strategies that can help nudge people to take a chance on one another."
                ],
                "taxonomyContentCategoryText": [
                    "Research &amp; Scholarship"
                ],
                "teaser": [
                    "<p>Young adults crave closeness, says Stanford psychologist Jamil Zaki, but misjudge how much their peers want that, too. His research found strategies that can help nudge people to take a chance on one another.</p>"
                ],
                "longTitle": [
                    "Why is social connection so hard for Gen Z?"
                ]
            },
            "tags": [],
            "quickLinks": null,
            "displayUrl": "https://news.stanford.edu/stories/2025/03/social-connections-gen-z-research-jamil-zaki",
            "clickTrackingUrl": "/s/redirect?collection=sug~sp-stanford-report-search&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki&auth=XrzxyAR7nuRM3TGDusTydA&profile=stanford-report-push-search&rank=3&query=%5BassetHref%3A%22%2Fstories%2F2014%2F03%2Ftoo-much-homework-031014%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fstanford-explainer-crispr-gene-editing-and-beyond%22+assetHref%3A%22%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fthe-power-of-language-how-words-shape-people-culture%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fyouve-got-find-love-jobs-says%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmicrolightning-in-water-droplets-may-have-sparked-life-on-earth%22+assetHref%3A%22%2Fstories%2F2024%2F02%2Ftechnology-in-education%22+assetHref%3A%22%2Fstories%2F2022%2F01%2Fknow-gen-z%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fhybrid-work-is-a-win-win-win-for-companies-workers%22+assetHref%3A%22%2Fstories%2F2024%2F07%2FA-12-campus-art-walks-to-take-this-summer%22+assetHref%3A%22%2Fstories%2F2020%2F07%2Fmeaning-declaration-independence-changed-time%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study%22+assetHref%3A%22%2Fstories%2F2023%2F04%2Ftechnology-might-be-making-education-worse%22+assetHref%3A%22%2Fstories%2F2010%2F09%2Fnaimark-stalin-genocide-092310%22+assetHref%3A%22%2Fstories%2F2024%2F01%2Feight-simple-meaningful-eco-friendly-actions-can-incorporate-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert%22+assetHref%3A%22%2Fstories%2F2021%2F09%2Fmindsets-clearing-lens-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fsix-big-ideas-united-states-electricity-crisis-report%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fsteve-jobs-2005-graduates-stay-hungry-stay-foolish%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fgregory-walton-ordinary-magic-psychology-studies%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fmeet-our-faculty-tadashi-tokieda%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions%22+assetHref%3A%22%2Fstories%2F2021%2F02%2Ffour-causes-zoom-fatigue-solutions%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fblending-disciplines-for-a-more-colorful-world%22+assetHref%3A%22%2Fstories%2F2024%2F10%2Fphilip-zimbardo-the-psychologist-behind-stanford-prison-experiment-dies-at-age-91%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fonline-dating-popular-way-u-s-couples-meet%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Ffood-research-stanford-sustainability-agriculture-aquaculture%22%5D+-taxonomyContentTypeId%3A28201+-taxonomyContentTypeId%3A28216+-taxonomyContentTypeId%3A28210+d%3E15Oct2024",
            "explain": null,
            "indexUrl": "https://news.stanford.edu/stories/2025/03/social-connections-gen-z-research-jamil-zaki",
            "gscopesSet": [
                "news",
                "subtopiccommunication",
                "topicsocialsciences",
                "humsci",
                "mobile",
                "allnews",
                "topicinstitutional",
                "pushnews",
                "subtopicpsychology"
            ],
            "customData": {},
            "relatedDocuments": {},
            "documentVisibleToUser": true,
            "promoted": false,
            "diversified": true
        },
        {
            "rank": 4,
            "score": 452,
            "title": "Stanford nutrition expert breaks down effects of seed oils on health",
            "collection": "sug~ds-stanford-report-push",
            "component": 5,
            "collapsed": null,
            "liveUrl": "https://news.stanford.edu/stories/2025/03/seed-oils-health-stanford-nutrition-expert",
            "summary": "Recently, seed oils have become a focal point in public discourse. Christopher Gardner, the director of nutrition studies at the Stanford Prevention Research Center, shares what he thinks the average American should know.",
            "allSummaryText": null,
            "cacheUrl": "/s/cache?collection=sug~ds-stanford-report-push&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert&profile=stanford-report-push-search",
            "date": 1741824000000,
            "fileSize": 17234,
            "fileType": "xml",
            "tier": 1,
            "docNum": 7049,
            "exploreLink": null,
            "kmFromOrigin": null,
            "listMetadata": {
                "taxonomyFeaturedUnitText": [
                    "Stanford School of Medicine"
                ],
                "isTeaser": [
                    "false"
                ],
                "taxonomyContentSubtopicsId": [
                    "[]"
                ],
                "taxonomyAudienceId": [
                    "[\"28166\",\"28167\",\"28168\"]"
                ],
                "taxonomyContentMainTopicLandingPageUrl": [
                    "https://news.stanford.edu/research-and-scholarship/topic/health-and-medicine"
                ],
                "shortTitle": [
                    "Stanford nutrition expert breaks down effects of seed oils on health"
                ],
                "taxonomyLegacyStoryType": [
                    "null"
                ],
                "descriptionPlain": [
                    "Recently, seed oils have become a focal point in public discourse. Christopher Gardner, the director of nutrition studies at the Stanford Prevention Research Center, shares what he thinks the average American should know."
                ],
                "imageAlt": [
                    "Christopher Gardner sits behind desk in office "
                ],
                "taxonomyContentMainTopicId": [
                    "28404"
                ],
                "pressCenter": [
                    "false"
                ],
                "taxonomyContentCategoryId": [
                    "28172"
                ],
                "taxonomyLandingPageId": [
                    "null"
                ],
                "publishToMobile": [
                    "true"
                ],
                "mainTopic": [
                    "Health & Medicine"
                ],
                "id": [
                    "166844"
                ],
                "assetHref": [
                    "https://news.stanford.edu/stories/2025/03/seed-oils-health-stanford-nutrition-expert"
                ],
                "taxonomyContentTopicsId": [
                    "[]"
                ],
                "taxonomyLegacyTopicsId": [
                    "null"
                ],
                "taxonomyContentTypeId": [
                    "28193"
                ],
                "image": [
                    "https://news.stanford.edu/__data/assets/image/0032/166856/Christopher-Gardner-1500x1000.jpg"
                ],
                "c": [
                    "<p>Recently, seed oils have become a focal point in public discourse. Christopher Gardner, the director of nutrition studies at the Stanford Prevention Research Center, shares what he thinks the average American should know.</p>"
                ],
                "taxonomyFeaturedUnitLandingPageUrl": [
                    "https://news.stanford.edu/featured-unit/stanford-school-of-medicine"
                ],
                "d": [
                    "2025-03-13T00:00:00-07:00"
                ],
                "seoDescription": [
                    "Recently, seed oils have become a focal point in public discourse. Christopher Gardner, the director of nutrition studies at the Stanford Prevention Research Center, shares what he thinks the average American should know.."
                ],
                "taxonomyFeaturedUnitId": [
                    "28364"
                ],
                "taxonomyAudienceText": [
                    "External,Faculty/staff,Student"
                ],
                "canonical": [
                    "https://scopeblog.stanford.edu/2025/03/13/5-things-to-know-about-the-effects-of-seed-oils-on-health/"
                ],
                "taxonomyLegacyContentPartnerId": [
                    "null"
                ],
                "taxonomyMessageText": [
                    "Research enterprise"
                ],
                "t": [
                    "Stanford nutrition expert breaks down effects of seed oils on health"
                ],
                "excludeFromIndex": [
                    "false"
                ],
                "taxonomyContentTypeText": [
                    "Research"
                ],
                "taxonomyContentMainTopicText": [
                    "Health &amp; Medicine"
                ],
                "taxonomyMessageId": [
                    "[\"28181\"]"
                ],
                "assetTypeCode": [
                    "page_content"
                ],
                "category": [
                    "Research & Scholarship"
                ],
                "teaserPlain": [
                    "Recently, seed oils have become a focal point in public discourse. Christopher Gardner, the director of nutrition studies at the Stanford Prevention Research Center, shares what he thinks the average American should know."
                ],
                "taxonomyContentCategoryText": [
                    "Research &amp; Scholarship"
                ],
                "teaser": [
                    "<p>Recently, seed oils have become a focal point in public discourse. Christopher Gardner, the director of nutrition studies at the Stanford Prevention Research Center, shares what he thinks the average American should know.</p>"
                ],
                "longTitle": [
                    "Stanford nutrition expert breaks down effects of seed oils on health"
                ]
            },
            "tags": [],
            "quickLinks": null,
            "displayUrl": "https://news.stanford.edu/stories/2025/03/seed-oils-health-stanford-nutrition-expert",
            "clickTrackingUrl": "/s/redirect?collection=sug~sp-stanford-report-search&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert&auth=sXvJ6pjVCBuoYGgtZT42Pw&profile=stanford-report-push-search&rank=4&query=%5BassetHref%3A%22%2Fstories%2F2014%2F03%2Ftoo-much-homework-031014%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fstanford-explainer-crispr-gene-editing-and-beyond%22+assetHref%3A%22%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fthe-power-of-language-how-words-shape-people-culture%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fyouve-got-find-love-jobs-says%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmicrolightning-in-water-droplets-may-have-sparked-life-on-earth%22+assetHref%3A%22%2Fstories%2F2024%2F02%2Ftechnology-in-education%22+assetHref%3A%22%2Fstories%2F2022%2F01%2Fknow-gen-z%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fhybrid-work-is-a-win-win-win-for-companies-workers%22+assetHref%3A%22%2Fstories%2F2024%2F07%2FA-12-campus-art-walks-to-take-this-summer%22+assetHref%3A%22%2Fstories%2F2020%2F07%2Fmeaning-declaration-independence-changed-time%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study%22+assetHref%3A%22%2Fstories%2F2023%2F04%2Ftechnology-might-be-making-education-worse%22+assetHref%3A%22%2Fstories%2F2010%2F09%2Fnaimark-stalin-genocide-092310%22+assetHref%3A%22%2Fstories%2F2024%2F01%2Feight-simple-meaningful-eco-friendly-actions-can-incorporate-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert%22+assetHref%3A%22%2Fstories%2F2021%2F09%2Fmindsets-clearing-lens-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fsix-big-ideas-united-states-electricity-crisis-report%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fsteve-jobs-2005-graduates-stay-hungry-stay-foolish%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fgregory-walton-ordinary-magic-psychology-studies%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fmeet-our-faculty-tadashi-tokieda%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions%22+assetHref%3A%22%2Fstories%2F2021%2F02%2Ffour-causes-zoom-fatigue-solutions%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fblending-disciplines-for-a-more-colorful-world%22+assetHref%3A%22%2Fstories%2F2024%2F10%2Fphilip-zimbardo-the-psychologist-behind-stanford-prison-experiment-dies-at-age-91%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fonline-dating-popular-way-u-s-couples-meet%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Ffood-research-stanford-sustainability-agriculture-aquaculture%22%5D+-taxonomyContentTypeId%3A28201+-taxonomyContentTypeId%3A28216+-taxonomyContentTypeId%3A28210+d%3E15Oct2024",
            "explain": null,
            "indexUrl": "https://news.stanford.edu/stories/2025/03/seed-oils-health-stanford-nutrition-expert",
            "gscopesSet": [
                "news",
                "mobile",
                "allnews",
                "pushnews"
            ],
            "customData": {},
            "relatedDocuments": {},
            "documentVisibleToUser": true,
            "promoted": false,
            "diversified": true
        },
        {
            "rank": 5,
            "score": 397,
            "title": "Study strengthens link between shingles vaccine and lower dementia risk",
            "collection": "sug~ds-stanford-report-push",
            "component": 5,
            "collapsed": null,
            "liveUrl": "https://news.stanford.edu/stories/2025/04/shingles-vaccine-lower-dementia-risk-study",
            "summary": "A new analysis of a vaccination program in Wales found that the shingles vaccine appeared to lower new dementia diagnoses by 20% — more than any other known intervention.",
            "allSummaryText": null,
            "cacheUrl": "/s/cache?collection=sug~ds-stanford-report-push&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study&profile=stanford-report-push-search",
            "date": 1743552000000,
            "fileSize": 20007,
            "fileType": "xml",
            "tier": 1,
            "docNum": 7107,
            "exploreLink": null,
            "kmFromOrigin": null,
            "listMetadata": {
                "taxonomyFeaturedUnitText": [
                    "Stanford School of Medicine"
                ],
                "isTeaser": [
                    "false"
                ],
                "taxonomyContentSubtopicsId": [
                    "[]"
                ],
                "taxonomyAudienceId": [
                    "[\"28166\",\"28167\",\"28168\"]"
                ],
                "taxonomyContentMainTopicLandingPageUrl": [
                    "https://news.stanford.edu/research-and-scholarship/topic/health-and-medicine"
                ],
                "shortTitle": [
                    "Study strengthens link between shingles vaccine and lower dementia risk"
                ],
                "taxonomyLegacyStoryType": [
                    "null"
                ],
                "descriptionPlain": [
                    "A new analysis of a vaccination program in Wales found that the shingles vaccine appeared to lower new dementia diagnoses by 20% &mdash; more than any other known intervention."
                ],
                "taxonomyContentMainTopicId": [
                    "28404"
                ],
                "pressCenter": [
                    "false"
                ],
                "taxonomyContentCategoryId": [
                    "28172"
                ],
                "taxonomyLandingPageId": [
                    "null"
                ],
                "publishToMobile": [
                    "true"
                ],
                "mainTopic": [
                    "Health & Medicine"
                ],
                "id": [
                    "167860"
                ],
                "assetHref": [
                    "https://news.stanford.edu/stories/2025/04/shingles-vaccine-lower-dementia-risk-study"
                ],
                "taxonomyContentTopicsId": [
                    "[]"
                ],
                "taxonomyLegacyTopicsId": [
                    "null"
                ],
                "taxonomyContentTypeId": [
                    "28192"
                ],
                "image": [
                    "https://news.stanford.edu/__data/assets/image/0027/167904/GettyImages-1072174142.jpg"
                ],
                "taxonomyAdditionalFeaturedUnitIds": [
                    "[]"
                ],
                "c": [
                    "<p>A new analysis of a vaccination program in Wales found that the shingles vaccine appeared to lower new dementia diagnoses by 20% &mdash; more than any other known intervention.</p>"
                ],
                "taxonomyFeaturedUnitLandingPageUrl": [
                    "https://news.stanford.edu/featured-unit/stanford-school-of-medicine"
                ],
                "d": [
                    "2025-04-02T00:00:00-07:00"
                ],
                "seoDescription": [
                    "A new analysis of a vaccination program in Wales found that the shingles vaccine appeared to lower new dementia diagnoses by 20% &mdash; more than any other known intervention.."
                ],
                "taxonomyFeaturedUnitId": [
                    "28364"
                ],
                "taxonomyAudienceText": [
                    "External,Faculty/staff,Student"
                ],
                "taxonomyLegacyContentPartnerId": [
                    "null"
                ],
                "taxonomyMessageText": [
                    "Health care &amp; biomedical innovation"
                ],
                "t": [
                    "Study strengthens link between shingles vaccine and lower dementia risk"
                ],
                "excludeFromIndex": [
                    "false"
                ],
                "taxonomyContentTypeText": [
                    "News"
                ],
                "taxonomyContentMainTopicText": [
                    "Health &amp; Medicine"
                ],
                "taxonomyMessageId": [
                    "[\"28186\"]"
                ],
                "assetTypeCode": [
                    "page_content"
                ],
                "category": [
                    "Research & Scholarship"
                ],
                "teaserPlain": [
                    "A new analysis of a vaccination program in Wales found that the shingles vaccine appeared to lower new dementia diagnoses by 20% &ndash; more than any other known intervention."
                ],
                "taxonomyContentCategoryText": [
                    "Research &amp; Scholarship"
                ],
                "teaser": [
                    "<p>A new analysis of a vaccination program in Wales found that the shingles vaccine appeared to lower new dementia diagnoses by 20% – more than any other known intervention.</p>"
                ],
                "longTitle": [
                    "Study strengthens link between shingles vaccine and lower dementia risk"
                ]
            },
            "tags": [],
            "quickLinks": null,
            "displayUrl": "https://news.stanford.edu/stories/2025/04/shingles-vaccine-lower-dementia-risk-study",
            "clickTrackingUrl": "/s/redirect?collection=sug~sp-stanford-report-search&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study&auth=0NzYNjKlXXbEL4A1ev68ZA&profile=stanford-report-push-search&rank=5&query=%5BassetHref%3A%22%2Fstories%2F2014%2F03%2Ftoo-much-homework-031014%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fstanford-explainer-crispr-gene-editing-and-beyond%22+assetHref%3A%22%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fthe-power-of-language-how-words-shape-people-culture%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fyouve-got-find-love-jobs-says%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmicrolightning-in-water-droplets-may-have-sparked-life-on-earth%22+assetHref%3A%22%2Fstories%2F2024%2F02%2Ftechnology-in-education%22+assetHref%3A%22%2Fstories%2F2022%2F01%2Fknow-gen-z%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fhybrid-work-is-a-win-win-win-for-companies-workers%22+assetHref%3A%22%2Fstories%2F2024%2F07%2FA-12-campus-art-walks-to-take-this-summer%22+assetHref%3A%22%2Fstories%2F2020%2F07%2Fmeaning-declaration-independence-changed-time%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study%22+assetHref%3A%22%2Fstories%2F2023%2F04%2Ftechnology-might-be-making-education-worse%22+assetHref%3A%22%2Fstories%2F2010%2F09%2Fnaimark-stalin-genocide-092310%22+assetHref%3A%22%2Fstories%2F2024%2F01%2Feight-simple-meaningful-eco-friendly-actions-can-incorporate-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert%22+assetHref%3A%22%2Fstories%2F2021%2F09%2Fmindsets-clearing-lens-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fsix-big-ideas-united-states-electricity-crisis-report%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fsteve-jobs-2005-graduates-stay-hungry-stay-foolish%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fgregory-walton-ordinary-magic-psychology-studies%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fmeet-our-faculty-tadashi-tokieda%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions%22+assetHref%3A%22%2Fstories%2F2021%2F02%2Ffour-causes-zoom-fatigue-solutions%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fblending-disciplines-for-a-more-colorful-world%22+assetHref%3A%22%2Fstories%2F2024%2F10%2Fphilip-zimbardo-the-psychologist-behind-stanford-prison-experiment-dies-at-age-91%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fonline-dating-popular-way-u-s-couples-meet%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Ffood-research-stanford-sustainability-agriculture-aquaculture%22%5D+-taxonomyContentTypeId%3A28201+-taxonomyContentTypeId%3A28216+-taxonomyContentTypeId%3A28210+d%3E15Oct2024",
            "explain": null,
            "indexUrl": "https://news.stanford.edu/stories/2025/04/shingles-vaccine-lower-dementia-risk-study",
            "gscopesSet": [
                "news",
                "mobile",
                "allnews",
                "topicinstitutional",
                "pushnews"
            ],
            "customData": {},
            "relatedDocuments": {},
            "documentVisibleToUser": true,
            "promoted": false,
            "diversified": true
        },
        {
            "rank": 6,
            "score": 344,
            "title": "‘Civic Salons’ engage students on complex issues",
            "collection": "sug~ds-stanford-report-push",
            "component": 5,
            "collapsed": null,
            "liveUrl": "https://news.stanford.edu/stories/2025/03/civic-salons-stanford-student-faculty-discussions",
            "summary": "A series of informal conversations in residence halls during winter quarter offered undergraduates an opportunity to discuss some of society’s most pressing challenges.",
            "allSummaryText": null,
            "cacheUrl": "/s/cache?collection=sug~ds-stanford-report-push&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions&profile=stanford-report-push-search",
            "date": 1742169600000,
            "fileSize": 20835,
            "fileType": "xml",
            "tier": 1,
            "docNum": 7085,
            "exploreLink": null,
            "kmFromOrigin": null,
            "listMetadata": {
                "isTeaser": [
                    "false"
                ],
                "taxonomyContentSubtopicsId": [
                    "[]"
                ],
                "taxonomyAudienceId": [
                    "[\"28166\",\"28167\",\"28168\"]"
                ],
                "taxonomyContentMainTopicLandingPageUrl": [
                    "https://news.stanford.edu/student-experience/topic/academics"
                ],
                "shortTitle": [
                    "‘Civic Salons’ engage students on complex issues"
                ],
                "taxonomyLegacyStoryType": [
                    "null"
                ],
                "descriptionPlain": [
                    "A series of informal conversations in residence halls during winter quarter offered undergraduates an opportunity to discuss some of society&rsquo;s most pressing challenges."
                ],
                "imageAlt": [
                    "Students gather in a dorm dinning area to enjoy snacks during a Civic Salon discussion."
                ],
                "taxonomyContentMainTopicId": [
                    "28413"
                ],
                "pressCenter": [
                    "false"
                ],
                "taxonomyContentCategoryId": [
                    "28174"
                ],
                "taxonomyLandingPageId": [
                    "null"
                ],
                "publishToMobile": [
                    "true"
                ],
                "mainTopic": [
                    "Academics"
                ],
                "id": [
                    "166857"
                ],
                "assetHref": [
                    "https://news.stanford.edu/stories/2025/03/civic-salons-stanford-student-faculty-discussions"
                ],
                "taxonomyContentTopicsId": [
                    "[]"
                ],
                "taxonomyLegacyTopicsId": [
                    "null"
                ],
                "taxonomyContentTypeId": [
                    "28192"
                ],
                "image": [
                    "https://news.stanford.edu/__data/assets/image/0036/166878/2025.01.16_CivicsSalon-09.jpg"
                ],
                "c": [
                    "<p>A series of informal conversations in residence halls during winter quarter offered undergraduates an opportunity to discuss some of society&rsquo;s most pressing challenges.</p>"
                ],
                "d": [
                    "2025-03-17T00:00:00-07:00"
                ],
                "seoDescription": [
                    "A series of informal conversations in residence halls during winter quarter offered undergraduates an opportunity to discuss some of society’s most pressing challenges.."
                ],
                "taxonomyAudienceText": [
                    "External,Faculty/staff,Student"
                ],
                "taxonomyLegacyContentPartnerId": [
                    "null"
                ],
                "taxonomyMessageText": [
                    "Teaching enterprise"
                ],
                "t": [
                    "‘Civic Salons’ engage students on complex issues"
                ],
                "excludeFromIndex": [
                    "false"
                ],
                "taxonomyContentTypeText": [
                    "News"
                ],
                "taxonomyContentMainTopicText": [
                    "Academics"
                ],
                "taxonomyMessageId": [
                    "[\"28180\"]"
                ],
                "assetTypeCode": [
                    "page_content"
                ],
                "category": [
                    "Student Experience"
                ],
                "teaserPlain": [
                    "A series of informal conversations in residence halls during winter quarter offered undergraduates an opportunity to discuss some of society&rsquo;s most pressing challenges."
                ],
                "taxonomyContentCategoryText": [
                    "Student Experience"
                ],
                "teaser": [
                    "<p>A series of informal conversations in residence halls during winter quarter offered undergraduates an opportunity to discuss some of society’s most pressing challenges.</p>"
                ],
                "longTitle": [
                    "‘Civic Salons’ engage students on complex issues"
                ]
            },
            "tags": [],
            "quickLinks": null,
            "displayUrl": "https://news.stanford.edu/stories/2025/03/civic-salons-stanford-student-faculty-discussions",
            "clickTrackingUrl": "/s/redirect?collection=sug~sp-stanford-report-search&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions&auth=aNzxPoRHda%2BmutFnmw%2BA%2FA&profile=stanford-report-push-search&rank=6&query=%5BassetHref%3A%22%2Fstories%2F2014%2F03%2Ftoo-much-homework-031014%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fstanford-explainer-crispr-gene-editing-and-beyond%22+assetHref%3A%22%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fthe-power-of-language-how-words-shape-people-culture%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fyouve-got-find-love-jobs-says%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmicrolightning-in-water-droplets-may-have-sparked-life-on-earth%22+assetHref%3A%22%2Fstories%2F2024%2F02%2Ftechnology-in-education%22+assetHref%3A%22%2Fstories%2F2022%2F01%2Fknow-gen-z%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fhybrid-work-is-a-win-win-win-for-companies-workers%22+assetHref%3A%22%2Fstories%2F2024%2F07%2FA-12-campus-art-walks-to-take-this-summer%22+assetHref%3A%22%2Fstories%2F2020%2F07%2Fmeaning-declaration-independence-changed-time%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study%22+assetHref%3A%22%2Fstories%2F2023%2F04%2Ftechnology-might-be-making-education-worse%22+assetHref%3A%22%2Fstories%2F2010%2F09%2Fnaimark-stalin-genocide-092310%22+assetHref%3A%22%2Fstories%2F2024%2F01%2Feight-simple-meaningful-eco-friendly-actions-can-incorporate-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert%22+assetHref%3A%22%2Fstories%2F2021%2F09%2Fmindsets-clearing-lens-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fsix-big-ideas-united-states-electricity-crisis-report%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fsteve-jobs-2005-graduates-stay-hungry-stay-foolish%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fgregory-walton-ordinary-magic-psychology-studies%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fmeet-our-faculty-tadashi-tokieda%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions%22+assetHref%3A%22%2Fstories%2F2021%2F02%2Ffour-causes-zoom-fatigue-solutions%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fblending-disciplines-for-a-more-colorful-world%22+assetHref%3A%22%2Fstories%2F2024%2F10%2Fphilip-zimbardo-the-psychologist-behind-stanford-prison-experiment-dies-at-age-91%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fonline-dating-popular-way-u-s-couples-meet%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Ffood-research-stanford-sustainability-agriculture-aquaculture%22%5D+-taxonomyContentTypeId%3A28201+-taxonomyContentTypeId%3A28216+-taxonomyContentTypeId%3A28210+d%3E15Oct2024",
            "explain": null,
            "indexUrl": "https://news.stanford.edu/stories/2025/03/civic-salons-stanford-student-faculty-discussions",
            "gscopesSet": [
                "news",
                "mobile",
                "allnews",
                "topicinstitutional",
                "pushnews"
            ],
            "customData": {},
            "relatedDocuments": {},
            "documentVisibleToUser": true,
            "promoted": false,
            "diversified": true
        },
        {
            "rank": 7,
            "score": 314,
            "title": "New device produces critical fertilizer ingredient from thin air",
            "collection": "sug~ds-stanford-report-push",
            "component": 5,
            "collapsed": null,
            "liveUrl": "https://news.stanford.edu/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air",
            "summary": "A new prototype device demonstrates an innovative approach to producing ammonia – a key component of fertilizer – that could transform an industry responsible for about one-third of global greenhouse gas emissions.",
            "allSummaryText": null,
            "cacheUrl": "/s/cache?collection=sug~ds-stanford-report-push&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air&profile=stanford-report-push-search",
            "date": 1734048000000,
            "fileSize": 18593,
            "fileType": "xml",
            "tier": 1,
            "docNum": 6934,
            "exploreLink": null,
            "kmFromOrigin": null,
            "listMetadata": {
                "taxonomyFeaturedUnitText": [
                    "Stanford Woods Institute for the Environment"
                ],
                "isTeaser": [
                    "false"
                ],
                "taxonomyContentSubtopicsId": [
                    "[]"
                ],
                "taxonomyAudienceId": [
                    "[\"28166\",\"28167\",\"28168\"]"
                ],
                "taxonomyContentMainTopicLandingPageUrl": [
                    "https://news.stanford.edu/research-and-scholarship/topic/science-and-engineering"
                ],
                "shortTitle": [
                    "New device produces critical fertilizer ingredient from thin air"
                ],
                "taxonomyLegacyStoryType": [
                    "null"
                ],
                "descriptionPlain": [
                    "A new prototype device demonstrates an innovative approach to producing ammonia &ndash; a key component of fertilizer &ndash; that could transform an industry responsible for about one-third of global greenhouse gas emissions."
                ],
                "imageAlt": [
                    "Tractor spraying crops"
                ],
                "taxonomyContentMainTopicId": [
                    "28406"
                ],
                "pressCenter": [
                    "true"
                ],
                "taxonomyContentCategoryId": [
                    "28172"
                ],
                "taxonomyLandingPageId": [
                    "null"
                ],
                "publishToMobile": [
                    "true"
                ],
                "taxonomyContentTopicsText": [
                    "Chemistry"
                ],
                "mainTopic": [
                    "Science & Engineering"
                ],
                "id": [
                    "163124"
                ],
                "assetHref": [
                    "https://news.stanford.edu/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air"
                ],
                "mediaContacts": [
                    "<p><strong>Media contact</strong></p><p>Marijane Leonard, Stanford School of Humanities and Sciences: <a href=\"mailto:marijane.leonard@stanford.edu\">marijane.leonard@stanford.edu</a></p>"
                ],
                "taxonomyContentTopicsId": [
                    "[\"28583\"]"
                ],
                "taxonomyLegacyTopicsId": [
                    "null"
                ],
                "taxonomyContentTypeId": [
                    "28193"
                ],
                "image": [
                    "https://news.stanford.edu/__data/assets/image/0020/163136/GettyImages-1645947626-green-ammonia.jpg"
                ],
                "c": [
                    "<p>A new prototype device demonstrates an innovative approach to producing ammonia &ndash; a key component of fertilizer &ndash; that could transform an industry responsible for about one-third of global greenhouse gas emissions.</p>"
                ],
                "taxonomyFeaturedUnitLandingPageUrl": [
                    "https://news.stanford.edu/featured-unit/stanford-woods-institute-for-the-environment"
                ],
                "d": [
                    "2024-12-13T00:00:00-08:00"
                ],
                "seoDescription": [
                    "A new prototype device demonstrates an innovative approach to producing ammonia – a key component of fertilizer – that could transform an industry responsible for about one-third of global greenhouse gas emissions.."
                ],
                "taxonomyFeaturedUnitId": [
                    "28367"
                ],
                "taxonomyAudienceText": [
                    "External,Faculty/staff,Student"
                ],
                "taxonomyLegacyContentPartnerId": [
                    "null"
                ],
                "taxonomyMessageText": [
                    "Research enterprise"
                ],
                "t": [
                    "New device produces critical fertilizer ingredient from thin air"
                ],
                "excludeFromIndex": [
                    "false"
                ],
                "taxonomyContentTypeText": [
                    "Research"
                ],
                "taxonomyContentMainTopicText": [
                    "Science &amp; Engineering"
                ],
                "taxonomyMessageId": [
                    "[\"28181\"]"
                ],
                "topic": [
                    "Chemistry"
                ],
                "assetTypeCode": [
                    "page_content"
                ],
                "category": [
                    "Research & Scholarship"
                ],
                "teaserPlain": [
                    "A new prototype device demonstrates an innovative approach to producing ammonia &ndash; a key component of fertilizer &ndash; that could transform an industry responsible for about one-third of global greenhouse gas emissions."
                ],
                "taxonomyContentCategoryText": [
                    "Research &amp; Scholarship"
                ],
                "teaser": [
                    "<p>A new prototype device demonstrates an innovative approach to producing ammonia – a key component of fertilizer – that could transform an industry responsible for about one-third of global greenhouse gas emissions.</p>"
                ],
                "longTitle": [
                    "New device produces critical fertilizer ingredient from thin air, cutting carbon emissions"
                ]
            },
            "tags": [],
            "quickLinks": null,
            "displayUrl": "https://news.stanford.edu/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air",
            "clickTrackingUrl": "/s/redirect?collection=sug~sp-stanford-report-search&url=https%3A%2F%2Fnews.stanford.edu%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air&auth=23mmTAz3LTNhn5byKl9ZXA&profile=stanford-report-push-search&rank=7&query=%5BassetHref%3A%22%2Fstories%2F2014%2F03%2Ftoo-much-homework-031014%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fstanford-explainer-crispr-gene-editing-and-beyond%22+assetHref%3A%22%2Fstories%2F2024%2F12%2Fnew-device-produces-critical-fertilizer-ingredient-from-thin-air%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fthe-power-of-language-how-words-shape-people-culture%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fyouve-got-find-love-jobs-says%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmicrolightning-in-water-droplets-may-have-sparked-life-on-earth%22+assetHref%3A%22%2Fstories%2F2024%2F02%2Ftechnology-in-education%22+assetHref%3A%22%2Fstories%2F2022%2F01%2Fknow-gen-z%22+assetHref%3A%22%2Fstories%2F2024%2F06%2Fhybrid-work-is-a-win-win-win-for-companies-workers%22+assetHref%3A%22%2Fstories%2F2024%2F07%2FA-12-campus-art-walks-to-take-this-summer%22+assetHref%3A%22%2Fstories%2F2020%2F07%2Fmeaning-declaration-independence-changed-time%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fshingles-vaccine-lower-dementia-risk-study%22+assetHref%3A%22%2Fstories%2F2023%2F04%2Ftechnology-might-be-making-education-worse%22+assetHref%3A%22%2Fstories%2F2010%2F09%2Fnaimark-stalin-genocide-092310%22+assetHref%3A%22%2Fstories%2F2024%2F01%2Feight-simple-meaningful-eco-friendly-actions-can-incorporate-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fmark-skylar-scott-on-3d-printing-human-organs%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fsocial-connections-gen-z-research-jamil-zaki%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fseed-oils-health-stanford-nutrition-expert%22+assetHref%3A%22%2Fstories%2F2021%2F09%2Fmindsets-clearing-lens-life%22+assetHref%3A%22%2Fstories%2F2025%2F04%2Fsix-big-ideas-united-states-electricity-crisis-report%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fmenopause-earnings-economics-study%22+assetHref%3A%22%2Fstories%2F2005%2F06%2Fsteve-jobs-2005-graduates-stay-hungry-stay-foolish%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fgregory-walton-ordinary-magic-psychology-studies%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fmeet-our-faculty-tadashi-tokieda%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Fcivic-salons-stanford-student-faculty-discussions%22+assetHref%3A%22%2Fstories%2F2021%2F02%2Ffour-causes-zoom-fatigue-solutions%22+assetHref%3A%22%2Fstories%2F2024%2F05%2Fblending-disciplines-for-a-more-colorful-world%22+assetHref%3A%22%2Fstories%2F2024%2F10%2Fphilip-zimbardo-the-psychologist-behind-stanford-prison-experiment-dies-at-age-91%22+assetHref%3A%22%2Fstories%2F2019%2F08%2Fonline-dating-popular-way-u-s-couples-meet%22+assetHref%3A%22%2Fstories%2F2025%2F03%2Ffood-research-stanford-sustainability-agriculture-aquaculture%22%5D+-taxonomyContentTypeId%3A28201+-taxonomyContentTypeId%3A28216+-taxonomyContentTypeId%3A28210+d%3E15Oct2024",
            "explain": null,
            "indexUrl": "https://news.stanford.edu/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air",
            "gscopesSet": [
                "news",
                "subtopicchemistry",
                "topicscienceengineering",
                "dor",
                "mobile",
                "allnews",
                "topicinstitutional",
                "pushnews"
            ],
            "customData": {},
            "relatedDocuments": {},
            "documentVisibleToUser": true,
            "promoted": false,
            "diversified": true
        }
    ]),
    getDateRange: vi.fn(),
    formatDate: vi.fn(),
    getAPIDateRange: vi.fn(),
    getMaxPublishedDate: vi.fn()
}));

describe('[Link List]', () => {
    const defaultMockData = {
        storiesCount: 5,
        APIrespCount: 30,
        sourcePath: "/stories/%",
        assetExclusions: "",
        contentTypeExclusions: "",
        APIdateRange: "1 month",
        publishedDateMax: "Past 6 months"
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://example.com/json',
            MGT_API: "https://example.com/json",
            CF_ANALYTICS_API: "TEST_API"
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters are provided.', async () => {
            const result = await main();
            
            expect(result).toBe(
                '<!-- Error occurred in the Popular Stories CF component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->',
            );
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    FB_JSON_URL: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        FB_JSON_URL: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when MGT_API was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    MGT_API: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "MGT_API" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when MGT_API was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        MGT_API: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "MGT_API" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when CF_ANALYTICS_API was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    CF_ANALYTICS_API: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "CF_ANALYTICS_API" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when CF_ANALYTICS_API was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        CF_ANALYTICS_API: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "CF_ANALYTICS_API" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when storiesCount was not a number', async () => {
            const mockData = {
                ...defaultMockData,
                storiesCount: '12'
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "storiesCount" field must be a number one of [5, 10, 15, 20]. The "12" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when storiesCount was not a number one of [5, 10, 15, 20]', async () => {
            const mockData = {
                ...defaultMockData,
                storiesCount: 4
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "storiesCount" field must be a number one of [5, 10, 15, 20]. The 4 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when assetExclusions was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                assetExclusions: 123
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "assetExclusions" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when contentTypeExclusions was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentTypeExclusions: 123
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "contentTypeExclusions" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when sourcePath was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                sourcePath: 123
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "sourcePath" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when APIrespCount was not a number', async () => {
            const mockData = {
                ...defaultMockData,
                APIrespCount: '12'
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "APIrespCount" field must be a number one of [30, 60]. The "12" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when APIrespCount was not a number one of [30, 60]', async () => {
            const mockData = {
                ...defaultMockData,
                APIrespCount: 4
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "APIrespCount" field must be a number one of [30, 60]. The 4 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when APIdateRange was not one of ["1 week", "2 weeks", "1 month"]', async () => {
            const mockData = {
                ...defaultMockData,
                APIdateRange: "Test"
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "APIdateRange" field must be one of ["1 week", "2 weeks", "1 month"]. The "Test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when publishedDateMax was not one of ["Past 6 months", "Past 1 year", "Past 2 years"]', async () => {
            const mockData = {
                ...defaultMockData,
                publishedDateMax: "Test"
            };
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Popular Stories CF component: The "publishedDateMax" field must be one of ["Past 6 months", "Past 1 year", "Past 2 years"]. The "Test" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

    });

    describe('[Main Function]', () => {  
        it('Should render expected HTML with proper data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='popular-stories'><div id='popular-stories' class='su-flex su-gap-[1.8rem] su-flex-col'><span class='[&>*]:su-font-bold'><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='15' viewBox='0 0 24 15' fill='none' class='' ><path fill-rule='evenodd' clip-rule='evenodd' d='M15 3.15C14.1716 3.15 13.5 2.50081 13.5 1.7C13.5 0.899187 14.1716 0.25 15 0.25H22.5C23.3284 0.25 24 0.899187 24 1.7V8.95C24 9.75081 23.3284 10.4 22.5 10.4C21.6716 10.4 21 9.75081 21 8.95V5.20061L14.5607 11.4253C13.9749 11.9916 13.0251 11.9916 12.4393 11.4253L9 8.10061L2.56066 14.3253C1.97487 14.8916 1.02513 14.8916 0.43934 14.3253C-0.146447 13.759 -0.146447 12.841 0.43934 12.2747L7.93934 5.0247C8.52513 4.45844 9.47487 4.45844 10.0607 5.0247L13.5 8.34939L18.8787 3.15H15Z' fill='url(#paint0_linear_3094_2581)' /><defs><linearGradient id='paint0_linear_3094_2581' x1='0' y1='0.25' x2='24' y2='0.25' gradientUnits='userSpaceOnUse' ><stop stop-color='#B1040E' /><stop offset='1' stop-color='#620059' /></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='15' viewBox='0 0 24 15' fill='none' class='' ><path fill-rule='evenodd' clip-rule='evenodd' d='M15 3.15C14.1716 3.15 13.5 2.50081 13.5 1.7C13.5 0.899187 14.1716 0.25 15 0.25H22.5C23.3284 0.25 24 0.899187 24 1.7V8.95C24 9.75081 23.3284 10.4 22.5 10.4C21.6716 10.4 21 9.75081 21 8.95V5.20061L14.5607 11.4253C13.9749 11.9916 13.0251 11.9916 12.4393 11.4253L9 8.10061L2.56066 14.3253C1.97487 14.8916 1.02513 14.8916 0.43934 14.3253C-0.146447 13.759 -0.146447 12.841 0.43934 12.2747L7.93934 5.0247C8.52513 4.45844 9.47487 4.45844 10.0607 5.0247L13.5 8.34939L18.8787 3.15H15Z' fill='url(#paint0_linear_3094_798)' /><defs><linearGradient id='paint0_linear_3094_798' x1='0' y1='0.25' x2='24' y2='0.25' gradientUnits='userSpaceOnUse' ><stop stop-color='#017E7C' /><stop offset='1' stop-color='#8F993E' /></linearGradient></defs></svg></span><span>Popular stories</span></h2></span><div><ol class='su-text-[2.0rem] su-font-normal su-leading-[2.4rem] su-flex su-flex-col su-gap-[1.5rem]' ><li><a href="https://news.stanford.edu/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air" class="su-no-underline su-font-normal dark:su-text-[white] hocus:su-underline hocus:su-text-digital-red hocus:dark:su-text-dark-mode-red" >New device produces critical fertilizer ingredient from thin air</a></li></ol></div></div></section>"`);
        });               

        it('Should exclusionIDs form assetExclusions', async () => {
            const mockData = {
                ...defaultMockData,
                assetExclusions: '45228, 35231, '
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='popular-stories'><div id='popular-stories' class='su-flex su-gap-[1.8rem] su-flex-col'><span class='[&>*]:su-font-bold'><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='15' viewBox='0 0 24 15' fill='none' class='' ><path fill-rule='evenodd' clip-rule='evenodd' d='M15 3.15C14.1716 3.15 13.5 2.50081 13.5 1.7C13.5 0.899187 14.1716 0.25 15 0.25H22.5C23.3284 0.25 24 0.899187 24 1.7V8.95C24 9.75081 23.3284 10.4 22.5 10.4C21.6716 10.4 21 9.75081 21 8.95V5.20061L14.5607 11.4253C13.9749 11.9916 13.0251 11.9916 12.4393 11.4253L9 8.10061L2.56066 14.3253C1.97487 14.8916 1.02513 14.8916 0.43934 14.3253C-0.146447 13.759 -0.146447 12.841 0.43934 12.2747L7.93934 5.0247C8.52513 4.45844 9.47487 4.45844 10.0607 5.0247L13.5 8.34939L18.8787 3.15H15Z' fill='url(#paint0_linear_3094_2581)' /><defs><linearGradient id='paint0_linear_3094_2581' x1='0' y1='0.25' x2='24' y2='0.25' gradientUnits='userSpaceOnUse' ><stop stop-color='#B1040E' /><stop offset='1' stop-color='#620059' /></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='15' viewBox='0 0 24 15' fill='none' class='' ><path fill-rule='evenodd' clip-rule='evenodd' d='M15 3.15C14.1716 3.15 13.5 2.50081 13.5 1.7C13.5 0.899187 14.1716 0.25 15 0.25H22.5C23.3284 0.25 24 0.899187 24 1.7V8.95C24 9.75081 23.3284 10.4 22.5 10.4C21.6716 10.4 21 9.75081 21 8.95V5.20061L14.5607 11.4253C13.9749 11.9916 13.0251 11.9916 12.4393 11.4253L9 8.10061L2.56066 14.3253C1.97487 14.8916 1.02513 14.8916 0.43934 14.3253C-0.146447 13.759 -0.146447 12.841 0.43934 12.2747L7.93934 5.0247C8.52513 4.45844 9.47487 4.45844 10.0607 5.0247L13.5 8.34939L18.8787 3.15H15Z' fill='url(#paint0_linear_3094_798)' /><defs><linearGradient id='paint0_linear_3094_798' x1='0' y1='0.25' x2='24' y2='0.25' gradientUnits='userSpaceOnUse' ><stop stop-color='#017E7C' /><stop offset='1' stop-color='#8F993E' /></linearGradient></defs></svg></span><span>Popular stories</span></h2></span><div><ol class='su-text-[2.0rem] su-font-normal su-leading-[2.4rem] su-flex su-flex-col su-gap-[1.5rem]' ><li><a href="https://news.stanford.edu/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air" class="su-no-underline su-font-normal dark:su-text-[white] hocus:su-underline hocus:su-text-digital-red hocus:dark:su-text-dark-mode-red" >New device produces critical fertilizer ingredient from thin air</a></li></ol></div></div></section>"`);
        });   

        it('Should exclusionContentTypes form contentTypeExclusions', async () => {
            const mockData = {
                ...defaultMockData,
                contentTypeExclusions: '45228, 35231, '
            };
            const result = await main(mockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<section data-component='popular-stories'><div id='popular-stories' class='su-flex su-gap-[1.8rem] su-flex-col'><span class='[&>*]:su-font-bold'><h2 class="su-component-sidebar-heading su-w-full su-flex su-flex-wrap su-gap-6 su-my-0 su-font-sans su-text-black-90 dark:su-text-white su-font-semibold su-text-18 su-items-end"><span data-test="icon" class="dark:su-hidden"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='15' viewBox='0 0 24 15' fill='none' class='' ><path fill-rule='evenodd' clip-rule='evenodd' d='M15 3.15C14.1716 3.15 13.5 2.50081 13.5 1.7C13.5 0.899187 14.1716 0.25 15 0.25H22.5C23.3284 0.25 24 0.899187 24 1.7V8.95C24 9.75081 23.3284 10.4 22.5 10.4C21.6716 10.4 21 9.75081 21 8.95V5.20061L14.5607 11.4253C13.9749 11.9916 13.0251 11.9916 12.4393 11.4253L9 8.10061L2.56066 14.3253C1.97487 14.8916 1.02513 14.8916 0.43934 14.3253C-0.146447 13.759 -0.146447 12.841 0.43934 12.2747L7.93934 5.0247C8.52513 4.45844 9.47487 4.45844 10.0607 5.0247L13.5 8.34939L18.8787 3.15H15Z' fill='url(#paint0_linear_3094_2581)' /><defs><linearGradient id='paint0_linear_3094_2581' x1='0' y1='0.25' x2='24' y2='0.25' gradientUnits='userSpaceOnUse' ><stop stop-color='#B1040E' /><stop offset='1' stop-color='#620059' /></linearGradient></defs></svg></span><span data-test="icon" class="su-hidden dark:su-block"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='15' viewBox='0 0 24 15' fill='none' class='' ><path fill-rule='evenodd' clip-rule='evenodd' d='M15 3.15C14.1716 3.15 13.5 2.50081 13.5 1.7C13.5 0.899187 14.1716 0.25 15 0.25H22.5C23.3284 0.25 24 0.899187 24 1.7V8.95C24 9.75081 23.3284 10.4 22.5 10.4C21.6716 10.4 21 9.75081 21 8.95V5.20061L14.5607 11.4253C13.9749 11.9916 13.0251 11.9916 12.4393 11.4253L9 8.10061L2.56066 14.3253C1.97487 14.8916 1.02513 14.8916 0.43934 14.3253C-0.146447 13.759 -0.146447 12.841 0.43934 12.2747L7.93934 5.0247C8.52513 4.45844 9.47487 4.45844 10.0607 5.0247L13.5 8.34939L18.8787 3.15H15Z' fill='url(#paint0_linear_3094_798)' /><defs><linearGradient id='paint0_linear_3094_798' x1='0' y1='0.25' x2='24' y2='0.25' gradientUnits='userSpaceOnUse' ><stop stop-color='#017E7C' /><stop offset='1' stop-color='#8F993E' /></linearGradient></defs></svg></span><span>Popular stories</span></h2></span><div><ol class='su-text-[2.0rem] su-font-normal su-leading-[2.4rem] su-flex su-flex-col su-gap-[1.5rem]' ><li><a href="https://news.stanford.edu/stories/2024/12/new-device-produces-critical-fertilizer-ingredient-from-thin-air" class="su-no-underline su-font-normal dark:su-text-[white] hocus:su-underline hocus:su-text-digital-red hocus:dark:su-text-dark-mode-red" >New device produces critical fertilizer ingredient from thin air</a></li></ol></div></div></section>"`);
        });               
    });

    describe('[Edge Cases]', () => {
        it('Should throw an error when fetchAdapter fetch will fail', async () => {
            FetchAdapter.mockImplementationOnce(() => ({
                request: vi.fn(),
                assets: vi.fn(),
                data: vi.fn(),
                fetch: vi.fn().mockRejectedValueOnce(new Error('Async error')),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Popular Stories CF component: Analytics fetch failed: Async error -->"`);
        });

        it('Should throw an error when popularStoriesFetcher will fail', async () => {
            popularStoriesFetcher.mockRejectedValueOnce(new Error('Async error'))

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Popular Stories CF component: Popular stories fetch failed: Async error -->"`);
        });
    });
});
