import { User, Briefcase, Mail, Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export default function StepBasicInfo() {
  const { register, formState: { errors } } = useFormContext();

  const inputClass = "w-full pl-11 pr-4 py-3 bg-white text-sm text-gray-900 placeholder-gray-400 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors";
  const errorClass = "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-red-900 placeholder:text-red-300";
  const iconClass = "h-4 w-4 text-gray-400";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={iconClass} />
            </div>
            <input
              type="text"
              placeholder="e.g. Vanessa Joe"
              className={cn(inputClass, errors.name && errorClass)}
              {...register("name")}
            />
          </div>
          {errors.name && <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">{errors.name.message}</p>}
        </div>

        {/* Role / Job Title */}
        <div>
          <label className={labelClass}>Job Title or Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Briefcase className={iconClass} />
            </div>
            <input
              type="text"
              placeholder="e.g. Creative Director"
              className={cn(inputClass, errors.role && errorClass)}
              {...register("role")}
            />
          </div>
          {errors.role && <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">{errors.role.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Contact Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={iconClass} />
            </div>
            <input
              type="email"
              placeholder="hello@example.com"
              className={cn(inputClass, errors.email && errorClass)}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className={iconClass} />
            </div>
            <input
              type="tel"
              placeholder="+212 6 00 00 00 00"
              className={cn(inputClass, errors.phone && errorClass)}
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">{errors.phone.message}</p>}
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className={labelClass}>Short Bio</label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
              <FileText className={iconClass} />
            </div>
            <textarea
              placeholder="Write a brief intro about yourself..."
              rows={4}
              className={cn(inputClass, "pl-11 resize-none", errors.bio && errorClass)}
              {...register("bio")}
            />
          </div>
          {errors.bio && <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">{errors.bio.message}</p>}
        </div>
      </div>
    </div>
  );
}
