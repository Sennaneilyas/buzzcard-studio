import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const officeHoursData = [
  { day: "Lundi", hours: "09:00 – 17:00", open: 9, close: 17, isClosed: false },
  { day: "Mardi", hours: "09:00 – 17:00", open: 9, close: 17, isClosed: false },
  { day: "Mercredi", hours: "09:00 – 13:00", open: 9, close: 13, isClosed: false },
  { day: "Jeudi", hours: "09:00 – 17:00", open: 9, close: 17, isClosed: false },
  { day: "Vendredi", hours: "09:00 – 17:00", open: 9, close: 17, isClosed: false },
  { day: "Samedi", hours: "10:00 – 14:00", open: 10, close: 14, isClosed: false },
  { day: "Dimanche", hours: "Fermé", isClosed: true }
];

export function OfficeHoursSection() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentDayIndex = (currentTime.getDay() + 6) % 7; 
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes().toString().padStart(2, "0");
  const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinutes}`;
  
  const todaySchedule = officeHoursData[currentDayIndex];
  const isOpenNow = !todaySchedule.isClosed && currentHour >= todaySchedule.open && currentHour < todaySchedule.close;

  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
      className="bg-transparent px-5 py-12 w-full flex flex-col items-center"
    >
      <motion.div variants={fadeInUp} className="w-full">
        <SectionHeader subtitle="HORAIRES DE LA CLINIQUE" title="Heures d'Ouverture" />
      </motion.div>
      
      <motion.div variants={fadeInUp} className="mt-8 mb-6 inline-flex items-center gap-2 rounded-full border-[0.67px] border-[var(--primary-color,#4682b4)2e] bg-[#1c344f0d] px-[18px] py-2">
        <span className={`h-[7px] w-[7px] rounded-full ${isOpenNow ? "bg-[#10b981]" : "bg-[#ef4444]"}`} />
        <span className="text-xs font-semibold text-[var(--primary-color,#4682b4)8c]">
          {isOpenNow ? "Ouvert actuellement" : "Fermé actuellement"} · {timeString}
        </span>
      </motion.div>
      
      <motion.div variants={fadeInUp} className="w-full overflow-hidden rounded-2xl border-[0.67px] border-[var(--primary-color,#4682b4)2e]">
        <table className="w-full border-collapse text-left">
          <tbody>
            {officeHoursData.map((schedule, index) => {
              const isToday = index === currentDayIndex;
              const hasBottomBorder = index < officeHoursData.length - 1;
              const bgClass = isToday ? "bg-[var(--primary-color,#4682b4)14]" : (index % 2 === 0 ? "bg-white" : "bg-[#1c344f05]");

              return (
                <tr key={schedule.day} className={`${bgClass} ${hasBottomBorder ? "border-b-[0.67px] border-[var(--primary-color,#4682b4)2e]" : ""}`}>
                  <th className="px-4 py-3 font-normal align-middle">
                    {isToday ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-color,#4682b4)]" />
                        <span className="text-[13px] font-bold text-[var(--primary-color,#4682b4)]">{schedule.day}</span>
                        <span className="rounded-full bg-[var(--primary-color,#4682b4)] px-2 py-0.5 text-[10px] font-semibold text-white">Aujourd'hui</span>
                      </span>
                    ) : (
                      <span className="text-[13px] font-medium text-[var(--primary-color,#4682b4)]">{schedule.day}</span>
                    )}
                  </th>
                  <td className={`px-4 py-3 text-right align-middle text-[13px] font-medium ${schedule.isClosed ? "text-[var(--primary-color,#4682b4)8c]" : "text-[var(--primary-color,#4682b4)]"}`}>
                    {schedule.hours}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </motion.section>
  );
}

