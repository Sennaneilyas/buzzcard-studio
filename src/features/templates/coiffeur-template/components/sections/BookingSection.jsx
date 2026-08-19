import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Check, ChevronLeft, ChevronRight, User, Phone, ChevronDown } from "lucide-react";
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

const bookingSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  phone: z.string().min(8, "Numéro invalide"),
  service: z.string().min(1, "Veuillez sélectionner un service")
});

export function BookingSection({ profile }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: { name: "", phone: "", service: "" }
  });

  const formData = watch();

  const nextStep = () => { setDirection(1); setStep(s => s + 1); };
  const prevStep = () => { setDirection(-1); setStep(s => s - 1); };

  // Calendar Logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Shift to Monday = 0

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["L", "M", "M", "J", "V", "S", "D"];

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isPast = date < today;
      const isSunday = date.getDay() === 0;
      const isDisabled = isPast || isSunday;
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push(
        <button
          key={`day-${i}`}
          disabled={isDisabled}
          onClick={() => { setSelectedDate(date); nextStep(); }}
          className={`h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-medium transition-colors mx-auto ${
            isDisabled ? "text-gray-300 cursor-not-allowed" : "text-[#1A1A1A] hover:bg-[var(--primary-color, #C5A880)]/15"
          } ${isSelected ? "bg-[var(--primary-color, #C5A880)] text-white hover:bg-[var(--primary-color, #C5A880)]" : ""}`}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const timeSlots = ["09:00", "09:30", "10:30", "11:00", "14:00", "14:30", "16:00", "16:30"];

  const formatShortDate = (date) => {
    return date.toLocaleDateString("fr-FR", { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleBook = (data) => {
    // API Call goes here
    nextStep();
  };

  return (
    <motion.section 
      id="booking-section"
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
      className="bg-transparent px-6 py-12 w-full flex flex-col items-center"
    >
      <div className="w-full">
        <SectionHeader subtitle="Réservation" title="Prendre un RDV" align="center" />
      </div>
      
      <div className="mt-8 bg-white/90 backdrop-blur-md w-full max-w-[400px] p-6 rounded-[24px] border border-black/5 shadow-xl relative overflow-hidden min-h-[360px]">
        
        {step > 1 && step < 4 && (
          <button onClick={prevStep} className="absolute top-5 left-5 text-[var(--primary-color, #C5A880)] hover:text-[#1A1A1A] transition-colors z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {step < 4 && (
          <div className="flex justify-center gap-1.5 mb-6 mt-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? "w-6 bg-[var(--primary-color, #C5A880)]" : "w-1.5 bg-[var(--primary-color, #C5A880)]/20"}`} />
            ))}
          </div>
        )}

        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            
            {/* STEP 1: CALENDAR */}
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col">
                <h3 className="font-times font-bold text-[#1A1A1A] text-lg mb-4 text-center">Choisissez une date</h3>
                
                {/* Calendar Component */}
                <div className="w-full select-none">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <button onClick={prevMonth} className="text-[var(--primary-color, #C5A880)] hover:text-[#1A1A1A] transition-colors p-1"><ChevronLeft className="w-4 h-4"/></button>
                    <span className="font-medium text-[14px] text-[#1A1A1A]">{monthNames[month]} {year}</span>
                    <button onClick={nextMonth} className="text-[var(--primary-color, #C5A880)] hover:text-[#1A1A1A] transition-colors p-1"><ChevronRight className="w-4 h-4"/></button>
                  </div>
                  <div className="grid grid-cols-7 mb-2">
                    {dayNames.map((d, i) => <div key={i} className="text-center text-[11px] font-semibold text-gray-400">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-y-2">
                    {renderCalendarDays()}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TIME */}
            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col">
                <h3 className="font-times font-bold text-[#1A1A1A] text-lg mb-4 text-center">Choisissez l'heure</h3>
                <div className="flex items-center justify-center gap-2 mb-6 text-[12px] text-[var(--primary-color, #C5A880)] bg-[var(--primary-color, #C5A880)]/10 py-1.5 px-3 rounded-full w-max mx-auto">
                  <Calendar className="w-3.5 h-3.5" /> {selectedDate && formatShortDate(selectedDate)}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => { setSelectedTime(time); nextStep(); }}
                      className="border border-black/5 text-[#1A1A1A] rounded-[12px] p-2.5 text-[13px] font-medium hover:bg-[var(--primary-color, #C5A880)] hover:text-white hover:border-[var(--primary-color, #C5A880)] transition-colors"
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
                <h3 className="font-times font-bold text-[#1A1A1A] text-lg mb-4 text-center">Vos coordonnées</h3>
                <div className="flex flex-col gap-2 mb-5 text-[12px] text-[var(--primary-color, #C5A880)] bg-[var(--primary-color, #C5A880)]/10 p-3 rounded-[12px]">
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {selectedDate && formatShortDate(selectedDate)}</p>
                  <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {selectedTime}</p>
                </div>
                <form onSubmit={handleSubmit(handleBook)} className="flex flex-col gap-4">
                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between pl-4 pr-4 py-2 sm:py-2 bg-white border border-black/5 rounded-[13px] text-[16px] sm:text-[13px] cursor-pointer transition-all"
                    >
                      {formData.service ? (
                        <div className="flex items-center gap-3">
                          <img 
                            src={profile?.services?.find(s => s.name === formData.service)?.imgSrc} 
                            className="w-7 h-7 object-cover mix-blend-multiply" 
                            alt="icon" 
                          />
                          <span className="text-[#1A1A1A] font-medium">{formData.service}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 py-1.5">Sélectionnez un service</span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </div>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-[110%] left-0 w-full bg-white rounded-[13px] shadow-xl border border-black/5 overflow-hidden z-20 flex flex-col"
                        >
                          {profile?.services?.map(s => (
                            <div 
                              key={s.id} 
                              onClick={() => {
                                setValue("service", s.name, { shouldValidate: true });
                                setIsDropdownOpen(false);
                              }}
                              className="flex items-center gap-3 p-3 hover:bg-[var(--primary-color, #C5A880)]/10 cursor-pointer transition-colors border-b border-black/5 last:border-0"
                            >
                              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center p-1">
                                <img 
                                  src={s.imgSrc} 
                                  alt={s.imgAlt} 
                                  className="w-full h-full object-cover mix-blend-multiply" 
                                  style={{ WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 80%)', maskImage: 'radial-gradient(circle, black 50%, transparent 80%)' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[#1A1A1A] font-medium text-[13px]">{s.name}</span>
                                <span className="text-[var(--primary-color, #C5A880)] text-[12px] font-semibold">{s.price}</span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Nom complet" 
                      {...register("name")}
                      className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-white border rounded-[13px] text-[16px] sm:text-[13px] focus:outline-none transition-all ${
                        errors.name ? "border-red-300 focus:border-red-500" : "border-black/5 focus:border-[var(--primary-color, #C5A880)]"
                      }`} 
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-1">{errors.name.message}</p>}
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" 
                      placeholder="Numéro de téléphone" 
                      {...register("phone")}
                      className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-white border rounded-[13px] text-[16px] sm:text-[13px] focus:outline-none transition-all ${
                        errors.phone ? "border-red-300 focus:border-red-500" : "border-black/5 focus:border-[var(--primary-color, #C5A880)]"
                      }`} 
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-1">{errors.phone.message}</p>}
                  </div>
                  <button type="submit" disabled={!isValid} className="w-full bg-[#1A1A1A] text-white font-semibold py-3 sm:py-2.5 rounded-[13px] text-[14px] sm:text-[13px] hover:bg-[var(--primary-color, #C5A880)] transition-colors mt-2 active:scale-[0.98] disabled:opacity-50">
                    Confirmer le RDV
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center text-center mt-4">
                <div className="w-14 h-14 bg-[#10b981]/10 rounded-[16px] flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-[#10b981]" strokeWidth={3} />
                </div>
                <h3 className="font-times font-bold text-[#10b981] text-[20px] mb-2">Rendez-vous confirmé !</h3>
                <p className="text-gray-500 text-[13px] mb-1 flex items-center gap-1.5 mx-auto w-max"><Calendar className="w-4 h-4"/> {selectedDate && formatShortDate(selectedDate)}</p>
                <p className="text-gray-500 text-[13px] mb-4 flex items-center gap-1.5 mx-auto w-max"><Clock className="w-4 h-4"/> {selectedTime}</p>
                <p className="text-[#1A1A1A] font-medium text-[13px] mb-8 text-center px-4">Service: {formData.service}</p>
                <button onClick={() => { setStep(1); setDirection(-1); reset(); }} className="text-[13px] font-semibold text-[var(--primary-color, #C5A880)] hover:text-[#1A1A1A] transition-colors">
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
