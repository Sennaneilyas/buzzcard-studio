import { useCallback } from "react";
import { useToast } from "../../components/Toast/Toast";

const servicesList = [
  {
    title: "Precision cuts",
    description: "Modern shapes tailored to your features.",
    price: "$45",
  },
  {
    title: "Color & gloss",
    description: "Soft dimension and rich shine.",
    price: "$75",
  },
  {
    title: "Styling",
    description: "Effortless looks for work or events.",
    price: "$35",
  },
  {
    title: "Hair care",
    description: "Professional advice for healthy hair.",
    price: "$30",
  },
];

export const HairServicesSection = () => {
  const addToast = useToast();

  const handleBook = useCallback(
    (service) => {
      addToast(`Booked: ${service.title} — we'll contact you to confirm.`);
    },
    [addToast]
  );

  return (
    <section className="bg-white px-5 py-6" aria-labelledby="hair-services-heading">
      <div className="mb-4 flex items-center justify-center">
        <h2 id="hair-services-heading" className="text-lg font-semibold tracking-[0.4px] text-[#1e3d25]">
          Services
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {servicesList.map((service) => (
          <div key={service.title} className="rounded-2xl border border-[#1e3d251a] bg-[#f8f7f3] p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1e3d25]">{service.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#6b6558]">{service.description}</p>
              </div>
              <div className="text-sm font-semibold text-[#1e3d25]">{service.price}</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBook(service)}
                className="ml-auto rounded-2xl bg-[#1e3d25] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#274a2d]"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
