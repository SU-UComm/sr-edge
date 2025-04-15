import { FetchAdapter, translatePersonalisationProfile } from "../../../global/js/utils";
// import testData from '../example-data/fb.data.json';

export default async function fbFetcher(
    pageData = null,
    personalisation = "",
    behaviouralData = null
) {
    const adapter = new FetchAdapter();
    if (pageData && pageData?.search?.endpoint) {
        // default non-behavioural
        const defaultFbUrl = `
            ${pageData?.search?.endpoint?.replace(/\.html/g, ".json")}
            ?profile=${pageData?.search?.profile}
            &collection=${pageData?.search?.collection}
            &query=[taxonomyContentMainTopicId:${
                pageData.mainTopicId
            } taxonomyContentTopicsId:${
            pageData.mainTopicId
            } taxonomyContentSubtopicsId:${pageData.mainTopicId}]
            &query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${
                pageData.id
            }]
            &meta_taxonomyAudienceText=${translatePersonalisationProfile(
                personalisation
            )}&num_ranks=3&sort=date&log=false&meta_isTeaser=false`;
        let fbUrl = defaultFbUrl;

        if (behaviouralData && behaviouralData?.behavioural) {
            fbUrl = `${pageData?.search?.endpoint?.replace(/\.html/g, ".json")}
                ?profile=${pageData?.search?.profile}
                &collection=${pageData?.search?.collection}${
                    behaviouralData.partialQuery
                }&num_ranks=3&log=false&meta_isTeaser=false`;
        }

        // uglify the URL
        adapter.url = fbUrl.replace(/\n+|\t+| {2,}/g, "");

        const storyResultData = await adapter.fetch();
        // const storyResultData = testData;
        let stories = storyResultData.response?.resultPacket?.results || null;

        // when behavioural and there is insufficient data returned (less than 3)
        if (stories && stories.length < 3) {
            // run the default topic query
            adapter.url = defaultFbUrl.replace(/\n+|\t+| {2,}/g, "");
            const backupResultData = await adapter.fetch();
            stories = backupResultData.response?.resultPacket?.results || null;
            // test again, are there results on the first backup?
            if (stories && stories.length < 3) {
                // if not, fetch the final fallback
                const finalFallbackFbUrl = `${pageData?.search?.endpoint?.replace(
                    /\.html/g,
                        ".json"
                    )}
                    ?profile=${pageData?.search?.profile}
                    &collection=${
                        pageData?.search?.collection
                    }&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${
                        pageData.id
                    }]&num_ranks=3&sort=date&log=false&meta_isTeaser=false`;
                adapter.url = finalFallbackFbUrl.replace(/\n+|\t+| {2,}/g, "");
                const finalBackupResultData = await adapter.fetch();
                stories = finalBackupResultData.response?.resultPacket?.results || null;
            }
        }

        return stories;
    }

    return null;
}
