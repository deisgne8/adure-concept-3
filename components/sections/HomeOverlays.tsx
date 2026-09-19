export default function HomeOverlays() {
  return (
    <>
      <dialog
        className="filter-dialog"
        id="filter-dialog"
        aria-labelledby="filter-title"
      >
        <div className="dialog-top">
          <h2 id="filter-title">All filters</h2>
          <button
            className="icon-button filter-close"
            aria-label="Close filters"
          >
            ×
          </button>
        </div>
        <div id="filter-slot"></div>
      </dialog>
      <p id="action-status" className="sr-only" role="status"></p>
    </>
  );
}
