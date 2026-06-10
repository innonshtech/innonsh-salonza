export default function HowItWorks() {
  return (
    <section className="how pad" id="how">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" data-anim><span className="dot"></span>How it works</span>
      <h2 className="h-section" data-anim style={{marginTop: '22px', }}>From first tap to lifelong client</h2>
      <p className="lead" data-anim>Five steps that turn a single booking into a relationship that keeps coming back.</p>
    </div>
    <div className="timeline">
      <div className="tl-step" data-anim>
        <div className="tl-node">1</div>
        <div className="tl-body"><div className="tl-tag">Step one</div><h3>Client books</h3><p>A client books online in seconds, day or night, from your website, Instagram, or a direct link.</p></div>
      </div>
      <div className="tl-step" data-anim>
        <div className="tl-node">2</div>
        <div className="tl-body"><div className="tl-tag">Step two</div><h3>Appointment managed</h3><p>Innonsh Salonza assigns the right stylist, blocks the time, and sends smart reminders automatically.</p></div>
      </div>
      <div className="tl-step" data-anim>
        <div className="tl-node">3</div>
        <div className="tl-body"><div className="tl-tag">Step three</div><h3>Service delivered</h3><p>The stylist sees history, formulas, and notes at a glance, so every visit feels personal.</p></div>
      </div>
      <div className="tl-step" data-anim>
        <div className="tl-node">4</div>
        <div className="tl-body"><div className="tl-tag">Step four</div><h3>Payment processed</h3><p>Express checkout handles tips, packages, and split payments in one tap. Stock updates instantly.</p></div>
      </div>
      <div className="tl-step" data-anim>
        <div className="tl-node">5</div>
        <div className="tl-body"><div className="tl-tag">Step five</div><h3>Customer retained</h3><p>Automated follow ups, loyalty rewards, and rebooking nudges bring the client back, on their own.</p></div>
      </div>
    </div>
  </div>
</section>
  );
}