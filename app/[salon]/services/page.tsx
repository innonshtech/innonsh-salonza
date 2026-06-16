import { SalonRepository } from "@/repositories/SalonRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";

export default async function ServicesPage({ params }: any) {
  // 🔥 FIX: params is a Promise → unwrap it
  const { salon: slug } = await params;

  const salon = await SalonRepository.findOne({ slug });
  if (!salon) return <div>Salon not found</div>;

  const services = await ServiceRepository.find({ salonId: salon.id, isActive: true });

  return (
    <div style={{ padding: 30 }}>
      <h1>{salon.name} — Services</h1>

      <ul style={{ marginTop: 20 }}>
        {services.map((service: any) => (
          <li key={service.id}>
            <strong>{service.name}</strong> — {service.duration} mins — ₹{service.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
