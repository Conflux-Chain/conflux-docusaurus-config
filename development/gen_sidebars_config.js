const fs = require("fs");
const { promisify } = require("util");
const { resolve: presolve } = require("path");
const mustache = require("mustache");
const globby = require("globby");
const simpleGit = require("simple-git");
const siteDir = process.env.__CFX_DOC_SITE_DIR

const writeFile = promisify(fs.writeFile);
const {
  docs: { path: docsRootDir, include = ["**/*.{md,mdx}"] },
} = require(presolve(siteDir, "docusaurus.config.js")).presets[0][1];
const {
  default: processMetadata,
} = require("@docusaurus/plugin-content-docs/lib/metadata.js");

const template = fs.readFileSync(
  presolve(siteDir, "development/sidebars.generated.json.mustache"),
  "utf-8"
);
const configs = require(presolve(siteDir, "sidebars.js"));

const docsDirs = fs
  .readdirSync(presolve(siteDir, "docs"))
  .filter((path) =>
    fs.lstatSync(presolve(siteDir, "docs", path)).isDirectory()
  );
const docsDirsMetadata = {};
// const gitSubmoduleDir = presolve(__dirname, "../.git/module");

function eachSidebarDoc(sidebarArr, processDocFn) {
  for (let i = 0; i < sidebarArr.length; i++) {
    if (sidebarArr[i].type === "category")
      sidebarArr[i].items = eachSidebarDoc(sidebarArr[i].items, processDocFn);
    else if (sidebarArr[i].type === "doc")
      sidebarArr[i] = processDocFn(sidebarArr[i]);
    else
      throw new Error(`don't support sidebar item type: ${sidebarArr[i].type}`);
  }

  return sidebarArr;
}

function processSidebarDoc(mdMetadatas) {
  return function ({ type, id, folder }) {
    const md = mdMetadatas.find(
      (metadata) => metadata.baseId === id && metadata.folder === folder
    );

    if (!md) {
      console.error(
        new Error(`Can't find markdown file with the id: ${id} under ${folder}`)
      );
      process.exit(1);
    }

    return {
      type,
      id: md.id,
    };
  };
}

(async function () {
  await Promise.all(
    docsDirs.map(async (path) => {
      const absPath = presolve(siteDir, "docs", path);
      const git = simpleGit(absPath);
      const remoteUrl = await promisify(git.getRemotes).call(git, true);
      docsDirsMetadata[path] = {
        absPath,
        remoteUrl: remoteUrl[0].refs.fetch,
      };
    })
  );

  const docsFiles = (
    await globby(include, { cwd: docsRootDir })
  ).filter((path) => path.includes("/"));

  const mdMetadatas = await Promise.all(
    docsFiles.map(async (source) => {
      const metadata = await processMetadata({
        source,
        refDir: docsRootDir,
        options: {
          routeBasePath: "docs",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        env: { versioning: false },
        context: { siteDir, baseUrl: "/" },
      });

      const path = metadata.id.slice(0, metadata.id.indexOf("/"));
      const { remoteUrl } = docsDirsMetadata[path];
      const re = new RegExp(/^@site\/docs\/[\w_-]*\//g);
      re.test(metadata.source);
      metadata.editUrl = `${remoteUrl.slice(
        0,
        remoteUrl.length - 4
      )}/edit/master/${metadata.source.slice(re.lastIndex)}`;
      metadata.folder = path;
      if (metadata.id.lastIndexOf("/") === -1) metadata.baseId = metadata.id;
      metadata.baseId = metadata.id.slice(metadata.id.lastIndexOf("/") + 1);

      return metadata;
    })
  );

  return writeFile(
    presolve(siteDir, `./sidebars.json`),
    mustache.render(template, {
      config: JSON.stringify(
        eachSidebarDoc(configs.docs, processSidebarDoc(mdMetadatas))
      ),
    })
  );
})();
