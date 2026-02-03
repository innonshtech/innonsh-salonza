import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import Service from "@/models/Service";

export default async function ServicesPage({ params }: any) {
  await dbConnect();

  // 🔥 FIX: params is a Promise → unwrap it
  const { salon: slug } = await params;

  const salon = await Salon.findOne({ slug });
  if (!salon) return <div>Salon not found</div>;

  const services = await Service.find({ salonId: salon._id });

  return (
    <div style={{ padding: 30 }}>
      <h1>{salon.name} — Services</h1>

      <ul style={{ marginTop: 20 }}>
        {services.map((service: any) => (
          <li key={service._id}>
            <strong>{service.name}</strong> — {service.duration} mins — ₹{service.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
