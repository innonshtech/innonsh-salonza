export default function Experience() {
  return (
    <section className="experience pad" id="experience">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" data-anim><span className="dot"></span>Product experience</span>
      <h2 className="h-section" data-anim style={{marginTop: '22px', }}>A workspace built for the chair, the desk, and the back office</h2>
      <p className="lead" data-anim>Five connected screens. One seamless flow from the first booking to the final report.</p>
    </div>
  </div>

  <div className="h-scroll-wrap" id="hScrollWrap">
    <div className="h-track" id="hTrack">

      <div className="screen">
        <div className="screen-head">
          <div><span className="st">Booking</span><h3>Booking dashboard</h3></div>
          <span className="screen-num">01</span>
        </div>
        <div className="ui">
          <div className="ui-row"><div className="ua" style={{background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', }}>RK</div><div className="ut"><b>Riya Kapoor</b><small>Balayage · 2:30 PM · Aanya</small></div><span className="ui-tag tag-green">Confirmed</span></div>
          <div className="ui-row"><div className="ua" style={{background: 'linear-gradient(135deg,#6366F1,#4F46E5)', }}>DM</div><div className="ut"><b>Dev Mehta</b><small>Haircut · 3:15 PM · Karan</small></div><span className="ui-tag tag-orange">Arriving</span></div>
          <div className="ui-row"><div className="ua" style={{background: 'linear-gradient(135deg,#10B981,#059669)', }}>SP</div><div className="ut"><b>Sara Patel</b><small>Keratin · 4:00 PM · Aanya</small></div><span className="ui-tag tag-blue">Waitlist</span></div>
          <div className="ui-row"><div className="ua" style={{background: 'linear-gradient(135deg,#EC4899,#DB2777)', }}>NV</div><div className="ut"><b>Neha Verma</b><small>Spa · 4:45 PM · Priya</small></div><span className="ui-tag tag-green">Confirmed</span></div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-head">
          <div><span className="st">CRM</span><h3>Client profile</h3></div>
          <span className="screen-num">02</span>
        </div>
        <div className="ui">
          <div className="ui-row" style={{background: 'rgba(124,58,237,.1)', }}><div className="ua" style={{background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', }}>RK</div><div className="ut"><b>Riya Kapoor · VIP</b><small>Member since 2022 · 38 visits</small></div><span className="ui-tag tag-orange">Gold</span></div>
          <div className="ui-stats" style={{marginTop: '14px', }}>
            <div className="ui-stat"><div className="uv">$2,140</div><div className="uk">Lifetime value</div></div>
            <div className="ui-stat"><div className="uv">7B / 30v</div><div className="uk">Color formula</div></div>
          </div>
          <div className="ui-row"><div className="ut"><b>Last service</b><small>Balayage + gloss · 14 days ago</small></div><span className="ui-tag tag-green">Rebook</span></div>
          <div className="ui-row"><div className="ut"><b>Loyalty points</b><small>1,240 points · next reward at 1,500</small></div></div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-head">
          <div><span className="st">Billing</span><h3>Checkout screen</h3></div>
          <span className="screen-num">03</span>
        </div>
        <div className="ui">
          <div className="ui-row"><div className="ut"><b>Balayage</b><small>Aanya · 90 min</small></div><span className="ui-tag tag-blue">$140</span></div>
          <div className="ui-row"><div className="ut"><b>Gloss treatment</b><small>Add on</small></div><span className="ui-tag tag-blue">$45</span></div>
          <div className="ui-row"><div className="ut"><b>Hydrating mask</b><small>Retail</small></div><span className="ui-tag tag-blue">$28</span></div>
          <div className="ui-row" style={{background: 'rgba(16,185,129,.12)', }}><div className="ut"><b>Total · incl. tip</b><small>Card · split 2 ways</small></div><span className="ui-tag tag-green">$235</span></div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-head">
          <div><span className="st">Inventory</span><h3>Inventory panel</h3></div>
          <span className="screen-num">04</span>
        </div>
        <div className="ui">
          <div className="ui-row"><div className="ut"><b>Developer 30 vol</b><small>SKU 8841 · shelf A2</small></div><span className="ui-tag tag-green">In stock · 42</span></div>
          <div className="ui-row"><div className="ut"><b>Toner 9N</b><small>SKU 2210 · shelf B1</small></div><span className="ui-tag tag-orange">Low · 6</span></div>
          <div className="ui-row" style={{background: 'rgba(239,68,68,.1)', }}><div className="ut"><b>Bond builder</b><small>SKU 5573 · shelf C3</small></div><span className="ui-tag" style={{background: 'rgba(239,68,68,.18)', color: '#F87171', }}>Reorder</span></div>
          <div className="ui-row"><div className="ut"><b>Purchase order</b><small>Auto draft · 3 suppliers</small></div><span className="ui-tag tag-blue">Ready</span></div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-head">
          <div><span className="st">Analytics</span><h3>Analytics dashboard</h3></div>
          <span className="screen-num">05</span>
        </div>
        <div className="ui">
          <div className="ui-stats">
            <div className="ui-stat"><div className="uv">$48.2k</div><div className="uk">Revenue this month</div></div>
            <div className="ui-stat"><div className="uv">+24%</div><div className="uk">vs last month</div></div>
          </div>
          <div className="ui-bars">
            <span style={{height: '40%', }}></span><span style={{height: '58%', }}></span><span style={{height: '46%', }}></span>
            <span style={{height: '72%', }}></span><span style={{height: '64%', }}></span><span style={{height: '88%', }}></span><span style={{height: '96%', }}></span>
          </div>
        </div>
      </div>

    </div>
  </div>
  <p className="scroll-hint">Scroll to explore the workspace</p>
</section>
  );
}