export default async function Home() {
    return `
    <!doctype html>
    <html lang="en" class="">
    <head>
        <title>Stanford Report</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charset="utf-8" />

        <link rel="dns-prefetch" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com/">

        <script>window.pageController={"id":130290,"status":16,"topicPath":"/home-page","isStory":false,"mainTopic":"","mainTopicId":"","contentType":"","storyLayout":"","search":{"endpoint":"https://news.stanford.edu/_api/fb/query","collection":"sug~sp-stanford-report-search","profile":"stanford-report-push-search","resultPage":"https://news.stanford.edu/search"},"title":"Home Page","gaData":{"publishedDate":"1730098800","srContentCategory":null,"srContentCategoryText":"","srFeaturedUnit":null,"srFeaturedUnitText":"","srContentMainTopic":null,"srContentMainTopicText":"","srContentTopic":null,"srContentTopicText":null,"srContentSubtopic":null,"srContentSubtopicText":null,"srContentType":null,"srContentTypeText":"","srByline":"null","srContributors":{"authors":null,"writers":null,"editors":null,"producers":null}}}</script>

        <link preload href="http://localhost:4000/mysource_files/global/bundle.css" rel="stylesheet"/>
    </head>

    <body class="home dark:su-bg-black-true dark:su-text-white">
        <a id="skiplinks" href="#main-content" class="skiplink">Skip to content</a>

        <!--@@ cmp stanford-apb/header-component/raw @@-->
     
        <main id="main-content" role="main" class="su-page su-page--hero su-page--top-margin su-page--bottom-margin">
            <div class="su-page-wrap">

                <div class="su-upper-content" id="component_130035">
                    <h1 class="sr-only">Home Page</h1>
                </div>
                

                <div class="su-page-content">

                    <!--@@ cmp stanford-apb/combined-content-grid/raw @@-->

                </div>

            </div>
        </main>

        <!--@@ cmp stanford-apb/footer/raw @@-->

    <script src="http://localhost:4000/mysource_files/global/bundle.js"></script>

    </body>
    </html>`;
}