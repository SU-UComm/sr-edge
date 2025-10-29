//

// Handle requests to Funnelback
async function getTopicStoriesFromFunnelback({ endpoint, topicId }) {
  try {
    const query = `${endpoint}?profile=stanford-report-global-search-dev_preview&collection=sug~sp-stanford-university-report-search-dev&query=[taxonomyContentMainTopicId:${topicId} taxonomyContentTopicsId:${topicId} taxonomyContentSubtopicsId:${topicId}]&num_ranks=1000&sort=date&log=false`;
    const response = await fetch(`${query}`);
    if (!response.ok) {
      throw new Error(`Error fetching data from ${query}`);
    }
    return await response.json();
  } catch (err) {
    console.log("error", err);
  }
}

// make the PUT request using the fetched XML data in the payload
async function setMxFbUpdate(id, envVars) {
  try {
    const query = `${envVars.MX_ENDPOINT}${id}`;
    const response = await fetch(`${query}`);
    if (!response.ok) {
      throw new Error(`Error pushing data for ID: ${id}`);
    }
    return response.json();
  } catch (err) {
    console.log("error", err);
  }
}

// Function to process the GET and PUT requests concurrently with a limit
async function processRequests({
  data = [],
  concurrencyLimit = 1,
  envVars = null,
  reporting = true,
}) {
  const fbData = data.map((item) => ({
    id: item.listMetadata.id[0],
    key: item.indexUrl,
  }));
  if (reporting) {
    console.log("REPORTING enabled");
  }
  console.log("originals", JSON.stringify(fbData));

  // Function to process a single item
  const processItem = async (item) => {
    try {
      if (!reporting) {
        await setMxFbUpdate(item.id, envVars);
      }
      console.log("processed", item.id);
      return { id: item.id, success: true };
    } catch (error) {
      console.error(`Error processing ID ${item.id}:`, error);
      return { id: item.id, success: false, error };
    }
  };

  // Queue to manage tasks
  const results = [];
  const executing = new Set();

  async function runTask(item) {
    const promise = processItem(item);
    executing.add(promise);

    try {
      const result = await promise;
      results.push(result);
    } finally {
      executing.delete(promise); // Remove task when done (success or failure)
    }
  }

  // Process items with concurrency limit
  const iterator = fbData.entries();
  while (true) {
    while (executing.size < concurrencyLimit) {
      const { value, done } = iterator.next();
      if (done) break;
      const [, item] = value; // Ignore index, get item
      runTask(item);
    }
    if (executing.size === 0) break;
    await Promise.race(executing); // Wait for at least one task to finish
  }

  // Wait for all remaining tasks to complete
  await Promise.all(executing);

  return results; // Return results for further processing if needed
}

async function topicUpdateActions({ topicId, envVars }) {
  // fetch the Story FB results that use the Topic ID
  const fbData = await getTopicStoriesFromFunnelback({
    endpoint: envVars.FB_SEARCH_ENDPOINT,
    topicId,
  });
  const storiesToUpdate = fbData?.response?.resultPacket?.results;

  // finish if there are no stories to update
  if (!storiesToUpdate || storiesToUpdate.length === 0) {
    console.log("No Stories to update. Finishing job");
    return;
  }

  console.log("stories matching", storiesToUpdate.length);

  await processRequests({
    data: storiesToUpdate,
    concurrencyLimit: 1,
    envVars,
    reporting: false,
  });
  console.log("All requests completed");
}

async function topicDeleteActions({ topicId, envVars }) {
  console.log("DELETE requests");
}

module.exports = async function (input, context) {
  // Some error handling
  if (!input) {
    console.error("Error: input is missing/not defined");
    return;
  }
  if (!context || !context.environment) {
    console.error("Error: context is missing/not defined");
    return;
  }

  try {
    // source our input variables
    const { topicId = null, action = null } = input;
    const envVars = context.environment;
    // source environment variables
    if (!action) {
      throw new Error(
        `Error: action is missing/not defined. Recieved ${action}`
      );
    }
    if (!topicId) {
      throw new Error(
        `Error: topicId is missing/not defined. Recieved ${topicId}`
      );
    }
    console.log("Topic action:", action);
    console.log("Topic Id:", topicId);

    switch (action) {
      case "update":
        topicUpdateActions({ topicId, envVars });
        break;
      case "delete":
        topicDeleteActions({ topicId, envVars });
        break;
      default:
        throw new Error(
          `Error: The value of 'action' does not match a known action type. Recieved ${action}`
        );
    }
  } catch (err) {
    console.log(err);
  }
};
