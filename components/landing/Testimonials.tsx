export default function Testimonials() {
  return (
    <section className="testimonials pad-sm">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" data-anim><span className="dot"></span>Loved by salons</span>
      <h2 className="h-section" data-anim style={{marginTop: '22px', }}>The teams behind the chairs</h2>
    </div>
  </div>
  <div className="marquee-track">
    <div className="marquee" id="marquee">
      <div className="tcard">
        <div className="stars">★★★★★</div>
        <p className="quote">We cut no shows in half within a month. The automated reminders alone paid for Innonsh Salonza twice over.</p>
        <div className="person"><span className="pa" style={{background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', }}></span><div><b>Aanya Sharma</b><span>Owner, Lumière Studio</span></div></div>
      </div>
      <div className="tcard">
        <div className="stars">★★★★★</div>
        <p className="quote">For the first time I can see every location in one screen. I make decisions in minutes, not weeks.</p>
        <div className="person"><span className="pa" style={{background: 'linear-gradient(135deg,#6366F1,#4F46E5)', }}></span><div><b>Karan Malhotra</b><span>Founder, Studio Vega</span></div></div>
      </div>
      <div className="tcard">
        <div className="stars">★★★★★</div>
        <p className="quote">My stylists love it because the admin disappeared. They just focus on clients and their commissions are clear.</p>
        <div className="person"><span className="pa" style={{background: 'linear-gradient(135deg,#10B981,#059669)', }}></span><div><b>Priya Nair</b><span>Manager, The Glow Bar</span></div></div>
      </div>
      <div className="tcard">
        <div className="stars">★★★★★</div>
        <p className="quote">Inventory used to be a guessing game. Now reorders are drafted for me before anything runs out.</p>
        <div className="person"><span className="pa" style={{background: 'linear-gradient(135deg,#EC4899,#DB2777)', }}></span><div><b>Neha Verma</b><span>Owner, Velvet Lane</span></div></div>
      </div>
      <div className="tcard">
        <div className="stars">★★★★★</div>
        <p className="quote">Revenue is up 28% since we switched. The loyalty automations quietly bring people back every month.</p>
        <div className="person"><span className="pa" style={{background: 'linear-gradient(135deg,#0EA5E9,#0284C7)', }}></span><div><b>Dev Mehta</b><span>Director, Halo &amp; Co</span></div></div>
      </div>
    </div>
  </div>
</section>
  );
}