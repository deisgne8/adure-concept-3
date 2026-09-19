import contact from "../../data/about/contact.json";
import innerBanner from "../../data/about/inner-banner.json";
import introduction from "../../data/about/introduction.json";
import leadership from "../../data/about/leadership.json";
import meta from "../../data/about/meta.json";
import story from "../../data/about/story.json";
import values from "../../data/about/values.json";
import vision from "../../data/about/vision.json";

// Replace this loader with a single CMS request when the About page is connected.
export async function loadAboutContent() {
  return {
    meta,
    innerBanner,
    introduction,
    story,
    vision,
    values,
    leadership,
    contact,
  };
}

export type AboutContent = Awaited<ReturnType<typeof loadAboutContent>>;
