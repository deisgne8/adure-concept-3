import type { NextApiRequest, NextApiResponse } from "next";

type ContactRequestBody = {
  email?: string;
  name?: string;
  phone?: string;
  inquiry?: string;
  message?: string;
  propertyLocation?: string;
  propertyType?: string;
  privacy?: boolean;
};

type ContactResponse = {
  message: string;
  errors?: Partial<Record<keyof ContactRequestBody | "form", string>>;
};

type ContactForm7Response = {
  contact_form_id?: number;
  status?: string;
  message?: string;
  invalid_fields?: Array<{ field?: string; message?: string }>;
  posted_data_hash?: string;
};

const validInquiryTypes = new Set([
  "Buying Property",
  "Leasing Property",
  "Selling Property",
  "Property Management",
  "General Inquiry",
]);

const phonePattern = /^[+()\d\s-]{7,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateBody(body: ContactRequestBody) {
  const errors: ContactResponse["errors"] = {};
  const name = getString(body.name);
  const email = getString(body.email);
  const phone = getString(body.phone);
  const inquiry = getString(body.inquiry);
  const message = getString(body.message);
  const propertyLocation = getString(body.propertyLocation);
  const propertyType = getString(body.propertyType);

  if (name.length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!phonePattern.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (email && !emailPattern.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!validInquiryTypes.has(inquiry)) {
    errors.inquiry = "Please choose an inquiry type.";
  }

  if (message.length > 1200) {
    errors.message = "Please keep your message under 1200 characters.";
  }

  if (body.privacy !== true) {
    errors.privacy = "Please agree before submitting.";
  }

  return {
    values: { email, name, phone, inquiry, message, propertyLocation, propertyType },
    errors,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ContactResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const wordpressUrl = process.env.WORDPRESS_URL;
  const formId = process.env.WORDPRESS_CONTACT_FORM_ID;

  if (!wordpressUrl || !formId) {
    return res.status(500).json({ message: "Contact form is not configured." });
  }

  const { values, errors } = validateBody(req.body as ContactRequestBody);

  if (errors && Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Please check the highlighted fields.", errors });
  }

  const formData = new FormData();
  formData.set("_wpcf7", formId);
  formData.set("_wpcf7_version", "6.1.7");
  formData.set("_wpcf7_locale", "en_US");
  formData.set("_wpcf7_unit_tag", `wpcf7-f${formId}-o1`);
  formData.set("_wpcf7_container_post", "0");
  formData.set("_wpcf7_posted_data_hash", "");
  formData.set("your-name", values.name);
  formData.set("your-email", values.email);
  formData.set("your-phone", values.phone);
  formData.set("your-inquiry", values.inquiry);
  formData.set("your-subject", values.inquiry);
  formData.set("your-message", values.message);
  formData.set("property-location", values.propertyLocation);
  formData.set("property-type", values.propertyType);
  formData.set("privacy-consent", "1");

  try {
    const endpoint = new URL(`/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`, wordpressUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
    const result = await response.json().catch(() => null) as ContactForm7Response | null;

    const acceptedByContactForm7 =
      response.ok &&
      (result?.status === "mail_sent" ||
        (result?.status === "mail_failed" && Boolean(result.posted_data_hash) && result.invalid_fields?.length === 0));

    if (!acceptedByContactForm7) {
      return res.status(502).json({
        message: result?.message ?? "We could not send your message. Please try again.",
        errors: { form: result?.status ?? "contact_form_error" },
      });
    }

    return res.status(200).json({
      message: result.status === "mail_failed"
        ? "Thank you. Your message has been received."
        : result.message ?? "Thank you. Your message has been sent.",
    });
  } catch {
    return res.status(502).json({
      message: "We could not send your message. Please try again.",
    });
  }
}
