// eslint-disable-next-line import/extensions
import job from "../main.js";

async function runJobLocally() {
  // replicate job runners context.environment
  const context = {
    environment: {
      FB_SEARCH_ENDPOINT: process.env.FB_SEARCH_ENDPOINT,
      FB_SEARCH_COLLECTION: process.env.FB_SEARCH_COLLECTION,
      FB_SEARCH_PROFILE: process.env.FB_SEARCH_PROFILE,
      MX_ENDPOINT: process.env.MX_ENDPOINT,
    },
  };

  // replicate job runners input
  const input = {
    topicId: "168142",
    action: "update",
  };
  // run the job!
  job(input, context);
}

runJobLocally();
