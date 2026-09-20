import type { CSSProperties } from "react";
import Section from "../ui/Section";
import Button from "../ui/Button";
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
        style={{
          "--sell-background": `url("${content.background}")`,
        } as CSSProperties}
      >
        <div className="section-shell sell-layout">
          <div className="sell-copy" data-aos="fade-right">
            <h2 id="sell-title">{content.heading}</h2>
            <p>{content.description}</p>
          </div>
          <form className="sell-form" action={content.form.action} method="post" encType="text/plain" data-sell-form data-aos="fade-left">
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
                <select id="sell-type" name="type" defaultValue="" required>
                  <option value="" disabled>
                    Select property type
                  </option>
                  {content.form.propertyTypes.map((propertyType) => (
                    <option key={propertyType}>{propertyType}</option>
                  ))}
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
              <Button showArrow variant="primary" type="submit">
                {content.form.button}
              </Button>
            </div>
            <p className="sell-form-note">{content.form.note}</p>
          </form>
        </div>
      </Section>
    </>
  );
}
