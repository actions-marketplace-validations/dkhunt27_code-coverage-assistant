import fs, { promises } from "fs";
import path from "path";
import { parse } from "./lcov";
import { diff, diffForMonorepo } from "./comment";
import { upsertComment } from "./github";

/**
 * Find all files inside a dir, recursively.
 * @function getLcovFiles
 * @param  {string} dir Dir path string.
 * @return {string[{<package_name>: <path_to_lcov_file>}]} Array with lcove file names with package names as key.
 */
const getLcovFiles = (dir, filelist) => {
    let fileArray = filelist || [];
    fs.readdirSync(dir).forEach(file => {
        fileArray = fs.statSync(path.join(dir, file)).isDirectory()
            ? getLcovFiles(path.join(dir, file), fileArray)
            : fileArray
                  .filter(f => f.path.includes("lcov.info"))
                  .concat({
                      name: dir.split("/")[1],
                      path: path.join(dir, file),
                  });
    });

    return fileArray;
};

/**
 * Find all files inside a dir, recursively for base branch.
 * @function getLcovBaseFiles
 * @param  {string} dir Dir path string.
 * @return {string[{<package_name>: <path_to_lcov_file>}]} Array with lcove file names with package names as key.
 */
const getLcovBaseFiles = (dir, filelist) => {
    let fileArray = filelist || [];
    fs.readdirSync(dir).forEach(file => {
        fileArray = fs.statSync(path.join(dir, file)).isDirectory()
            ? getLcovBaseFiles(path.join(dir, file), fileArray)
            : fileArray
                  .filter(f => f.path.includes("lcov-base.info"))
                  .concat({
                      name: dir.split("/")[1],
                      path: path.join(dir, file),
                  });
    });

    return fileArray;
};

export const main = async (
    context,
    client,
    githubWorkspace,
    { lcovFile, baseFile, appName, monorepoBasePath },
) => {
    const raw =
        !monorepoBasePath &&
        (await promises
            .readFile(lcovFile, "utf-8")
            .catch(err => console.error(err)));
    if (!monorepoBasePath && !raw) {
        console.log(`No coverage report found at '${lcovFile}', exiting...`);

        return;
    }

    const baseRaw =
        baseFile &&
        (await promises
            .readFile(baseFile, "utf-8")
            .catch(err => console.error(err)));
    if (!monorepoBasePath && baseFile && !baseRaw) {
        console.log(`No coverage report found at '${baseFile}', ignoring...`);
    }

    let lcovArray = [];
    let lcovBaseArray = [];

    if (monorepoBasePath) {
        console.log(`Processing monorepoBasePath '${monorepoBasePath}' `);
        const parts = monorepoBasePath.split(",");
        console.log(`Parsed monorepoBasePath '${parts}' `);
        parts.forEach(item => {
            console.log(`Part monorepoBasePath '${item}' `);
            const lcovFiles = getLcovFiles(item);
            console.log({ lcovFiles });
            lcovArray = lcovArray.concat(lcovFiles);
            console.log({ lcovArray });
            const lcovBaseFiles = getLcovBaseFiles(item);
            console.log({ lcovBaseFiles });
            lcovBaseArray = lcovBaseArray.concat(lcovBaseFiles);
            console.log({ lcovBaseArray });
        });
    }

    const lcovArrayForMonorepo = [];
    const lcovBaseArrayForMonorepo = [];
    for (const file of lcovArray) {
        if (file.path.includes(".info")) {
            const rLcove = await promises.readFile(file.path, "utf8");
            const data = await parse(rLcove);
            lcovArrayForMonorepo.push({
                packageName: file.name,
                lcov: data,
            });
        }
    }

    for (const file of lcovBaseArray) {
        if (file.path.includes(".info")) {
            const rLcovBase = await promises.readFile(file.path, "utf8");
            const data = await parse(rLcovBase);
            lcovBaseArrayForMonorepo.push({
                packageName: file.name,
                lcov: data,
            });
        }
    }

    const options = {
        repository: context.payload.repository.full_name,
        commit: context.payload.pull_request.head.sha,
        prefix: `${githubWorkspace}/`,
        head: context.payload.pull_request.head.ref,
        base: context.payload.pull_request.base.ref,
        appName,
    };

    const lcov = !monorepoBasePath && (await parse(raw));
    const baselcov = baseRaw && (await parse(baseRaw));

    await upsertComment({
        client,
        context,
        prNumber: context.payload.pull_request.number,
        body: !lcovArrayForMonorepo.length
            ? diff(lcov, baselcov, options)
            : diffForMonorepo(
                  lcovArrayForMonorepo,
                  lcovBaseArrayForMonorepo,
                  options,
              ),
        hiddenHeader: appName
            ? `<!-- ${appName}-code-coverage-assistant -->`
            : `<!-- monorepo-code-coverage-assistant -->`,
    });
};
