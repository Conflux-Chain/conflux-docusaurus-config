const { resolve } = require("path")
const siteDir = process.env.__CFX_DOC_SITE_DIR
const stipStyle = require(resolve(
  siteDir,
  "./development/rehype-strip-styles-in-md"
))
const { lang: cfxLang } = require(resolve(siteDir, "./cfxdoc.config.json"))
const isEN = cfxLang === "en"
const domainName = isEN
  ? "developer.conflux-chain.org"
  : cfxLang + ".developer.conflux-chain.org"

const GH_REPO_URL = isEN
  ? "https://github.com/Conflux-Chain/conflux-developer-site"
  : `https://github.com/Conflux-Chain/${cfxLang}.developer.conflux-chain.org`

const SITE_URL = "https://" + domainName

const trans = require(resolve(siteDir, "./src/i18n.js"))[cfxLang]

process.env.CFX_LANG = cfxLang

const algolia = {
  apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
  indexName: process.env.ALGOLIA_INDEX_NAME,
}

const docusaurusConfig = {
  title: "Conflux",
  tagline: trans["homepage/generalDescription"],
  url: SITE_URL,
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "Conflux-Chain", // Usually your GitHub org/user name.
  projectName: "conflux-developer-site", // Usually your repo name.
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: "Conflux Developer",
      logo: {
        alt: "Conflux Logo",
        src: "img/logo.svg",
      },
      links: [
        // {
        //   to: isEN
        //  ? "docs/introduction/en/conflux_overview"
        //  : "docs/introduction/conflux_overview",
        //   label: "Docs",
        //   position: "left"
        // },
        // { to: "blog", label: "Blog", position: "left" },
        {
          href: GH_REPO_URL,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: trans.Docs,
          items: [
            {
              label: trans["Overview"],
              to: isEN
                ? "docs/introduction/en/conflux_overview"
                : "docs/introduction/conflux_overview",
            },
            {
              label: "Portal",
              to: isEN
                ? "docs/conflux-portal/docs/en/portal/introduction"
                : "docs/conflux-portal/docs/portal/introduction",
            },
          ],
        },
        {
          title: trans.Community,
          items: [
            {
              label: "Bounty",
              href: "https://bounty.conflux-chain.org",
            },
            // {
            //   label: "Discord",
            //   href: "https://discordapp.com/invite/docusaurus"
            // }
          ],
        },
        {
          title: trans.Social,
          items: [
            // {
            //   label: "Blog",
            //   to: "blog"
            // },
            {
              label: "GitHub",
              href: "https://github.com/Conflux-Chain",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/Conflux_Network",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Conflux. All Rights Reserved.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: resolve(siteDir, "./docs"),
          routeBasePath: "docs",
          sidebarPath: resolve(siteDir, "./sidebars.json"),
          editUrl: GH_REPO_URL + "/edit/master",
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          rehypePlugins: [stipStyle],
        },
        theme: {
          customCss: resolve(siteDir, "./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [["docusaurus2-dotenv", { systemvars: true }]],
}

if (process.env.ALGOLIA_SEARCH_API_KEY) {
  docusaurusConfig.themeConfig.algolia = algolia
}

module.exports = docusaurusConfig
