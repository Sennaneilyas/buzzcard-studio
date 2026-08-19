import { User, Briefcase, Mail, Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepBasicInfo({ data, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-white text-sm text-gray-900 placeholder-gray-400 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors";
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
              name="name"
              value={data.name || ""}
              onChange={handleChange}
              placeholder="e.g. Vanessa Joe"
              className={inputClass}
            />
          </div>
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
              name="role"
              value={data.role || ""}
              onChange={handleChange}
              placeholder="e.g. Creative Director"
              className={inputClass}
            />
          </div>
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
              name="email"
              value={data.email || ""}
              onChange={handleChange}
              placeholder="hello@example.com"
              className={inputClass}
            />
          </div>
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
              name="phone"
              value={data.phone || ""}
              onChange={handleChange}
              placeholder="+212 6 00 00 00 00"
              className={inputClass}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className={labelClass}>Short Bio</label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
              <FileText className={iconClass} />
            </div>
            <textarea
              name="bio"
              value={data.bio || ""}
              onChange={handleChange}
              placeholder="Write a brief intro about yourself..."
              rows={4}
              className={cn(inputClass, "pl-11 resize-none")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
