import { Rocket, CheckCircle2, User, Share2, Sparkles, Mail, Phone } from "lucide-react";
import { getTemplateById } from "@/config/templates";

export default function StepLaunch({ data, selectedTemplateId }) {
  const templateName = selectedTemplateId 
    ? getTemplateById(selectedTemplateId)?.name 
    : "Unknown Template";
    
  const socialsCount = Object.keys(data.socials || {}).filter(k => data.socials[k]).length;

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto space-y-4 pt-2">
      
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink/5 text-ink mb-2 border border-ink/10">
          <Rocket className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-navy mb-1">Ready to Launch!</h3>
        <p className="text-navy/60 text-xs">
          Review your details below before publishing.
        </p>
      </div>

      {/* Summary Card - Compact */}
      <div className="w-full bg-[#e0e5ec] rounded-2xl p-4 border border-white/60 shadow-sm text-left">
        
        {/* Profile Header */}
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-navy/5">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#e0e5ec] border border-white/60 shadow-sm flex items-center justify-center overflow-hidden">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-ink" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold text-navy truncate leading-tight">{data.name || "No Name Provided"}</h4>
            {data.role && <p className="text-xs font-medium text-navy/60 truncate">{data.role}</p>}
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-navy/70">
            <Sparkles className="w-3.5 h-3.5 text-ink shrink-0" />
            <span className="truncate flex-1">Template: <strong className="text-navy">{templateName}</strong></span>
          </div>

          {(data.email || data.phone) && (
             <div className="flex gap-2">
               {data.email && (
                 <div className="flex items-center gap-1.5 text-[11px] font-medium text-navy/70 bg-[#e0e5ec] border border-white/60 px-2 py-1 rounded-lg shadow-sm truncate max-w-[50%]">
                   <Mail className="w-3 h-3 text-ink shrink-0" />
                   <span className="truncate">{data.email}</span>
                 </div>
               )}
               {data.phone && (
                 <div className="flex items-center gap-1.5 text-[11px] font-medium text-navy/70 bg-[#e0e5ec] border border-white/60 px-2 py-1 rounded-lg shadow-sm truncate max-w-[50%]">
                   <Phone className="w-3 h-3 text-ink shrink-0" />
                   <span className="truncate">{data.phone}</span>
                 </div>
               )}
             </div>
          )}

          <div className="flex items-center gap-2 text-xs font-medium text-navy/70">
            <Share2 className="w-3.5 h-3.5 text-ink shrink-0" />
            <span className="truncate flex-1"><strong className="text-navy">{socialsCount}</strong> Social Links</span>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-ink pt-1">
        <CheckCircle2 className="w-4 h-4 text-ink" />
        All systems go.
      </div>
    </div>
  );
}
