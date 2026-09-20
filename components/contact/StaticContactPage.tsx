import type { HomeContent } from "../../lib/home/load-home-content";
import type { ContactContent, ContactDetail } from "../../lib/contact/types";
import { useFormik } from "formik";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";
import { aosSequenceDelay } from "../../lib/aos";

type Props = {
  content: ContactContent;
  site: HomeContent["site"];
};

type ContactFormValues = {
  name: string;
  phone: string;
  inquiry: string;
  message: string;
  privacy: boolean;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues | "form", string>>;

const phonePattern = /^[+()\d\s-]{7,20}$/;

function ContactDetailRow({ detail, index }: { detail: ContactDetail; index: number }) {
  const copy = detail.lines.map((line, index) => (
    <span key={line}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));

  return (
    <article data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)}>
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
  const formik = useFormik<ContactFormValues>({
    initialValues: {
      name: "",
      phone: "",
      inquiry: content.form.inquiryOptions[0] ?? "",
      message: "",
      privacy: false,
    },
    validate: (values) => {
      const errors: ContactFormErrors = {};
      const name = values.name.trim();
      const phone = values.phone.trim();
      const message = values.message.trim();

      if (name.length < 2) {
        errors.name = "Please enter your full name.";
      }

      if (!phonePattern.test(phone)) {
        errors.phone = "Please enter a valid phone number.";
      }

      if (!content.form.inquiryOptions.includes(values.inquiry)) {
        errors.inquiry = "Please choose an inquiry type.";
      }

      if (message.length > 1200) {
        errors.message = "Please keep your message under 1200 characters.";
      }

      if (!values.privacy) {
        errors.privacy = "Please agree before submitting.";
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      try {
        const response = await fetch(content.form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name.trim(),
            phone: values.phone.trim(),
            inquiry: values.inquiry,
            message: values.message.trim(),
            privacy: values.privacy,
          }),
        });
        const result = await response.json().catch(() => null) as { message?: string } | null;

        if (!response.ok) {
          helpers.setStatus({
            type: "error",
            message: result?.message ?? "We could not send your message. Please try again.",
          });
          return;
        }

        helpers.resetForm();
        helpers.setStatus({
          type: "success",
          message: result?.message ?? "Thank you. Your message has been sent.",
        });
      } catch {
        helpers.setStatus({
          type: "error",
          message: "We could not send your message. Please check your connection and try again.",
        });
      }
    },
  });

  const getFieldError = (field: keyof ContactFormValues) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;

  const status = formik.status as { type: "success" | "error"; message: string } | undefined;

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

            <form className="contact-form" data-aos="fade-left" noValidate onSubmit={formik.handleSubmit}>
              <label htmlFor="contact-name">
                {content.form.nameLabel}
                <input
                  aria-invalid={Boolean(getFieldError("name"))}
                  aria-describedby={getFieldError("name") ? "contact-name-error" : undefined}
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder={content.form.namePlaceholder}
                  autoComplete="name"
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {getFieldError("name") ? <span className="field-error" id="contact-name-error">{getFieldError("name")}</span> : null}
              </label>
              <label htmlFor="contact-phone">
                {content.form.phoneLabel}
                <input
                  aria-invalid={Boolean(getFieldError("phone"))}
                  aria-describedby={getFieldError("phone") ? "contact-phone-error" : undefined}
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder={content.form.phonePlaceholder}
                  autoComplete="tel"
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {getFieldError("phone") ? <span className="field-error" id="contact-phone-error">{getFieldError("phone")}</span> : null}
              </label>
              <label htmlFor="contact-type">
                {content.form.inquiryLabel}
                <select
                  aria-invalid={Boolean(getFieldError("inquiry"))}
                  aria-describedby={getFieldError("inquiry") ? "contact-type-error" : undefined}
                  id="contact-type"
                  name="inquiry"
                  value={formik.values.inquiry}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                >
                  {content.form.inquiryOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                {getFieldError("inquiry") ? <span className="field-error" id="contact-type-error">{getFieldError("inquiry")}</span> : null}
              </label>
              <label className="message-label" htmlFor="contact-message">
                <span className="field-heading">
                  {content.form.messageLabel} <em>{content.form.messageOptionalLabel}</em>
                </span>
                <textarea
                  aria-invalid={Boolean(getFieldError("message"))}
                  aria-describedby={getFieldError("message") ? "contact-message-error" : undefined}
                  id="contact-message"
                  name="message"
                  placeholder={content.form.messagePlaceholder}
                  value={formik.values.message}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {getFieldError("message") ? <span className="field-error" id="contact-message-error">{getFieldError("message")}</span> : null}
              </label>
              <Button className="button-wipe contact-submit" disabled={formik.isSubmitting} type="submit">
                <span>{formik.isSubmitting ? "Sending..." : content.form.submitLabel}</span>
              </Button>
              <label className="contact-consent">
                <input
                  aria-invalid={Boolean(getFieldError("privacy"))}
                  aria-describedby={getFieldError("privacy") ? "contact-privacy-error" : undefined}
                  checked={formik.values.privacy}
                  name="privacy"
                  type="checkbox"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                <span>{content.form.consentLabel}</span>
                {getFieldError("privacy") ? <span className="field-error" id="contact-privacy-error">{getFieldError("privacy")}</span> : null}
              </label>
              {status ? <p className={`form-status is-${status.type}`} role="status">{status.message}</p> : null}
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
