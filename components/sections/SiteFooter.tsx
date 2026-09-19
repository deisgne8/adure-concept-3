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
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#customers">
                Our customers
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#media">
                Media and gallery
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#careers">
                Careers
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#contact">
                Contact
              </a>
            </div>
            <div>
              <h3>Properties</h3>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#properties">
                Buy
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#properties">
                Lease
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#list-property">
                List your property
              </a>
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#portfolio">
                Portfolio
              </a>
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
              <a href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#projects">
                Upcoming projects
              </a>
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
