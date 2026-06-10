export default function Problem() {
  return (
    <section className="problem pad">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" data-anim><span className="dot"></span>The daily grind</span>
      <h2 className="h-section" data-anim style={{marginTop: '22px', }}>Running a salon shouldn't feel chaotic</h2>
      <p className="lead" data-anim>Spreadsheets, sticky notes, and four disconnected apps. The busywork buries the craft. Here is what most salons fight every single day.</p>
    </div>
    <div className="problem-grid">
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
        <h3>Missed appointments</h3>
        <p>Bookings slip through phone calls and DMs, leaving chairs empty during peak hours.</p>
      </div>
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
        <h3>No shows</h3>
        <p>Without reminders, clients forget. Every no show is revenue that never returns.</p>
      </div>
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></div>
        <h3>Manual billing</h3>
        <p>Handwritten bills and cash drawers create errors, disputes, and slow checkouts.</p>
      </div>
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12l8.73-5.04M12 22V12"/></svg></div>
        <h3>Inventory wastage</h3>
        <p>Color and product expire unnoticed while popular stock runs out mid service.</p>
      </div>
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg></div>
        <h3>Scheduling conflicts</h3>
        <p>Double bookings and unclear shifts turn the front desk into a daily firefight.</p>
      </div>
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg></div>
        <h3>Poor retention</h3>
        <p>First time clients rarely return because nothing brings them back in a timely way.</p>
      </div>
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
        <h3>No visibility</h3>
        <p>Owners only learn how the month went after it ends, when it is too late to react.</p>
      </div>
      <div className="prob-card" data-anim>
        <div className="prob-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <h3>Disconnected tools</h3>
        <p>Booking, billing, and marketing live in separate apps that never talk to each other.</p>
      </div>
    </div>
  </div>
</section>
  );
}