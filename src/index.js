import core from "@actions/core";
import github from "@actions/github";
import { main } from "./main";

const execute = async () => {
    const { context = {} } = github || {};

    const token = core.getInput("github-token");
    const lcovFile = core.getInput("lcov-file") || "./coverage/lcov.info";
    const baseFile = core.getInput("lcov-base");
    const appName = core.getInput("app-name");
    // Add base path for monorepo
    const monorepoBasePath = core.getInput("monorepo-base-path");

    const client = github.getOctokit(token);

    console.log(JSON.stringify(context, null, 2));
    console.log(JSON.stringify(client, null, 2));
    console.log({
        lcovFile,
        baseFile,
        appName,
        monorepoBasePath,
    });

    await main(context, client, process.env.GITHUB_WORKSPACE, {
        lcovFile,
        baseFile,
        appName,
        monorepoBasePath,
    });
};

execute().catch(err => {
    console.log(err);
    core.setFailed(err.message);
});
