export type ContactDetail = {
  label: string;
  lines: string[];
  href?: string;
  icon: string;
  iconAlt: string;
};

export type ContactContent = {
  meta: {
    title: string;
    description: string;
  };
  intro: {
    heading: string;
    description: string;
  };
  details: ContactDetail[];
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
  map: {
    title: string;
    embedUrl: string;
    externalUrl: string;
    externalLabel: string;
  };
};
