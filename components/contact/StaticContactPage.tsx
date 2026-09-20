import type { HomeContent } from "../../lib/home/load-home-content";
import type { ContactContent, ContactDetail } from "../../lib/contact/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";

type Props = {
  content: ContactContent;
  site: HomeContent["site"];
};

function ContactDetailRow({ detail, index }: { detail: ContactDetail; index: number }) {
  const copy = detail.lines.map((line, index) => (
    <span key={line}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));

  return (
    <article data-aos="fade-up" data-aos-delay={index * 90}>
      <span className="contact-icon" aria-hidden="true">
        <img src={detail.icon} alt={detail.iconAlt} />
      </span>
      <div>
        <h2>{detail.label}</h2>
        <p>{detail.href ? <a href={detail.href}>{copy}</a> : copy}</p>
      </div>
    </article>
  );
}

export default function StaticContactPage({ content, site }: Props) {
  const prepareMail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const recipient = content.form.action.replace(/^mailto:/, "");
    const subject = `${data.get("inquiry")} enquiry from ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Inquiry: ${data.get("inquiry")}`,
      `Message: ${data.get("message") || "Not provided"}`,
    ].join("\n");
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="contact-page">
      <SiteChrome
        content={site}
        currentPath="/contact"
        homeHref="/"
        skipTargetId="contact-main"
        surface="solid"
        standalone
      />

      <main id="contact-main" className="contact-main">
        <section className="contact-card" aria-labelledby="contact-title">
          <div className="contact-grid">
            <div className="contact-copy" data-aos="fade-right">
              <h1 id="contact-title">{content.intro.heading}</h1>
              <p className="contact-lede">{content.intro.description}</p>

              <div className="contact-details" aria-label="ADURE contact details">
                {content.details.map((detail, index) => <ContactDetailRow detail={detail} index={index} key={detail.label} />)}
              </div>
            </div>

            <form className="contact-form" action={content.form.action} method="post" encType="text/plain" data-aos="fade-left" onSubmit={prepareMail}>
              <label htmlFor="contact-name">
                {content.form.nameLabel}
                <input id="contact-name" name="name" type="text" placeholder={content.form.namePlaceholder} autoComplete="name" required />
              </label>
              <label htmlFor="contact-phone">
                {content.form.phoneLabel}
                <input id="contact-phone" name="phone" type="tel" placeholder={content.form.phonePlaceholder} autoComplete="tel" required />
              </label>
              <label htmlFor="contact-type">
                {content.form.inquiryLabel}
                <select id="contact-type" name="inquiry" required defaultValue={content.form.inquiryOptions[0]}>
                  {content.form.inquiryOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="message-label" htmlFor="contact-message">
                <span className="field-heading">
                  {content.form.messageLabel} <em>{content.form.messageOptionalLabel}</em>
                </span>
                <textarea id="contact-message" name="message" placeholder={content.form.messagePlaceholder} />
              </label>
              <Button className="contact-submit" type="submit" variant="primary">{content.form.submitLabel}</Button>
              <label className="contact-consent">
                <input type="checkbox" name="privacy" required />
                <span>{content.form.consentLabel}</span>
              </label>
            </form>
          </div>

          <section className="contact-map" aria-label={content.map.title} data-aos="fade-up">
            <iframe
              title={content.map.title}
              src={content.map.embedUrl}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a className="contact-map-link" href={content.map.externalUrl} target="_blank" rel="noopener noreferrer">
              {content.map.externalLabel}
            </a>
          </section>
        </section>
      </main>

      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
import type { FormEvent } from "react";
