# What is this Job Runner repository for?
This job updates Funnelback records when a Topic is updated. It finds all stories that reference the changed topic, and updates their PUSH indexes.

# Getting started
Within the root directory of this job, switch to the correct node version (v20) using `nvm use`

## Install node modules

Run `npm install`

## Set up .env file

An `.env.example` file has been provided.

Copy the `.env.example` and rename it to `.env`

You can find any variable values within the job context in the DXP
`https://dxp.squiz.cloud/organization/{org-id}/configuration/job-runner/contexts`

# Development
## Input
For local simulation, the `local/index.mjs` file contains all data required to simulate your job. The values here must match the manifest.json input.

## Contexts
Similarly to Input, local simulation for Contexts is managed from the `local/index.mjs` file.

## Testing locally

`npm run start`


# Publish to Job Runner

To be able to publish to job runner, you need to be authenticated to DXP and logged into the correct tenant.
Run `npm run login` to login to DXP and select the correct tenant.

Then run `npm run build` to create a dist folder which contains:
- main.js
- manifest.json

To publish, run `npm run publish` to upload the script to Job Runner
