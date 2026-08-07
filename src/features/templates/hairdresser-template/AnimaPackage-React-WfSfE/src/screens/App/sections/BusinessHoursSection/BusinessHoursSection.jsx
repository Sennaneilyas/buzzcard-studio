const businessHours = [
  {
    day: "Sunday",
    hours: "09:00 — 18:00",
    icon: "/img/icon.svg",
    backgroundClass: "bg-[#f5f4f0]",
  },
  {
    day: "Monday",
    hours: "09:00 — 20:00",
    icon: "/img/icon-1.svg",
    backgroundClass: "bg-white",
  },
  {
    day: "Tuesday",
    hours: "09:00 — 20:00",
    icon: "/img/icon-2.svg",
    backgroundClass:
      "bg-[#1e3d2512] border-l-[2.67px] [border-left-style:solid] border-[#8b7355]",
    isToday: true,
  },
  {
    day: "Wednesday",
    hours: "09:00 — 20:00",
    icon: "/img/icon-3.svg",
    backgroundClass: "bg-white",
  },
  {
    day: "Thursday",
    hours: "09:00 — 20:00",
    icon: "/img/icon-4.svg",
    backgroundClass: "bg-[#f5f4f0]",
  },
  {
    day: "Friday",
    hours: "09:00 — 20:00",
    icon: "/img/icon-5.svg",
    backgroundClass: "bg-white",
  },
  {
    day: "Saturday",
    hours: "10:00 — 18:00",
    icon: "/img/icon-6.svg",
    backgroundClass: "bg-[#f5f4f0]",
  },
];

export const BusinessHoursSection = () => {
  return (
    <section
      className="px-5 py-7 self-stretch w-full flex-[0_0_auto] bg-white flex flex-col items-start relative"
      aria-labelledby="business-hours-heading"
    >
      <div className="flex flex-col items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
        <h2
          id="business-hours-heading"
          className="relative w-fit mt-[-1.00px] [font-family:'Playfair_Display',Helvetica] font-semibold text-[#1e3d25] text-xl tracking-[0.50px] leading-7 whitespace-nowrap"
        >
          Business Hours
        </h2>
        <img
          className="relative flex-[0_0_auto]"
          alt=""
          aria-hidden="true"
          src="/img/container-10.svg"
        />
      </div>
      <div className="flex flex-col items-start pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
        <dl className="flex flex-col h-[309px] items-start relative self-stretch w-full rounded-xl overflow-hidden border-[0.67px] border-solid border-[#1e3d251a]">
          {businessHours.map((schedule) => (
            <div
              key={schedule.day}
              className={`flex w-[343px] items-center justify-between px-4 py-3 relative flex-[0_0_auto] ${schedule.backgroundClass}`}
            >
              <dt className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                <img
                  className="relative w-[13px] h-[13px]"
                  alt=""
                  aria-hidden="true"
                  src={schedule.icon}
                />
                <span className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <span
                    className={`relative w-fit mt-[-1.00px] [font-family:'Lato',Helvetica] text-[#1e3d25] text-sm tracking-[0] leading-5 whitespace-nowrap ${
                      schedule.isToday ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {schedule.day}
                  </span>
                </span>
                {schedule.isToday && (
                  <span className="inline-flex flex-col items-start px-[5px] py-px relative flex-[0_0_auto] bg-[#8b73551f] rounded">
                    <span className="relative w-fit mt-[-1.00px] [font-family:'Lato',Helvetica] font-semibold text-[#8b7355] text-[10px] tracking-[0] leading-[15px] whitespace-nowrap">
                      Today
                    </span>
                  </span>
                )}
              </dt>
              <dd className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <time
                  className="relative w-fit mt-[-1.00px] [font-family:'Lato',Helvetica] font-normal text-[#6b6558] text-sm tracking-[0] leading-5 whitespace-nowrap"
                  aria-label={`${schedule.day}: ${schedule.hours}`}
                >
                  {schedule.hours}
                </time>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
