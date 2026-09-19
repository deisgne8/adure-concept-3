import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";

type TrustSectionProps = {
  content: HomeContent["trust"];
};

export default function TrustSection({ content }: TrustSectionProps) {
  return (
    <>
      <Section
        className="trust-v2 section"
        id={content.id}
        spacing={content.spacing}
      >
        <header className="trust-logo-head">
          <h2 className="trust-logo-title">Rooted in Trust and Transparency</h2>
          <p className="trust-logo-intro">
            ADURE works with government, semi government and private sector
            organisations across the UAE. Relationships of this scale are built
            through consistency, discretion and accountability, delivered over
            time.
          </p>
        </header>
        <div className="client-logo-groups">
          <section
            className="client-logo-group"
            aria-labelledby="government-semi-government"
          >
            <h3 id="government-semi-government">
              Government &amp; Semi-Government
            </h3>
            <div className="client-logo-viewport">
              <div className="client-logo-track">
                <div className="client-logo-run">
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/adnoc.png"
                      alt="ADNOC"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/taqa-distribution.png"
                      alt="TAQA Distribution"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/ministry-interior.png"
                      alt="Ministry of Interior"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/mubadala.png"
                      alt="Mubadala"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/abu-dhabi-police.png"
                      alt="Abu Dhabi Police"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/adia.png"
                      alt="Abu Dhabi Investment Authority"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="client-logo-run" aria-hidden="true">
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/adnoc.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/taqa-distribution.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/ministry-interior.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/mubadala.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/abu-dhabi-police.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/adia.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            className="client-logo-group"
            aria-labelledby="private-sector-corporates"
          >
            <h3 id="private-sector-corporates">
              Private Sector &amp; Corporates
            </h3>
            <div className="client-logo-viewport reverse">
              <div className="client-logo-track">
                <div className="client-logo-run">
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/oxy.png"
                      alt="Oxy"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/samsung.png"
                      alt="Samsung"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/schlumberger.png"
                      alt="Schlumberger"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/unicorp.png"
                      alt="Unicorp"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/total.png"
                      alt="Total"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo">
                    <img
                      src="assets/clients/profile/brighton-college.png"
                      alt="Brighton College Abu Dhabi"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="client-logo-run" aria-hidden="true">
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/oxy.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/samsung.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/schlumberger.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/unicorp.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/total.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="client-logo" aria-hidden="true">
                    <img
                      src="assets/clients/profile/brighton-college.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <a
          className="btn link trust-logo-cta"
          href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#customers"
        >
          Our customers
        </a>
      </Section>
    </>
  );
}
