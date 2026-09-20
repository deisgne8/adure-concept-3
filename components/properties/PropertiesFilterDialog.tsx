import { forwardRef, useState } from "react";

type PropertiesFilterDialogProps = {
  resultCount: number;
};

const furnishingOptions = ["All furnishings", "Furnished", "Unfurnished", "Partly furnished"];
const enhancements = ["Upgraded", "Extended", "Landscaped"];
const amenities = [
  "Central A/C",
  "Maids Room",
  "Balcony",
  "Shared Pool",
  "Security",
  "Covered Parking",
  "Built in Wardrobes",
  "View of Water",
  "Pets Allowed",
  "Children’s Play Area",
];

const PropertiesFilterDialog = forwardRef<HTMLDialogElement, PropertiesFilterDialogProps>(
  function PropertiesFilterDialog({ resultCount }, ref) {
    const [furnishing, setFurnishing] = useState("All furnishings");
    const [activeEnhancements, setActiveEnhancements] = useState<string[]>([]);
    const [activeAmenities, setActiveAmenities] = useState<string[]>([]);
    const [resetKey, setResetKey] = useState(0);

    const clear = () => {
      setFurnishing("All furnishings");
      setActiveEnhancements([]);
      setActiveAmenities([]);
      setResetKey((current) => current + 1);
    };

    return (
      <dialog className="filter-dialog" id="filter-dialog" aria-label="More property filters" ref={ref}>
        <form
          method="dialog"
          className="filter-drawer"
          key={resetKey}
          onSubmit={(event) => {
            event.preventDefault();
            event.currentTarget.closest("dialog")?.close();
          }}
        >
          <div className="filter-dialog-head">
            <strong>More Filters</strong>
            <button className="icon-button filter-close" type="submit" aria-label="Close filters">×</button>
          </div>
          <div className="filter-dialog-scroll">
            <section className="advanced-filter-group" aria-labelledby="furnishing-title">
              <h3 id="furnishing-title"><span aria-hidden="true">▣</span> Furnishing</h3>
              <div className="filter-pill-row">
                {furnishingOptions.map((option) => (
                  <button
                    className={`filter-pill${furnishing === option ? " is-active" : ""}`}
                    type="button"
                    aria-pressed={furnishing === option}
                    key={option}
                    onClick={() => setFurnishing(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
            <section className="advanced-filter-group" aria-labelledby="size-title">
              <h3 id="size-title"><span aria-hidden="true">↔</span> Property Size (Sqft)</h3>
              <div className="range-fields">
                <label><span>Minimum size</span><input type="number" inputMode="numeric" placeholder="Min. sqft" /></label>
                <i aria-hidden="true" />
                <label><span>Maximum size</span><input type="number" inputMode="numeric" placeholder="Max. sqft" /></label>
              </div>
            </section>
            <section className="advanced-filter-group" aria-labelledby="cheques-title">
              <h3 id="cheques-title"><span aria-hidden="true">▤</span> Number Of Cheques</h3>
              <div className="range-fields">
                <label><span>From</span><input type="number" inputMode="numeric" placeholder="From" /></label>
                <i aria-hidden="true" />
                <label><span>To</span><input type="number" inputMode="numeric" placeholder="To" /></label>
              </div>
            </section>
            <section className="advanced-filter-group" aria-labelledby="enhancements-title">
              <h3 id="enhancements-title"><span aria-hidden="true">▦</span> Property Enhancements</h3>
              <div className="filter-pill-row">
                {enhancements.map((option) => {
                  const active = activeEnhancements.includes(option);
                  return (
                    <button
                      className={`filter-pill${active ? " is-active" : ""}`}
                      type="button"
                      aria-pressed={active}
                      key={option}
                      onClick={() => setActiveEnhancements((current) => active ? current.filter((item) => item !== option) : [...current, option])}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </section>
            <section className="advanced-filter-group" aria-labelledby="amenities-title">
              <h3 id="amenities-title"><span aria-hidden="true">◇</span> Amenities</h3>
              <div className="amenities-list">
                {amenities.map((amenity) => (
                  <label key={amenity}>
                    <input
                      type="checkbox"
                      checked={activeAmenities.includes(amenity)}
                      onChange={(event) => setActiveAmenities((current) => event.target.checked ? [...current, amenity] : current.filter((item) => item !== amenity))}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </section>
          </div>
          <div className="filter-dialog-actions">
            <button className="drawer-clear" type="button" onClick={clear}>Clear all</button>
            <button className="drawer-apply" type="submit">Show <span>{resultCount}</span> results</button>
          </div>
        </form>
      </dialog>
    );
  },
);

export default PropertiesFilterDialog;
