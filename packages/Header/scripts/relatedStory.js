import { FetchAdapter } from "../../../global/js/utils/fetchAdapter";
import { translatePersonalisationProfile } from "../../../global/js/utils/translatePersonalisationProfile";

export default async function relatedStoryData(pageData = null, audience = "") {
    const adapter = new FetchAdapter();
    if (pageData && pageData.search) {
        let fbUrl = "";
        let fallbackFbUrl = "";

        fbUrl = `${pageData.search.endpoint?.replace(
            "search.html",
            "search.json"
        )}?profile=${pageData.search.profile}&collection=${
            pageData.search.collection
        }&query=[taxonomyContentMainTopicId:${
            pageData.mainTopicId
        } taxonomyContentTopicsId:${
            pageData.mainTopicId
        } taxonomyContentSubtopicsId:${
            pageData.mainTopicId
        }]&meta_taxonomyAudienceText=${translatePersonalisationProfile(
            audience
        )}&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 taxonomyContentMainTopicId:169602 taxonomyContentMainTopicId:169604 id:${
            pageData.id
        }]&sort=date&num_ranks=1&log=false`;

        fallbackFbUrl = `${pageData.search.endpoint?.replace(
            "search.html",
            "search.json"
        )}?profile=${pageData.search.profile}&collection=${
            pageData.search.collection
        }&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${
            pageData.id
        }]&sort=date&num_ranks=1&log=false`;

        if (pageData.contentType === "Video") {
            fallbackFbUrl += "&meta_taxonomyContentTypeId=28207";
            fbUrl += "&meta_taxonomyContentTypeId=28207";
        }

        adapter.url = fbUrl;

        let storyResultData = await adapter.fetch();
        let story = storyResultData.response?.resultPacket?.results?.[0] || null;

        if (!story) {
            adapter.url = fallbackFbUrl;

            storyResultData = await adapter.fetch();
            story = storyResultData.response?.resultPacket?.results?.[0] || null;
        }

        return story;
    }

    return null;
}
