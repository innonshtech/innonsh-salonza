export default function Solution() {
  return (
    <section className="solution pad">
  <div className="wrap sol-grid">
    <div className="sol-copy">
      <span className="eyebrow" data-anim><span className="dot"></span>The solution</span>
      <h2 className="h-section" data-anim>Meet <span className="gradient-text">Innonsh Salonza</span></h2>
      <p className="lead" data-anim>Your complete operating system for salon growth. Every part of the business connected, automated, and visible in real time, so you can spend less time managing and more time creating.</p>
      <div className="sol-list">
        <div className="sol-item" data-anim>
          <span className="sol-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></span>
          <div><b>One source of truth</b><span>Bookings, payments, clients, and stock in a single connected system.</span></div>
        </div>
        <div className="sol-item" data-anim>
          <span className="sol-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></span>
          <div><b>Automation that pays</b><span>Reminders, follow ups, and re engagement run quietly in the background.</span></div>
        </div>
        <div className="sol-item" data-anim>
          <span className="sol-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></span>
          <div><b>Decisions backed by data</b><span>Live KPIs and forecasts give owners the full picture, any time.</span></div>
        </div>
      </div>
    </div>

    <div className="sol-visual" data-anim="scale">
      <div className="sol-screen-top"><i></i><i></i><i></i></div>
      <div className="sol-metric">
        <div className="m"><div className="v">$48.2k</div><div className="k">Monthly revenue</div></div>
        <div className="m"><div className="v">1,284</div><div className="k">Appointments</div></div>
        <div className="m"><div className="v">94%</div><div className="k">Chair utilization</div></div>
      </div>
      <div className="sol-chart">
        <svg viewBox="0 0 400 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path id="areaPath" d="M0,120 C40,100 70,60 110,70 C150,80 180,40 220,45 C260,50 300,20 340,28 C370,34 390,22 400,18 L400,150 L0,150 Z" fill="url(#grad)"/>
          <path id="linePath" d="M0,120 C40,100 70,60 110,70 C150,80 180,40 220,45 C260,50 300,20 340,28 C370,34 390,22 400,18" fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  </div>
</section>
  );
}