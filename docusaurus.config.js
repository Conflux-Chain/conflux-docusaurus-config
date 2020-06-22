const { resolve } = require("path");
const stipStyle = require(resolve(
  __dirname,
  "./development/rehype-strip-styles-in-md"
));
const { lang: cfxLang } = require(resolve(__dirname, "./cfxdoc.config.json"));
const isEN = cfxLang === "en";

const GH_REPO_URL = isEN
  ? "https://github.com/Conflux-Chain/conflux-developer-site"
  : `https://github.com/Conflux-Chain/${cfxLang}.developer.conflux-chain.org`;

const SITE_URL = `https://${
  isEN ? "" : cfxLang + "."
}developer.conflux-chain.org`;

const trans = require(resolve(__dirname, "./src/i18n.js"))[cfxLang];

process.env.CFX_LANG = cfxLang;

module.exports = {
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
      copyright: `Copyright © ${new Date().getFullYear()} Conflux Chain, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: resolve(__dirname, "./docs"),
          routeBasePath: "docs",
          sidebarPath: resolve(__dirname, "./sidebars.json"),
          editUrl: GH_REPO_URL + "/edit/master",
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          rehypePlugins: [stipStyle],
        },
        theme: {
          customCss: resolve(__dirname, "./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    [
      "docusaurus2-dotenv",
      { systemvars: true },
    ],
  ],
};
