'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../legal.css';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');
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
        'acceptance', 'definitions', 'accounts', 'subscriptions', 'data',
        'acceptable', 'ip', 'thirdparty', 'availability', 'confidentiality',
        'warranties', 'liability', 'indemnity', 'termination', 'changes',
        'law', 'general', 'contact'
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
    { id: 'acceptance', text: '1. Acceptance of terms' },
    { id: 'definitions', text: '2. Definitions' },
    { id: 'accounts', text: '3. Eligibility and accounts' },
    { id: 'subscriptions', text: '4. Subscriptions and billing' },
    { id: 'data', text: '5. Your data and privacy' },
    { id: 'acceptable', text: '6. Acceptable use' },
    { id: 'ip', text: '7. Intellectual property' },
    { id: 'thirdparty', text: '8. Third-party services' },
    { id: 'availability', text: '9. Availability and support' },
    { id: 'confidentiality', text: '10. Confidentiality' },
    { id: 'warranties', text: '11. Warranties and disclaimers' },
    { id: 'liability', text: '12. Limitation of liability' },
    { id: 'indemnity', text: '13. Indemnification' },
    { id: 'termination', text: '14. Term and termination' },
    { id: 'changes', text: '15. Changes to the service and terms' },
    { id: 'law', text: '16. Governing law and disputes' },
    { id: 'general', text: '17. General' },
    { id: 'contact', text: '18. Contact us' },
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>
        </div>
      </nav>

      <header className="doc-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="dot"></span>Legal</span>
          <h1>Terms of Service</h1>
          <p>These terms set out the agreement between you and Innonsh Salonza when you access or use our platform. Please read them carefully.</p>
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
        </aside>

        <main className="content">
          <div className={`note-legal ${revealedSections.includes('note-legal') ? 'in' : ''}`} id="note-legal" data-reveal>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            <div>
              <b>Draft for review.</b> This is a working template for an India based SaaS. Highlighted fields like <span className="fill">Innonsh Technologies</span> must be completed, and the document should be reviewed by qualified legal counsel before publication. It is not legal advice.
            </div>
          </div>

          <section id="acceptance" className={revealedSections.includes('acceptance') ? 'in' : ''} data-reveal>
            <h2><span className="n">1</span>Acceptance of terms</h2>
            <p>These Terms of Service (&quot;Terms&quot;) form a binding agreement between you, or the entity you represent (&quot;you&quot;, &quot;Customer&quot;), and <span className="fill">Innonsh Technologies</span> (&quot;Innonsh Salonza&quot;, &quot;we&quot;, &quot;us&quot;). By creating an account, subscribing, or otherwise accessing or using the Innonsh Salonza platform (the &quot;Service&quot;), you agree to these Terms.</p>
            <p>If you are entering into these Terms on behalf of a business, you confirm that you have authority to bind that business. If you do not agree to these Terms, you must not use the Service.</p>
          </section>

          <section id="definitions" className={revealedSections.includes('definitions') ? 'in' : ''} data-reveal>
            <h2><span class="n">2</span>Definitions</h2>
            <ul>
              <li><b>Service</b> means the Innonsh Salonza web and mobile applications, dashboards, APIs, and related features.</li>
              <li><b>Account</b> means the account you create to access the Service.</li>
              <li><b>Customer Data</b> means data you or your authorised users submit to the Service, including data about your own clients.</li>
              <li><b>Authorised Users</b> means the individuals you permit to use the Service under your Account, such as owners, managers, stylists, and receptionists.</li>
              <li><b>Subscription</b> means the paid plan that governs your access to the Service.</li>
            </ul>
          </section>

          <section id="accounts" className={revealedSections.includes('accounts') ? 'in' : ''} data-reveal>
            <h2><span class="n">3</span>Eligibility and accounts</h2>
            <p>You must be at least 18 years old and capable of forming a binding contract to use the Service. The Service is intended for business use.</p>
            <p>You are responsible for the accuracy of your registration details, for all activity under your Account, and for keeping your credentials secure. You must notify us promptly of any unauthorised use. You are responsible for your Authorised Users&apos; compliance with these Terms.</p>
          </section>

          <section id="subscriptions" className={revealedSections.includes('subscriptions') ? 'in' : ''} data-reveal>
            <h2><span class="n">4</span>Subscriptions and billing</h2>
            <ul>
              <li><b>Fees.</b> Access to paid features requires a Subscription. Fees, billing frequency, and inclusions are set out at the point of purchase or in an order form.</li>
              <li><b>Trials.</b> We may offer a free trial of <span className="fill">14 days</span>. Unless you cancel before it ends, your Subscription may begin and fees may apply.</li>
              <li><b>Renewals.</b> Subscriptions renew automatically for successive periods unless cancelled before the renewal date. You authorise us to charge your payment method for renewals.</li>
              <li><b>Taxes.</b> Fees are exclusive of taxes such as GST, which you are responsible for where applicable.</li>
              <li><b>Late or failed payment.</b> We may suspend access if fees are overdue after notice.</li>
              <li><b>Refunds.</b> <span className="fill">fees are non-refundable except as required by law</span>.</li>
              <li><b>Price changes.</b> We may change fees with at least <span className="fill">30 days</span> notice, effective from your next renewal.</li>
            </ul>
          </section>

          <section id="data" className={revealedSections.includes('data') ? 'in' : ''} data-reveal>
            <h2><span class="n">5</span>Your data and privacy</h2>
            <p>As between you and us, you own your Customer Data. You grant us a limited licence to host, process, and use it solely to provide and improve the Service and as instructed by you.</p>
            <div className="callout">
              <span className="ci">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <p>For data about your own clients, you act as the data fiduciary and we act as a data processor. That relationship is governed by our <span className="fill">Data Processing Agreement</span>. Our handling of your account and website data is described in our <Link href="/privacy">Privacy Policy</Link>.</p>
            </div>
            <p>You are responsible for ensuring you have the necessary rights and consents to provide Customer Data to the Service, and for complying with the laws that apply to your collection and use of that data.</p>
          </section>

          <section id="acceptable" className={revealedSections.includes('acceptable') ? 'in' : ''} data-reveal>
            <h2><span class="n">6</span>Acceptable use</h2>
            <p>You agree not to, and not to allow others to:</p>
            <ul>
              <li>Use the Service unlawfully, or to store or transmit unlawful, infringing, or harmful content.</li>
              <li>Attempt to gain unauthorised access to the Service, other accounts, or our systems.</li>
              <li>Reverse engineer, copy, resell, or create derivative works of the Service, except as permitted by law.</li>
              <li>Interfere with or disrupt the integrity or performance of the Service.</li>
              <li>Use the Service to send unsolicited communications in breach of applicable law.</li>
              <li>Probe, scan, or test the vulnerability of the Service without our written permission.</li>
            </ul>
            <p>We may investigate suspected violations and may suspend or terminate access for conduct that breaches this section.</p>
          </section>

          <section id="ip" className={revealedSections.includes('ip') ? 'in' : ''} data-reveal>
            <h2><span class="n">7</span>Intellectual property</h2>
            <p>The Service, including its software, design, trademarks, and content we provide, is owned by Innonsh Technologies or its licensors and is protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable right to use the Service during your Subscription, subject to these Terms. All rights not expressly granted are reserved.</p>
            <p>If you provide feedback or suggestions, you grant us a perpetual, royalty free right to use them without obligation to you.</p>
          </section>

          <section id="thirdparty" className={revealedSections.includes('thirdparty') ? 'in' : ''} data-reveal>
            <h2><span class="n">8</span>Third-party services</h2>
            <p>The Service may integrate with third-party products, such as payment processors or messaging providers. Your use of those products is governed by their own terms, and we are not responsible for them. We may stop supporting an integration where a third party changes or discontinues its service.</p>
          </section>

          <section id="availability" className={revealedSections.includes('availability') ? 'in' : ''} data-reveal>
            <h2><span class="n">9</span>Availability and support</h2>
            <p>We aim to keep the Service available and reliable, targeting <span className="fill">99.9%</span> uptime, but we do not guarantee uninterrupted access. We may perform scheduled maintenance and will aim to give reasonable notice where it is likely to cause significant disruption.</p>
            <p>Support is provided as described in your plan or at <span className="fill">info@innonsh.com</span>.</p>
          </section>

          <section id="confidentiality" className={revealedSections.includes('confidentiality') ? 'in' : ''} data-reveal>
            <h2><span class="n">10</span>Confidentiality</h2>
            <p>Each party may access confidential information of the other. Each party agrees to protect the other&apos;s confidential information with reasonable care and to use it only to perform under these Terms, except where disclosure is required by law. This does not apply to information that is public, independently developed, or rightfully obtained from another source.</p>
          </section>

          <section id="warranties" className={revealedSections.includes('warranties') ? 'in' : ''} data-reveal>
            <h2><span class="n">11</span>Warranties and disclaimers</h2>
            <p>We will provide the Service with reasonable skill and care. Except as expressly stated in these Terms, the Service is provided &quot;as is&quot; and &quot;as available&quot;, and to the maximum extent permitted by law we disclaim all other warranties, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be error free or uninterrupted.</p>
          </section>

          <section id="liability" className={revealedSections.includes('liability') ? 'in' : ''} data-reveal>
            <h2><span class="n">12</span>Limitation of liability</h2>
            <p>To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, goodwill, or data, arising out of or relating to these Terms.</p>
            <p>To the maximum extent permitted by law, our total aggregate liability arising out of or relating to these Terms will not exceed <span className="fill">the fees you paid to us in the 12 months before the claim</span>. Nothing in these Terms limits liability that cannot be limited by law.</p>
          </section>

          <section id="indemnity" className={revealedSections.includes('indemnity') ? 'in' : ''} data-reveal>
            <h2><span class="n">13</span>Indemnification</h2>
            <p>You agree to indemnify and hold Innonsh Technologies harmless from claims, losses, and expenses arising out of your Customer Data, your use of the Service in breach of these Terms, or your violation of applicable law or the rights of a third party.</p>
          </section>

          <section id="termination" className={revealedSections.includes('termination') ? 'in' : ''} data-reveal>
            <h2><span class="n">14</span>Term and termination</h2>
            <p>These Terms apply for as long as you use the Service. You may cancel your Subscription at any time, effective at the end of your current billing period.</p>
            <p>We may suspend or terminate your access if you materially breach these Terms, fail to pay fees, or use the Service in a way that poses a risk to us or others. We will give notice where reasonable and practical.</p>
            <p>On termination, your right to use the Service ends. We will make Customer Data available for export for <span className="fill">30 days</span>, after which we may delete it in line with our Privacy Policy and the DPA. Provisions that by their nature should survive termination will do so.</p>
          </section>

          <section id="changes" className={revealedSections.includes('changes') ? 'in' : ''} data-reveal>
            <h2><span class="n">15</span>Changes to the service and terms</h2>
            <p>We may update the Service and these Terms from time to time. When we make material changes to these Terms, we will update the date above and, where appropriate, notify you. Your continued use of the Service after changes take effect means you accept the updated Terms.</p>
          </section>

          <section id="law" className={revealedSections.includes('law') ? 'in' : ''} data-reveal>
            <h2><span class="n">16</span>Governing law and disputes</h2>
            <p>These Terms are governed by the laws of India. Subject to the dispute resolution process below, the courts at <span className="fill">Pune, Maharashtra</span> will have exclusive jurisdiction.</p>
            <p>The parties will first try to resolve any dispute amicably. If it cannot be resolved within <span className="fill">30 days</span>, the dispute will be referred to arbitration under the Arbitration and Conciliation Act, 1996, seated at <span className="fill">Pune, Maharashtra</span>, conducted in English by a sole arbitrator.</p>
          </section>

          <section id="general" className={revealedSections.includes('general') ? 'in' : ''} data-reveal>
            <h2><span class="n">17</span>General</h2>
            <ul>
              <li><b>Entire agreement.</b> These Terms, with any order form, the DPA, and the Privacy Policy, are the entire agreement between us on this subject.</li>
              <li><b>Assignment.</b> You may not assign these Terms without our consent. We may assign them in connection with a merger, acquisition, or sale of assets.</li>
              <li><b>Severability.</b> If a provision is found unenforceable, the rest remains in effect.</li>
              <li><b>Waiver.</b> A failure to enforce a provision is not a waiver of it.</li>
              <li><b>Force majeure.</b> Neither party is liable for delays caused by events beyond its reasonable control.</li>
              <li><b>Notices.</b> We may send notices to your Account email. Notices to us should go to the address below.</li>
            </ul>
          </section>

          <section id="contact" className={revealedSections.includes('contact') ? 'in' : ''} data-reveal>
            <h2><span class="n">18</span>Contact us</h2>
            <p>Questions about these Terms can be sent to:</p>
            <ul>
              <li><b>Email</b> <span className="fill">info@innonsh.com</span></li>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
