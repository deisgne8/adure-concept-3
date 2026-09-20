import type { HomeContent } from "../../lib/home/load-home-content";

type SiteFooterProps = {
  content: HomeContent["site"];
  homeHref?: string;
};

export default function SiteFooter({ content, homeHref = "#home" }: SiteFooterProps) {
  const { footer } = content;
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="logo" href={homeHref} aria-label="ADURE home">
                <img
                  src={footer.logo.src}
                  alt={footer.logo.alt}
                />
              </a>
            </div>
            {footer.columns.map((column) => (
              <div key={column.heading}>
                <h3>{column.heading}</h3>
                {column.links.map((link) => <a href={link.href} key={`${column.heading}-${link.label}`}>{link.label}</a>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>{footer.copyright}</span>
            <span>{footer.legal}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
