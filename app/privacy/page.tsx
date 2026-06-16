'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../legal.css';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('about');
  const [revealedSections, setRevealedSections] = useState<string[]>([]);

  useEffect(() => {
    // 1. Reveal animations on scroll
    const observerOptions = {
      threshold: 0.12,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setRevealedSections((prev) => [...prev, id]);
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((el) => revealObserver.observe(el));

    // 2. Scroll spy for TOC navigation
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130;
      const sections = [
        'about', 'scope', 'collect', 'use', 'cookies', 'sharing',
        'transfers', 'retention', 'security', 'rights', 'grievance',
        'children', 'changes', 'contact'
      ];

      let currentSection = sections[0];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPosition) {
          currentSection = sectionId;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const sections = [
    { id: 'about', text: '1. Who we are' },
    { id: 'scope', text: '2. Scope of this policy' },
    { id: 'collect', text: '3. Data we collect' },
    { id: 'use', text: '4. How we use data' },
    { id: 'cookies', text: '5. Cookies and tracking' },
    { id: 'sharing', text: '6. Sharing and sub-processors' },
    { id: 'transfers', text: '7. International transfers' },
    { id: 'retention', text: '8. Data retention' },
    { id: 'security', text: '9. Security' },
    { id: 'rights', text: '10. Your rights' },
    { id: 'grievance', text: '11. Grievance redressal' },
    { id: 'children', text: '12. Children\'s data' },
    { id: 'changes', text: '13. Changes to this policy' },
    { id: 'contact', text: '14. Contact us' }
  ];

  return (
    <div className="legal-body">
      <nav className="nav">
        <div className="wrap nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
              </svg>
            </span>
            Innonsh Salonza
          </Link>
          <Link href="/" className="back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>
        </div>
      </nav>

      <header className="doc-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="dot"></span>Legal</span>
          <h1>Privacy Policy</h1>
          <p>This policy explains what personal data Innonsh Salonza collects, why we collect it, how we protect and share it, and the rights you have over your information.</p>
          <div className="updated">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            Last updated <span className="fill">June 16, 2026</span>
          </div>
        </div>
      </header>

      <div className="wrap layout">
        <aside className="toc">
          <div className="toc-wrap">
            <h4>On this page</h4>
            <nav id="tocNav">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={activeSection === section.id ? 'active' : ''}
                >
                  {section.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <main className="content">
          <div className={`note-legal ${revealedSections.includes('note-legal') ? 'in' : ''}`} id="note-legal" data-reveal>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            <div>
              <b>Draft for review.</b> This is a working template aligned to India&apos;s DPDP Act 2023 and DPDP Rules 2025, with GDPR provisions for clients in the EU and UK. Highlighted fields like <span className="fill">Innonsh Technologies</span> must be completed, and the document should be reviewed by qualified legal counsel before publication. It is not legal advice.
            </div>
          </div>

          <section id="about" className={revealedSections.includes('about') ? 'in' : ''} data-reveal>
            <h2><span className="n">1</span>Who we are</h2>
            <p>Innonsh Salonza is a salon management platform operated by <span className="fill">Innonsh Technologies</span> (&quot;Innonsh Salonza&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), with its registered office at <span className="fill">Pune, Maharashtra</span>, <span className="fill">Pune, Maharashtra, India</span>.</p>
            <p>We are committed to protecting personal data and handling it responsibly. For any privacy related questions, you can reach us at <span className="fill">info@innonsh.com</span>.</p>
          </section>

          <section id="scope" className={revealedSections.includes('scope') ? 'in' : ''} data-reveal>
            <h2><span className="n">2</span>Scope of this policy</h2>
            <p>Innonsh Salonza handles personal data in two distinct roles, and it is important to understand which one applies to you.</p>
            <ul>
              <li><b>As a data fiduciary (controller).</b> When you visit our website, request a demo, create an account, or use Innonsh Salonza as a salon owner, manager, stylist, or staff member, we determine how your personal data is handled. This policy governs that relationship.</li>
              <li><b>As a data processor.</b> When a salon uses Innonsh Salonza to manage its own customers, the salon decides what client data to collect and why. We process that data only on the salon&apos;s instructions. This processing is governed by our <span className="fill">Data Processing Agreement</span>, not this policy. If you are a customer of a salon, please contact that salon to exercise your rights.</li>
            </ul>
            <div className="callout">
              <span className="ci">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <p>In short: this policy covers the data of <b>website visitors, prospects, and salon account users</b>. The data salons enter about their own clients is covered by the agreement between Innonsh Salonza and the salon.</p>
            </div>
          </section>

          <section id="collect" className={revealedSections.includes('collect') ? 'in' : ''} data-reveal>
            <h2><span className="n">3</span>Data we collect</h2>
            <p>We collect the following categories of personal data when you interact with Innonsh Salonza as an account user or prospect.</p>
            <table className="data">
              <thead>
                <tr><th>Category</th><th>Examples</th><th>Source</th></tr>
              </thead>
              <tbody>
                <tr><td><b>Account and identity</b></td><td>Name, business name, role, email, phone number, password (stored encrypted)</td><td>You, at sign up</td></tr>
                <tr><td><b>Billing</b></td><td>Billing address, GSTIN or tax ID, plan, transaction records. Card details are handled by our payment processor and not stored by us.</td><td>You, our payment processor</td></tr>
                <tr><td><b>Usage and device</b></td><td>Pages viewed, features used, IP address, browser type, device, approximate location, timestamps</td><td>Collected automatically</td></tr>
                <tr><td><b>Communications</b></td><td>Demo requests, support tickets, emails, chat messages, feedback</td><td>You</td></tr>
                <tr><td><b>Cookies</b></td><td>Session identifiers, preferences, analytics identifiers</td><td>Collected automatically, see section 5</td></tr>
              </tbody>
            </table>
            <p>We do not intentionally collect special or sensitive categories of personal data about account users through the website. We ask that you do not submit such data to us except where strictly necessary.</p>
          </section>

          <section id="use" className={revealedSections.includes('use') ? 'in' : ''} data-reveal>
            <h2><span className="n">4</span>How we use data</h2>
            <p>We use personal data for the purposes below. Where the DPDP Act applies, our processing is based on your consent or on legitimate uses permitted by the Act. Where the GDPR applies, the corresponding lawful basis is shown.</p>
            <table className="data">
              <thead>
                <tr><th>Purpose</th><th>Lawful basis (GDPR)</th></tr>
              </thead>
              <tbody>
                <tr><td>Provide, operate, and maintain the Innonsh Salonza platform</td><td>Performance of a contract</td></tr>
                <tr><td>Process payments and manage subscriptions</td><td>Performance of a contract</td></tr>
                <tr><td>Respond to demo requests, enquiries, and support</td><td>Legitimate interests, consent</td></tr>
                <tr><td>Improve, secure, and troubleshoot our services</td><td>Legitimate interests</td></tr>
                <tr><td>Send service and transactional messages</td><td>Performance of a contract</td></tr>
                <tr><td>Send marketing communications, where permitted</td><td>Consent</td></tr>
                <tr><td>Comply with legal and regulatory obligations</td><td>Legal obligation</td></tr>
              </tbody>
            </table>
            <p>You can withdraw consent at any time where processing relies on it. Withdrawing consent does not affect processing carried out before withdrawal, and may limit your ability to use certain features.</p>
          </section>

          <section id="cookies" className={revealedSections.includes('cookies') ? 'in' : ''} data-reveal>
            <h2><span className="n">5</span>Cookies and tracking</h2>
            <p>We use cookies and similar technologies to keep you signed in, remember preferences, measure how the site performs, and understand how people use Innonsh Salonza.</p>
            <ul>
              <li><b>Essential cookies</b> are required for the site and app to function and cannot be switched off.</li>
              <li><b>Analytics cookies</b> help us understand usage so we can improve the product. We use <span className="fill">Google Analytics</span>.</li>
              <li><b>Marketing cookies</b>, if used, help measure campaigns. <span className="fill">marketing and retargeting analytics</span>.</li>
            </ul>
            <p>Where required, we ask for your consent before setting non-essential cookies. You can manage your preferences through our cookie banner or your browser settings.</p>
          </section>

          <section id="sharing" className={revealedSections.includes('sharing') ? 'in' : ''} data-reveal>
            <h2><span className="n">6</span>Sharing and sub-processors</h2>
            <p>We do not sell personal data. We share it only with trusted service providers who process it on our behalf, under contract, and only as needed to run Innonsh Salonza. Current categories of sub-processors include:</p>
            <ul>
              <li><b>Cloud hosting and storage</b> <span className="fill">AWS, India region</span></li>
              <li><b>Payment processing</b> <span className="fill">Razorpay</span></li>
              <li><b>Email and messaging</b> <span className="fill">SendGrid</span></li>
              <li><b>Analytics and product monitoring</b> <span className="fill">Google Analytics</span></li>
              <li><b>Customer support tooling</b> <span className="fill">info@innonsh.com</span></li>
            </ul>
            <p>We may also disclose personal data where required by law, to enforce our agreements, to protect rights and safety, or in connection with a merger, acquisition, or sale of assets, in which case we will notify you of any change in how your data is handled.</p>
          </section>

          <section id="transfers" className={revealedSections.includes('transfers') ? 'in' : ''} data-reveal>
            <h2><span className="n">7</span>International transfers</h2>
            <p>Innonsh Salonza is operated from India and may process data on infrastructure located in <span className="fill">India</span>. Where personal data is transferred across borders, we do so in line with applicable law.</p>
            <ul>
              <li>Under the DPDP framework, transfers are made to countries other than those restricted by the Central Government, and subject to the conditions set out in the Act and Rules.</li>
              <li>For data protected by the GDPR, we rely on appropriate safeguards such as the European Commission&apos;s Standard Contractual Clauses, or transfers to countries with an adequacy decision.</li>
            </ul>
          </section>

          <section id="retention" className={revealedSections.includes('retention') ? 'in' : ''} data-reveal>
            <h2><span className="n">8</span>Data retention</h2>
            <p>We keep personal data only for as long as it is needed for the purposes described in this policy, or for as long as required by law.</p>
            <ul>
              <li><b>Account data</b> is retained while your account is active and for <span className="fill">5 years</span> after closure, unless a longer period is required by law.</li>
              <li><b>Billing records</b> are retained as required by applicable tax and accounting laws, typically <span className="fill">8 years</span>.</li>
              <li><b>Support and communications</b> are retained for <span className="fill">5 years</span>.</li>
            </ul>
            <p>When personal data is no longer required and there is no legal reason to keep it, we securely delete or anonymise it.</p>
          </section>

          <section id="security" className={revealedSections.includes('security') ? 'in' : ''} data-reveal>
            <h2><span className="n">9</span>Security</h2>
            <p>We use reasonable technical and organisational measures to protect personal data, including encryption in transit, access controls, role based permissions, PIN login, and audit logging. No system is perfectly secure, and we cannot guarantee absolute security.</p>
            <p>In the event of a personal data breach, we will notify the Data Protection Board of India and affected individuals as required, including a plain language description of the breach, the data involved, steps we are taking, and how you can protect yourself.</p>
          </section>

          <section id="rights" className={revealedSections.includes('rights') ? 'in' : ''} data-reveal>
            <h2><span className="n">10</span>Your rights</h2>
            <p>Depending on where you live, you have rights over your personal data. To exercise any of these, contact us using the details in section 14.</p>
            <h3>Under the DPDP Act 2023</h3>
            <ul>
              <li><b>Access</b> a summary of the personal data we process about you and how.</li>
              <li><b>Correction and updating</b> of inaccurate or incomplete data, and completion of data.</li>
              <li><b>Erasure</b> of personal data that is no longer needed for the purpose it was collected.</li>
              <li><b>Grievance redressal</b> through the mechanism described in section 11.</li>
              <li><b>Nomination</b> of another individual to exercise your rights in the event of death or incapacity.</li>
            </ul>
            <h3>Under the GDPR (EU and UK individuals)</h3>
            <ul>
              <li>Access, rectification, and erasure of your data.</li>
              <li>Restriction of, or objection to, certain processing.</li>
              <li>Data portability, where applicable.</li>
              <li>The right to lodge a complaint with your local supervisory authority.</li>
            </ul>
            <p>We will respond to verified requests within the timelines required by law. We may need to confirm your identity before acting on a request.</p>
          </section>

          <section id="grievance" className={revealedSections.includes('grievance') ? 'in' : ''} data-reveal>
            <h2><span className="n">11</span>Grievance redressal</h2>
            <p>If you have a concern about how we handle your personal data, you can contact our Grievance Officer, who is responsible for addressing complaints in line with the DPDP Act.</p>
            <div className="callout">
              <span className="ci">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M4 4h16v12H5.17L4 17.17V4z" />
                </svg>
              </span>
              <p><b>Grievance Officer</b><br />Name: <span className="fill">Grievance Officer</span><br />Email: <span className="fill">info@innonsh.com</span><br />Address: <span className="fill">Pune, Maharashtra</span></p>
            </div>
            <p>We aim to acknowledge grievances promptly and resolve them within the period required by law. If you are not satisfied with our response, you may escalate the matter to the Data Protection Board of India.</p>
          </section>

          <section id="children" className={revealedSections.includes('children') ? 'in' : ''} data-reveal>
            <h2><span className="n">12</span>Children&apos;s data</h2>
            <p>Innonsh Salonza is intended for businesses and is not directed at children. We do not knowingly collect personal data from anyone under the age of 18 without verifiable consent from a parent or lawful guardian, as required by the DPDP Act. If you believe a child has provided us data without such consent, contact us and we will take appropriate steps to delete it.</p>
          </section>

          <section id="changes" className={revealedSections.includes('changes') ? 'in' : ''} data-reveal>
            <h2><span className="n">13</span>Changes to this policy</h2>
            <p>We may update this policy from time to time to reflect changes in our practices or the law. When we make material changes, we will update the date at the top and, where appropriate, notify you. We encourage you to review this page periodically.</p>
          </section>

          <section id="contact" className={revealedSections.includes('contact') ? 'in' : ''} data-reveal>
            <h2><span className="n">14</span>Contact us</h2>
            <p>For any questions about this policy or your personal data, please contact us:</p>
            <ul>
              <li><b>Email</b> <span className="fill">info@innonsh.com</span></li>
              <li><b>Grievance Officer</b> <span className="fill">info@innonsh.com</span></li>
              <li><b>Address</b> <span className="fill">Pune, Maharashtra, India</span></li>
            </ul>
          </section>
        </main>
      </div>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <Link href="/" className="logo">
              <span className="logo-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
                </svg>
              </span>
              Innonsh Salonza
            </Link>
            <div className="foot-links">
              <Link href="/">Home</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <a href="#">Security</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="foot-bottom">© 2026 Innonsh Salonza. The operating system for modern salons.</div>
        </div>
      </footer>
    </div>
  );
}
