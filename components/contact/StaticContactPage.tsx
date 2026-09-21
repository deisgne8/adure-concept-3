import type { HomeContent } from "../../lib/home/load-home-content";
import type { ContactContent } from "../../lib/contact/types";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";
import ContactLocationMap from "./ContactLocationMap";

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

type InquirySelectProps = {
  describedBy?: string;
  invalid: boolean;
  onChange: (value: string) => void;
  onTouched: () => void;
  options: string[];
  value: string;
};

function InquirySelect({ describedBy, invalid, onChange, onTouched, options, value }: InquirySelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(0, options.indexOf(value));
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onTouched();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen, onTouched]);

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option);
    onTouched();
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(selectedIndex);
      } else {
        setActiveIndex((current) => (current + direction + options.length) % options.length);
      }
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && isOpen) {
      event.preventDefault();
      selectOption(activeIndex);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      onTouched();
    }

    if (event.key === "Tab" && isOpen) {
      setIsOpen(false);
      onTouched();
    }
  };

  return (
    <div className={`contact-inquiry-select${isOpen ? " is-open" : ""}`} ref={rootRef}>
      <input name="inquiry" type="hidden" value={value} />
      <button
        aria-activedescendant={isOpen ? `contact-type-option-${activeIndex}` : undefined}
        aria-controls="contact-type-options"
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={invalid}
        className="contact-inquiry-trigger"
        id="contact-type"
        role="combobox"
        type="button"
        onClick={() => {
          setActiveIndex(selectedIndex);
          setIsOpen((open) => !open);
        }}
        onKeyDown={handleKeyDown}
      >
        <span>{value}</span>
        <span className="contact-inquiry-chevron" aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="contact-inquiry-options" id="contact-type-options" role="listbox" aria-label="Inquiry type">
          {options.map((option, index) => (
            <button
              aria-selected={option === value}
              className={`contact-inquiry-option${index === activeIndex ? " is-active" : ""}`}
              id={`contact-type-option-${index}`}
              key={option}
              role="option"
              tabIndex={-1}
              type="button"
              onClick={() => selectOption(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span>{option}</span>
              <span className="contact-inquiry-check" aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
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

              <div className="contact-details contact-location-list" aria-label="ADURE contact locations">
                {content.locations.map((location) => (
                  <article className={`contact-location-card${location.name === "General Inquiries" ? " contact-location-card-general" : ""}`} key={location.name}>
                    <span className="contact-icon" aria-hidden="true">
                      <img src={location.name === "General Inquiries" ? "/assets/contact/emails.svg" : "/assets/contact/address.svg"} alt="" />
                    </span>
                    <div>
                      <h2>{location.name}</h2>
                      <p className="contact-address">{location.address}</p>
                      <p><a href={`tel:${location.phone.replace(/\s/g, "")}`}>{location.phone}</a></p>
                      <p><a href={`mailto:${location.email}`}>{location.email}</a></p>
                    </div>
                  </article>
                ))}
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
                <InquirySelect
                  describedBy={getFieldError("inquiry") ? "contact-type-error" : undefined}
                  invalid={Boolean(getFieldError("inquiry"))}
                  onChange={(value) => formik.setFieldValue("inquiry", value)}
                  onTouched={() => formik.setFieldTouched("inquiry", true, false)}
                  options={content.form.inquiryOptions}
                  value={formik.values.inquiry}
                />
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
              <Button className="button-wipe contact-submit" disabled={formik.isSubmitting} type="submit" variant="primary">
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

          <ContactLocationMap content={content.map} locations={content.locations} />
        </section>
      </main>

      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
