import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Check, ChevronLeft, User, Phone } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { fadeInUp } from "../../utils/animations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 20 : -20, opacity: 0 })
};

const appointmentSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  phone: z.string().min(8, "Numéro invalide")
});

export function AppointmentsSection() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(appointmentSchema),
    mode: "onChange",
    defaultValues: { name: "", phone: "" }
  });

  const nextStep = () => { setDirection(1); setStep(s => s + 1); };
  const prevStep = () => { setDirection(-1); setStep(s => s - 1); };

  // Generate next 21 available days (skipping Sunday = 0)
  const availableDays = [];
  let d = new Date();
  while (availableDays.length < 21) {
    if (d.getDay() !== 0) {
      availableDays.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }

  // Hardcoded slots for demo
  const timeSlots = ["09:00", "09:30", "10:30", "11:00", "14:00", "14:30", "16:00", "16:30"];

  const formatShortDate = (date) => {
    return date.toLocaleDateString("fr-FR", { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleBook = (data) => {
    // API call could go here
    nextStep();
  };

  return (
    <motion.section 
      id="appointments-section"
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
      className="bg-[#f0f5fa] px-5 py-12 w-full"
    >
      <SectionHeader subtitle="Planifier" title="Prendre Rendez-vous" />
      
      <div className="mt-8 bg-white p-6 rounded-[24px] border-[0.667px] border-[var(--primary-color, #4682b4)2e] shadow-[0px_4px_12px_rgba(70,130,180,0.08)] relative overflow-hidden min-h-[340px]">
        
        {step > 1 && step < 4 && (
          <button onClick={prevStep} className="absolute top-5 left-5 text-[var(--primary-color, #4682b4)] hover:opacity-70 z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {step < 4 && (
          <div className="flex justify-center gap-1.5 mb-6 mt-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? "w-6 bg-[var(--primary-color, #4682b4)]" : "w-1.5 bg-[var(--primary-color, #4682b4)33]"}`} />
            ))}
          </div>
        )}

        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            
            {/* STEP 1: DATE */}
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col">
                <h3 className="font-poppins font-semibold text-[var(--primary-color, #4682b4)] text-[16px] mb-4 text-center">Choisissez une date</h3>
                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 pb-2 custom-scrollbar">
                  {availableDays.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedDate(date); nextStep(); }}
                      className="border-[0.667px] border-[var(--primary-color, #4682b4)2e] text-[var(--primary-color, #4682b4)] rounded-[12px] p-3 text-[13px] font-medium hover:bg-[var(--primary-color, #4682b4)] hover:text-white transition-colors"
                    >
                      {formatShortDate(date)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: TIME */}
            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col">
                <h3 className="font-poppins font-semibold text-[var(--primary-color, #4682b4)] text-[16px] mb-4 text-center">Choisissez l'heure</h3>
                <div className="flex items-center justify-center gap-2 mb-4 text-[12px] text-[var(--primary-color, #4682b4)8c] bg-[var(--primary-color, #4682b4)0a] py-1.5 px-3 rounded-full w-max mx-auto">
                  <Calendar className="w-3.5 h-3.5" /> {selectedDate && formatShortDate(selectedDate)}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => { setSelectedTime(time); nextStep(); }}
                      className="border-[0.667px] border-[var(--primary-color, #4682b4)2e] text-[var(--primary-color, #4682b4)] rounded-[12px] p-2.5 text-[13px] font-medium hover:bg-[var(--primary-color, #4682b4)] hover:text-white transition-colors"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col">
                <h3 className="font-poppins font-semibold text-[var(--primary-color, #4682b4)] text-[16px] mb-4 text-center">Vos coordonnées</h3>
                <div className="flex flex-col gap-2 mb-4 text-[12px] text-[var(--primary-color, #4682b4)8c] bg-[var(--primary-color, #4682b4)0a] p-3 rounded-[12px]">
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {selectedDate && formatShortDate(selectedDate)}</p>
                  <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {selectedTime}</p>
                </div>
                <form onSubmit={handleSubmit(handleBook)} className="flex flex-col gap-4">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary-color, #4682b4)8c]" />
                    <input 
                      type="text" 
                      placeholder="Nom complet" 
                      {...register("name")}
                      className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-white border rounded-[13px] text-[16px] sm:text-[13px] focus:outline-none transition-all ${
                        errors.name ? "border-red-300 focus:border-red-500" : "border-[var(--primary-color, #4682b4)2e] focus:border-[var(--primary-color, #4682b4)]"
                      }`} 
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-1">{errors.name.message}</p>}
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--primary-color, #4682b4)8c]" />
                    <input 
                      type="tel" 
                      placeholder="Numéro de téléphone" 
                      {...register("phone")}
                      className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-white border rounded-[13px] text-[16px] sm:text-[13px] focus:outline-none transition-all ${
                        errors.phone ? "border-red-300 focus:border-red-500" : "border-[var(--primary-color, #4682b4)2e] focus:border-[var(--primary-color, #4682b4)]"
                      }`} 
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-1">{errors.phone.message}</p>}
                  </div>
                  <button type="submit" disabled={!isValid} className="w-full bg-[var(--primary-color, #4682b4)] text-white font-semibold py-3 sm:py-2.5 rounded-[13px] text-[14px] sm:text-[13px] hover:bg-[#3b6d96] transition-colors mt-2 active:scale-[0.98] disabled:opacity-50">
                    Confirmer le RDV
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center text-center mt-4">
                <div className="w-14 h-14 bg-[#10b98115] rounded-[16px] flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-[#10b981]" strokeWidth={3} />
                </div>
                <h3 className="font-poppins font-semibold text-[#10b981] text-[18px] mb-2">Rendez-vous confirmé !</h3>
                <p className="text-[rgba(70,130,180,0.55)] text-[13px] mb-1 flex items-center gap-1.5 mx-auto w-max"><Calendar className="w-4 h-4"/> {selectedDate && formatShortDate(selectedDate)}</p>
                <p className="text-[rgba(70,130,180,0.55)] text-[13px] mb-8 flex items-center gap-1.5 mx-auto w-max"><Clock className="w-4 h-4"/> {selectedTime}</p>
                <button onClick={() => { setStep(1); setDirection(-1); reset(); }} className="text-[13px] font-semibold text-[var(--primary-color, #4682b4)] hover:opacity-80 transition-opacity">
                  Nouveau rendez-vous
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

