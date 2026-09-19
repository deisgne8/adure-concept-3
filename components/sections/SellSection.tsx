import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";

type SellSectionProps = {
  content: HomeContent["sell"];
};

export default function SellSection({ content }: SellSectionProps) {
  return (
    <>
      <Section
        className="sell-v2 section"
        id={content.id}
        aria-labelledby="sell-title"
        spacing={content.spacing}
      >
        <div className="section-shell sell-layout">
          <div className="sell-copy">
            <h2 id="sell-title">Sell with clarity and confidence</h2>
            <p>
              From positioning and presentation to qualified enquiries, ADURE
              helps owners introduce their property to the market and sell with
              a strategy built around value.
            </p>
          </div>
          <form className="sell-form" data-sell-form>
            <div className="sell-fields">
              <label htmlFor="sell-location">
                Property Location
                <input
                  id="sell-location"
                  name="location"
                  type="text"
                  placeholder="City or community"
                  required
                />
              </label>
              <label htmlFor="sell-type">
                Property Type
                <select id="sell-type" name="type" required>
                  <option value="" disabled selected>
                    Select property type
                  </option>
                  <option>Residential</option>
                  <option>Retail</option>
                  <option>Commercial</option>
                  <option>Other</option>
                </select>
              </label>
              <label htmlFor="sell-name">
                Name
                <input
                  id="sell-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
              <label htmlFor="sell-phone">
                Phone
                <input
                  id="sell-phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  autoComplete="tel"
                  required
                />
              </label>
              <label htmlFor="sell-email">
                Email
                <input
                  id="sell-email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                />
              </label>
              <button className="btn primary" type="submit">
                Discuss My Property <span aria-hidden="true">→</span>
              </button>
            </div>
            <p className="sell-form-note">
              Opens an email draft with your property details.
            </p>
          </form>
        </div>
      </Section>
    </>
  );
}
