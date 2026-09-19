import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";

type TransitionSectionProps = {
  content: HomeContent["transition"];
};

export default function TransitionSection({ content }: TransitionSectionProps) {
  return (
    <>
      <Section
        className="transition-v2 section"
        id={content.id}
        spacing={content.spacing}
      >
        <div className="section-shell">
          <div className="transition-head">
            <h2>Your 30-Day Transition Journey</h2>
            <p>
              Good management starts with getting the beginning right. Over four
              clear stages, ADURE brings documentation, people, operations and
              reporting into one organised management structure, with continuity
              built into every step.
            </p>
          </div>
          <div className="timeline-v2">
            <article className="timeline-step">
              <span className="week">Week 1</span>
              <h3>Review</h3>
              <p>
                Understand the asset, its documentation and existing
                requirements.
              </p>
            </article>
            <article className="timeline-step">
              <span className="week">Week 2</span>
              <h3>Inspect</h3>
              <p>Assess the property, operations and tenant needs.</p>
            </article>
            <article className="timeline-step">
              <span className="week">Week 3</span>
              <h3>Takeover</h3>
              <p>
                Bring responsibilities, communication and reporting into
                alignment.
              </p>
            </article>
            <article className="timeline-step">
              <span className="week">Week 4</span>
              <h3>Manage</h3>
              <p>
                Move into ongoing oversight with clear accountability and
                visibility.
              </p>
            </article>
          </div>
          <a
            className="btn link"
            href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#services"
          >
            Explore property management
          </a>
        </div>
      </Section>
    </>
  );
}
