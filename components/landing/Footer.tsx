import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a href="#top" className="logo">
              <span className="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></svg></span>
              Innonsh Salonza
            </a>
            <p>The operating system for modern salons. One platform to run, grow, and love your business.</p>
            <div className="socials">
              <a href="https://www.instagram.com/innonsh.tech/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg></a>
              <a href="https://www.linkedin.com/company/innonsh-technologies/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" /></svg></a>
            </div>
          </div>
          <div className="foot-col">
            <h4>Product</h4>
            <a href="#experience">Overview</a>
            <a href="#impact">Results</a>
            <a href="#how">How it works</a>
            <a href="#">Pricing</a>
            <a href="#">Changelog</a>
          </div>
          <div className="foot-col">
            <h4>Modules</h4>
            <a href="#modules">Appointments</a>
            <a href="#modules">Point of sale</a>
            <a href="#modules">CRM</a>
            <a href="#modules">Inventory</a>
            <a href="#modules">Analytics</a>
          </div>
          <div className="foot-col">
            <h4>Solutions</h4>
            <a href="#">Hair salons</a>
            <a href="#">Spa and wellness</a>
            <a href="#">Barbershops</a>
            <a href="#">Multi location</a>
            <a href="#">Franchises</a>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <a href="mailto:info@innonsh.com">info@innonsh.com</a>
            <a href="tel:+917620301874">+91 76203 01874</a>
            <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.55)', display: 'block', padding: '7px 0' }}>Pune, Maharashtra</span>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© 2026 Innonsh Salonza. The operating system for modern salons.</p>
          <div className="links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}