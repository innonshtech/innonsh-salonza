'use client';

export default function CTA() {
  return (
    <section className="cta-final" id="cta">
      <div className="wrap">
        <div className="cta-box" data-anim="scale">
          <div className="cta-orb orb-1"></div>
          <div className="cta-orb orb-2"></div>
          <div className="cta-split">
            <div className="cta-info">
              <h2>Ready to transform your salon operations?</h2>
              <p>Book a free 30-minute demo with our friendly team. We'll show you exactly how Innonsh Salonza can make your salon run smoother—no commitment, no pressure.</p>
            </div>
            <div className="cta-card">
              <h3>Send us a message</h3>
              <p>Have questions or want to see a live demo? Fill out the form below.</p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" placeholder="Enter your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="salonName">Salon Name</label>
                  <input type="text" id="salonName" placeholder="Your salon or business name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" placeholder="Tell us about your requirements..." required></textarea>
                </div>
                <button type="submit" className="cta-submit-btn" data-magnetic>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}