export default function NoAccess() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Your subscription has expired</h1>
      <p>Please renew your plan in settings.</p>
      <a href="/dashboard/settings">
        <button>Go To Settings</button>
      </a>
    </div>
  );
}
