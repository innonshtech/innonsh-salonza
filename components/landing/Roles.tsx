export default function Roles() {
  return (
    <section className="pad" id="roles">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" data-anim><span className="dot"></span>Built for every role</span>
      <h2 className="h-section" data-anim style={{marginTop: '22px', }}>One platform, tailored to your team</h2>
      <p className="lead" data-anim>Everyone sees exactly what they need to do their best work, and nothing they shouldn't.</p>
    </div>
    <div className="roles-grid">

      <div className="role-card" data-anim>
        <div className="role-top">
          <span className="role-badge" style={{background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', }}>O</span>
          <div><h3>Owner</h3><div className="role-sub">The full picture</div></div>
        </div>
        <div className="role-block"><div className="rl">Responsibilities</div><p>Steer growth across every location with live financials and forecasts.</p></div>
        <div className="role-block"><div className="rl">Permissions</div><div className="perms"><span>Full access</span><span>Finance</span><span>Multi site</span></div></div>
        <div className="role-block"><div className="rl">Benefit</div><p>Run the business from a phone, with answers before anyone has to ask.</p></div>
      </div>

      <div className="role-card" data-anim>
        <div className="role-top">
          <span className="role-badge" style={{background: 'linear-gradient(135deg,#6366F1,#4F46E5)', }}>M</span>
          <div><h3>Salon Manager</h3><div className="role-sub">The operator</div></div>
        </div>
        <div className="role-block"><div className="rl">Responsibilities</div><p>Own daily operations, staffing, stock, and the client experience.</p></div>
        <div className="role-block"><div className="rl">Permissions</div><div className="perms"><span>Scheduling</span><span>Inventory</span><span>Reports</span></div></div>
        <div className="role-block"><div className="rl">Benefit</div><p>Spot bottlenecks early and keep every shift running smoothly.</p></div>
      </div>

      <div className="role-card" data-anim>
        <div className="role-top">
          <span className="role-badge" style={{background: 'linear-gradient(135deg,#10B981,#059669)', }}>S</span>
          <div><h3>Stylist</h3><div className="role-sub">The craft</div></div>
        </div>
        <div className="role-block"><div className="rl">Responsibilities</div><p>Deliver services, log formulas, and grow a loyal client base.</p></div>
        <div className="role-block"><div className="rl">Permissions</div><div className="perms"><span>Own calendar</span><span>Clients</span><span>Commission</span></div></div>
        <div className="role-block"><div className="rl">Benefit</div><p>Less admin, more chair time, and a clear view of personal earnings.</p></div>
      </div>

      <div className="role-card" data-anim>
        <div className="role-top">
          <span className="role-badge" style={{background: 'linear-gradient(135deg,#EC4899,#DB2777)', }}>R</span>
          <div><h3>Receptionist</h3><div className="role-sub">The front desk</div></div>
        </div>
        <div className="role-block"><div className="rl">Responsibilities</div><p>Manage the front desk, bookings, check ins, and fast checkouts.</p></div>
        <div className="role-block"><div className="rl">Permissions</div><div className="perms"><span>Booking</span><span>POS</span><span>Waitlist</span></div></div>
        <div className="role-block"><div className="rl">Benefit</div><p>Handle a busy lobby with calm, and never lose a walk in again.</p></div>
      </div>

    </div>
  </div>
</section>
  );
}