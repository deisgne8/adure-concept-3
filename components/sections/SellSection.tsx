import type { CSSProperties } from "react";
import { useFormik } from "formik";
import Section from "../ui/Section";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";
import type { HomeContent } from "../../lib/home/load-home-content";

type SellSectionProps = {
  content: HomeContent["sell"];
};

type SellFormValues = {
  location: string;
  type: string;
  name: string;
  phone: string;
  email: string;
};

type SellFormErrors = Partial<Record<keyof SellFormValues | "form", string>>;

const phonePattern = /^[+()\d\s-]{7,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SellSection({ content }: SellSectionProps) {
  const formik = useFormik<SellFormValues>({
    initialValues: {
      location: "",
      type: "",
      name: "",
      phone: "",
      email: "",
    },
    validate: (values) => {
      const errors: SellFormErrors = {};
      const location = values.location.trim();
      const name = values.name.trim();
      const phone = values.phone.trim();
      const email = values.email.trim();

      if (location.length < 2) {
        errors.location = "Please enter the property location.";
      }

      if (!content.form.propertyTypes.includes(values.type)) {
        errors.type = "Please choose a property type.";
      }

      if (name.length < 2) {
        errors.name = "Please enter your full name.";
      }

      if (!phonePattern.test(phone)) {
        errors.phone = "Please enter a valid phone number.";
      }

      if (!emailPattern.test(email)) {
        errors.email = "Please enter a valid email address.";
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      const message = [
        "Property enquiry from the homepage sell form.",
        "",
        `Property location: ${values.location.trim()}`,
        `Property type: ${values.type}`,
        `Email: ${values.email.trim()}`,
      ].join("\n");

      try {
        const response = await fetch(content.form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email.trim(),
            name: values.name.trim(),
            phone: values.phone.trim(),
            inquiry: "Selling Property",
            message,
            propertyLocation: values.location.trim(),
            propertyType: values.type,
            privacy: true,
          }),
        });
        const result = await response.json().catch(() => null) as { message?: string } | null;

        if (!response.ok) {
          helpers.setStatus({
            type: "error",
            message: result?.message ?? "We could not send your property enquiry. Please try again.",
          });
          return;
        }

        helpers.resetForm();
        helpers.setStatus({
          type: "success",
          message: result?.message ?? "Thank you. Your property enquiry has been sent.",
        });
      } catch {
        helpers.setStatus({
          type: "error",
          message: "We could not send your property enquiry. Please check your connection and try again.",
        });
      }
    },
  });

  const status = formik.status as { type: "success" | "error"; message: string } | undefined;
  const getFieldError = (field: keyof SellFormValues) =>
    (formik.touched[field] || formik.submitCount > 0) && formik.errors[field] ? formik.errors[field] : null;
  const renderFieldError = (field: keyof SellFormValues, id: string, className?: string) => {
    const error = getFieldError(field);

    return (
      <span
        aria-hidden={error ? undefined : true}
        className={["field-error", !error ? "is-empty" : "", className].filter(Boolean).join(" ")}
        id={id}
      >
        {error ?? " "}
      </span>
    );
  };

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
          <form className="sell-form" data-sell-form data-aos="fade-left" noValidate onSubmit={formik.handleSubmit}>
            <div className="sell-fields">
              <label htmlFor="sell-location">
                Property Location
                <input
                  aria-describedby={getFieldError("location") ? "sell-location-error" : undefined}
                  aria-invalid={Boolean(getFieldError("location"))}
                  id="sell-location"
                  name="location"
                  type="text"
                  placeholder="City or community"
                  value={formik.values.location}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {renderFieldError("location", "sell-location-error")}
              </label>
              <div className={["sell-type-field-group", getFieldError("type") ? "is-invalid" : ""].filter(Boolean).join(" ")}>
                <SelectField
                  className="sell-type-field"
                  id="sell-type"
                  label="Property Type"
                  name="type"
                  onValueChange={(value) => {
                    void formik.setFieldValue("type", value);
                    void formik.setFieldTouched("type", true, false);
                  }}
                  options={content.form.propertyTypes.map((propertyType) => ({
                    label: propertyType,
                    value: propertyType,
                  }))}
                  placeholder="Select property type"
                  value={formik.values.type}
                />
                {renderFieldError("type", "sell-type-error", "sell-type-error")}
              </div>
              <label htmlFor="sell-name">
                Name
                <input
                  aria-describedby={getFieldError("name") ? "sell-name-error" : undefined}
                  aria-invalid={Boolean(getFieldError("name"))}
                  id="sell-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {renderFieldError("name", "sell-name-error")}
              </label>
              <label htmlFor="sell-phone">
                Phone
                <input
                  aria-describedby={getFieldError("phone") ? "sell-phone-error" : undefined}
                  aria-invalid={Boolean(getFieldError("phone"))}
                  id="sell-phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  autoComplete="tel"
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {renderFieldError("phone", "sell-phone-error")}
              </label>
              <label htmlFor="sell-email">
                Email
                <input
                  aria-describedby={getFieldError("email") ? "sell-email-error" : undefined}
                  aria-invalid={Boolean(getFieldError("email"))}
                  id="sell-email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {renderFieldError("email", "sell-email-error")}
              </label>
              <Button disabled={formik.isSubmitting} showArrow variant="primary" type="submit">
                {formik.isSubmitting ? "Sending..." : content.form.button}
              </Button>
            </div>
            <p className="sell-form-note">{content.form.note}</p>
            {status ? <p className={`sell-form-status is-${status.type}`} role="status">{status.message}</p> : null}
          </form>
        </div>
      </Section>
    </>
  );
}
