import HomeClient from "./HomeClient";
import SmoothScroll from "./SmoothScroll";
import ConversationSection from "./sections/ConversationSection";
import DiscoverySection from "./sections/DiscoverySection";
import HeroSection from "./sections/HeroSection";
import JourneysSection from "./sections/JourneysSection";
import ManagementSection from "./sections/ManagementSection";
import HomeOverlays from "./sections/HomeOverlays";
import PortfolioSection from "./sections/PortfolioSection";
import ProofSection from "./sections/ProofSection";
import SellSection from "./sections/SellSection";
import SiteChrome from "./sections/SiteChrome";
import SiteFooter from "./sections/SiteFooter";
import TransitionSection from "./sections/TransitionSection";
import TrustSection from "./sections/TrustSection";
import type { HomeContent } from "../lib/home/load-home-content";

type HomePageProps = {
  content: HomeContent;
};

export default function HomePage({ content }: HomePageProps) {
  return (
    <>
      <HomeClient />
      <SmoothScroll />
      <SiteChrome content={content.site} />
      <main id="main">
        <section className="home-v2" id="home">
          <HeroSection content={content.hero} />
          <JourneysSection content={content.journeys} />
          <DiscoverySection content={content.discovery} />
          <ManagementSection content={content.management} />
          <ProofSection content={content.proof} />
          <PortfolioSection content={content.portfolio} />
          <TransitionSection content={content.transition} />
          <SellSection content={content.sell} />
          <TrustSection content={content.trust} />
          <ConversationSection content={content.conversation} />
        </section>
      </main>
      <SiteFooter />
      <HomeOverlays />
    </>
  );
}
