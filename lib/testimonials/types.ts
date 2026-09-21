export type Testimonial = {
  quote: string;
  name: string;
  avatar: string;
};

export type TestimonialsContent = {
  heading: string;
  description: string;
  items: Testimonial[];
};
