import Link from "next/link";
import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";

type ConversationSectionProps = {
  content: HomeContent["conversation"];
};

export default function ConversationSection({
  content,
}: ConversationSectionProps) {
  return (
    <>
      <Section
        className="final-v2 section"
        id={content.id}
        spacing={content.spacing}
      >
        <img
          src="assets/hidd-al-saadiyat/saadiyat-aerial-beach.webp"
          alt="Aerial view of the Hidd Al Saadiyat beach and waterfront"
          width="2400"
          height="3600"
          loading="lazy"
        />
        <div className="section-shell">
          <div className="final-layout">
            <div>
              <h2>Every Next Move Begins with the Right Partner</h2>
              <p>
                Whether you are finding a place, bringing a property to market
                or placing an asset under management, ADURE brings clarity to
                what comes next.
              </p>
            </div>
            <div className="final-links">
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#properties">
                Find a property
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#list-property">
                Sell with ADURE
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#services">
                Property management
              </a>
              <Link href="/contact">
                Contact ADURE
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
