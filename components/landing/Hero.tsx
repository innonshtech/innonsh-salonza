export default function Hero() {
  return (
    <header className="hero">
  <div className="blob blob-1"></div>
  <div className="blob blob-2"></div>
  <div className="wrap hero-grid">
    <div className="hero-copy">
      <span className="eyebrow" data-anim><span className="dot"></span>The salon operating system</span>
      <h1 className="h-display" data-anim>Run your entire salon from one <span className="gradient-text">intelligent platform</span></h1>
      <p className="lead" data-anim>Innonsh Salonza helps salons automate appointments, billing, inventory, staff management, customer engagement, and business analytics from one unified dashboard.</p>
      <div className="hero-actions" data-anim>
        <a href="#cta" className="btn btn-primary" data-magnetic>Contact Sales
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <a href="#experience" className="btn btn-ghost" data-magnetic>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Watch product tour
        </a>
      </div>
      <div className="hero-trust" data-anim>
        <div className="avatars">
          <span style={{background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', }}></span>
          <span style={{background: 'linear-gradient(135deg,#6366F1,#4F46E5)', }}></span>
          <span style={{background: 'linear-gradient(135deg,#10B981,#059669)', }}></span>
          <span style={{background: 'linear-gradient(135deg,#EC4899,#DB2777)', }}></span>
        </div>
        <div className="trust-text">
          <div className="stars">★★★★★</div>
          Trusted by <b>3,200+ salons</b> across 14 countries
        </div>
      </div>
    </div>

    <div className="hero-visual" id="heroVisual">
      <div className="dashboard" data-anim="scale">
        <div className="db-top">
          <div className="db-title"><span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg></span>Dashboard</div>
          <div className="db-dots"><i></i><i></i><i></i></div>
        </div>
        <div className="db-grid">
          <div className="db-card" data-parallax="20">
            <div className="lbl"><span className="pin o"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span>Today's Appointments</div>
            <div className="num"><span data-count="48">0</span></div>
            <div className="sub"><span className="up">+12%</span> vs last week</div>
          </div>
          <div className="db-card" data-parallax="-16">
            <div className="lbl"><span className="pin g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></span>Revenue</div>
            <div className="num">$<span data-count="9.4" data-decimals="1">0</span>k</div>
            <div className="sub"><span className="up">+8.5%</span> today</div>
          </div>
          <div className="db-card" data-parallax="28">
            <div className="lbl"><span className="pin b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></span>Active Staff</div>
            <div className="num"><span data-count="11">0</span> / 14</div>
            <div className="sub">3 on break</div>
          </div>
          <div className="db-card" data-parallax="-22">
            <div className="lbl"><span className="pin r"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg></span>Inventory Alerts</div>
            <div className="num"><span data-count="5">0</span></div>
            <div className="sub">low stock items</div>
          </div>
          <div className="db-card db-wide" data-parallax="14">
            <div className="lbl"><span className="pin o"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg></span>Weekly performance</div>
            <div className="db-bars">
              <span style={{height: '42%', }}></span><span style={{height: '64%', }}></span><span style={{height: '50%', }}></span>
              <span style={{height: '78%', }}></span><span style={{height: '60%', }}></span><span style={{height: '92%', }}></span><span style={{height: '70%', }}></span>
            </div>
          </div>
        </div>
      </div>

      <div className="float-chip chip-1" data-parallax="40">
        <span className="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6L9 17l-5-5"/></svg></span>
        <div>Booking confirmed<small>Riya, 2:30 PM</small></div>
      </div>
      <div className="float-chip chip-2" data-parallax="-34">
        <span className="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></span>
        <div>Payment received<small>$120 · Color &amp; cut</small></div>
      </div>
      <div className="float-chip chip-3" data-parallax="48">
        <span className="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg></span>
        <div>No show reduced<small>This month</small></div>
      </div>
    </div>
  </div>
</header>
  );
}