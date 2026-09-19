import {
  AboutBusinessSection,
  AboutContactSection,
  AboutCustomersSection,
  AboutHero,
  AboutIntroductionSection,
  AboutLeadershipSection,
  AboutScaleSection,
  AboutStorySection,
  AboutValuesSection,
  AboutVisionSection,
} from "./about/AboutSections";
import SiteChrome from "./sections/SiteChrome";
import SiteFooter from "./sections/SiteFooter";
import { loadHomeContent } from "../lib/home/load-home-content";

type AboutPageProps = {
  siteContent: Awaited<ReturnType<typeof loadHomeContent>>["site"];
};

export default function AboutPage({ siteContent }: AboutPageProps) {
  return (
    <div className="about-page">
      <SiteChrome content={siteContent} homeHref="/" currentPath="/about" standalone />
      <main id="main">
        {/* <AboutHero /> */}
        <AboutIntroductionSection />
        <AboutStorySection />
        <AboutScaleSection />
        <AboutBusinessSection />
        <AboutVisionSection />
        <AboutValuesSection />
        <AboutLeadershipSection />
        <AboutCustomersSection />
        <AboutContactSection />
      </main>
      <SiteFooter homeHref="/" />
    </div>
  );
}
