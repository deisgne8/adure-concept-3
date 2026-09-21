export type ContactLocation = {
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates?: [number, number];
  mapUrl: string;
};

export type ContactMapContent = { eyebrow: string; heading: string; description: string; ariaLabel: string; failureMessage: string };

export type ContactContent = {
  meta: {
    title: string;
    description: string;
  };
  intro: {
    heading: string;
    description: string;
  };
  locations: ContactLocation[];
  form: {
    action: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    inquiryLabel: string;
    inquiryOptions: string[];
    messageLabel: string;
    messageOptionalLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    consentLabel: string;
  };
  map: ContactMapContent;
};
