import { AboutCeoMessageSection, AboutContactSection, AboutGuidesSection, AboutIntroductionSection, AboutLeadershipSection, AboutStorySection, InnerBanner } from "./about/AboutSections";
import SiteChrome from "./sections/SiteChrome";
import SiteFooter from "./sections/SiteFooter";
import type { AboutContent } from "../lib/about/load-about-content";
import { loadHomeContent } from "../lib/home/load-home-content";

type AboutPageProps = {
  siteContent: Awaited<ReturnType<typeof loadHomeContent>>["site"];
  content: AboutContent;
};

export default function AboutPage({ siteContent, content }: AboutPageProps) {
  return (
    <div className="about-page">
      <SiteChrome content={siteContent} homeHref="/" currentPath="/about" standalone />
      <main id="main">
        <InnerBanner innerBanner={content.innerBanner} />
        <AboutIntroductionSection introduction={content.introduction} />
        <AboutStorySection story={content.story} />
        <AboutGuidesSection guides={content.guides} />
        <AboutCeoMessageSection ceo={content.ceo} />
        <AboutLeadershipSection leadership={content.leadership} />
        <AboutContactSection contact={content.contact} />
      </main>
      <SiteFooter content={siteContent} homeHref="/" />
    </div>
  );
}
