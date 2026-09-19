import content from "../../data/home/proof.json";

export default function ProofSection() {
  return (
    <>
      <section className="proof-v2 section" id={content.id}>
        <div className="section-shell">
          <div className="proof-editorial-layout">
            <div className="proof-statement">
              <h2>Success Proven in Numbers</h2>
              <p>
                The strongest measure of experience is what it continues to
                deliver.
              </p>
              <a
                className="proof-about"
                href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#about"
              >
                <span aria-hidden="true">↗</span>About ADURE
              </a>
            </div>
            <dl className="proof-statistics" aria-label="ADURE in numbers">
              <div className="proof-statistic">
                <dt>Established</dt>
                <dd>2002</dd>
              </div>
              <div className="proof-statistic">
                <dt>Units managed</dt>
                <dd>3000+</dd>
              </div>
              <div className="proof-statistic">
                <dt>Professionals</dt>
                <dd>200+</dd>
              </div>
              <div className="proof-statistic">
                <dt>Occupancy rate</dt>
                <dd>98%</dd>
              </div>
              <div className="proof-statistic">
                <dt>Average vacancy</dt>
                <dd>
                  1–2 <small>weeks</small>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
