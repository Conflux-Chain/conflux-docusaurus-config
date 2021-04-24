import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import useThemeContext from "@theme/hooks/useThemeContext";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import i18n from "../i18n";
const trans = i18n[process.env.CFX_LANG];

const features = [
  {
    title: <>{trans.LearnAboutConflux}</>,
    imageUrl: {
      dark: "img/scalability-dark.svg",
      light: "img/scalability-light.svg",
    },
    description: <>{trans["homepage/LearnDescription"]}</>,
    link: '/docs/introduction/en/conflux_overview',
    linkText: 'Learn'
  },
  {
    title: <>{trans.RunANode}</>,
    imageUrl: {
      dark: "img/extensive-dark.svg",
      light: "img/extensive-light.svg",
    },
    description: <>{trans["homepage/RunDescription"]}</>,
    link: '/docs/conflux-doc/docs/installation',
    linkText: 'Go'
  },
  {
    title: <>{trans.StartBuild}</>,
    imageUrl: {
      dark: "img/security-dark.svg",
      light: "img/security-light.svg",
    },
    description: <>{trans["homepage/BuildDescription"]}</>,
    link: '/docs/conflux-doc/docs/send_transaction',
    linkText: 'Build'
  },
];

function Feature({ imageUrl, title, description, link, linkText }) {
  const { isDarkTheme } = useThemeContext();
  const theme = isDarkTheme ? "dark" : "light";
  const imgUrl = useBaseUrl(imageUrl[theme]);
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3 className="text--center">{title}</h3>
      <p className="text--center">{description}</p>
      <p className='text--center'>
        <a className={classnames('button button--outline button--secondary', styles.customButton)} href={link}>{linkText}</a>
      </p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={classnames("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl(
                `/docs/introduction/${
                  process.env.CFX_LANG === "en" ? "en/" : ""
                }conflux_overview`
              )}
            >
              {trans.getStarted}
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} imageUrl={props.imageUrl} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
