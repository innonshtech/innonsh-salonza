export function bookingEmailHtml({
  salonName,
  serviceName,
  customerName,
  date,
}: {
  salonName: string;
  serviceName: string;
  customerName: string;
  date: string;
}) {
  return `
    <h2>Booking Confirmed</h2>
    <p>Hi ${customerName},</p>
    <p>Your booking at <strong>${salonName}</strong> for <strong>${serviceName}</strong> is confirmed for <strong>${date}</strong>.</p>
    <p>Thanks,<br/>${salonName}</p>
  `;
}
