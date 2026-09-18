import HomeClient from "./HomeClient";
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

export default function HomePage() {
  return (
    <>
      <HomeClient />
      <SiteChrome />
      <main id="main">
        <section className="home-v2" id="home">
          <HeroSection />
          <JourneysSection />
          <DiscoverySection />
          <ManagementSection />
          <ProofSection />
          <PortfolioSection />
          <TransitionSection />
          <SellSection />
          <TrustSection />
          <ConversationSection />
        </section>
      </main>
      <SiteFooter />
      <HomeOverlays />
    </>
  );
}