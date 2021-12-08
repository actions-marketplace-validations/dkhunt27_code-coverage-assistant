// import { main } from "./main";

// test("should process coverage correctly", async () => {
//     const context = {
//         payload: {
//             action: "synchronize",
//             after: "f5cb09454855824788d2b4f7cc1fb54256c5ac3f",
//             before: "b14df65910dfa2e3cd8eabc30c04122b498cf6a3",
//             number: 3,
//             organization: [Object],
//             pull_request: [Object],
//             repository: [Object],
//             sender: [Object],
//         },
//         eventName: "pull_request",
//         sha: "f4440a96121991d40ad0ae17d35b14d0b33a1684",
//         ref: "refs/pull/3/merge",
//         workflow: "On PR to Main",
//         action: "__dkhunt27_code-coverage-assistant",
//         actor: "dkhunt27",
//         job: "pr_pipeline",
//         runNumber: 17,
//         runId: 1555597811,
//     };
//     const inputs = {
//         token: "***",
//         lcovFile: "./coverage/lcov.info",
//         baseFile: "",
//         appName: "",
//         monorepoBasePath: "./apps,./libs",
//     };

//     const lcov = await main(context, "someWorkspace", inputs);
//     expect(lcov).toEqual([
//         {
//             title: "",
//             file: "/files/project/foo.js",
//             lines: {
//                 found: 23,
//                 hit: 21,
//                 details: [
//                     {
//                         line: 20,
//                         hit: 3,
//                     },
//                     {
//                         line: 21,
//                         hit: 3,
//                     },
//                     {
//                         line: 22,
//                         hit: 3,
//                     },
//                 ],
//             },
//             functions: {
//                 hit: 2,
//                 found: 3,
//                 details: [
//                     {
//                         name: "foo",
//                         line: 19,
//                     },
//                     {
//                         name: "bar",
//                         line: 33,
//                     },
//                     {
//                         name: "baz",
//                         line: 54,
//                     },
//                 ],
//             },
//             branches: {
//                 hit: 4,
//                 found: 5,
//                 details: [
//                     {
//                         line: 21,
//                         block: 0,
//                         branch: 0,
//                         taken: 1,
//                     },
//                     {
//                         line: 21,
//                         block: 0,
//                         branch: 1,
//                         taken: 2,
//                     },
//                     {
//                         line: 22,
//                         block: 1,
//                         branch: 0,
//                         taken: 1,
//                     },
//                     {
//                         line: 22,
//                         block: 1,
//                         branch: 1,
//                         taken: 2,
//                     },
//                     {
//                         line: 37,
//                         block: 2,
//                         branch: 0,
//                         taken: 0,
//                     },
//                 ],
//             },
//         },
//     ]);
// });
