import Link from "next/link";

type SiteFooterProps = {
  homeHref?: string;
};

export default function SiteFooter({ homeHref = "#home" }: SiteFooterProps) {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="logo" href={homeHref} aria-label="ADURE home">
                <img
                  src="/assets/adure-logo-horizontal.svg"
                  alt="ADURE — Abu Dhabi United Real Estate"
                />
              </a>
              <p>Creating Value Beyond Property</p>
              <p>Inquiries@adu-re.com</p>
            </div>
            <div>
              <h3>Company</h3>
              <Link href="/about">
                About ADURE
              </Link>
              <Link href="/customers">
                Our Clients
              </Link>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#media">
                Media and gallery
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#careers">
                Careers
              </a>
              <Link href="/contact">
                Contact
              </Link>
            </div>
            <div>
              <h3>Properties</h3>
              <Link href="/properties?transaction=sale">
                Buy
              </Link>
              <Link href="/properties?transaction=lease">
                Lease
              </Link>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#list-property">
                List your property
              </a>
              <Link href="/portfolio">
                Portfolio
              </Link>
            </div>
            <div>
              <h3>Services</h3>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#services">
                Buy
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#services">
                Sell
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#services">
                Leasing
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#services">
                Property management
              </a>
            </div>
            <div>
              <h3>Explore</h3>
              <Link href="/portfolio">
                Portfolio
              </Link>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#project-detail">
                Qaryat Al Hidd
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 ADURE. All rights reserved.</span>
            <span>Privacy · Terms · Accessibility</span>
          </div>
        </div>
      </footer>
    </>
  );
}
