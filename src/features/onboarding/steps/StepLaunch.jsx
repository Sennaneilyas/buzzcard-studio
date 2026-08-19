import { motion } from "framer-motion";
import { Sparkles, Mail, Phone, User, CheckCircle2, Share2 } from "lucide-react";
import { getTemplateById } from "@/config/templates";
import { SOCIAL_PLATFORMS } from "./StepSocials";

export default function StepLaunch({ data, selectedTemplateId }) {
  const templateName = selectedTemplateId 
    ? getTemplateById(selectedTemplateId)?.name 
    : "Unknown Template";
    
  const connectedSocials = Object.keys(data.socials || {}).filter(k => data.socials[k]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center p-4 font-sans space-y-6 mt-4">
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        
        {/* Card 1: Template */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full h-[360px] bg-white rounded-none p-8 flex flex-col items-center justify-between text-center shadow-sm border border-gray-200 transition-all hover:shadow-md"
        >
          <div className="w-14 h-14 bg-blue-50/50 rounded-none flex items-center justify-center border border-blue-100/50 shrink-0">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col items-center justify-center mt-2">
            <h3 className="text-base font-bold text-gray-900 leading-tight">{templateName}</h3>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Active Theme</p>
          </div>
          <div className="w-full h-[1px] bg-gray-100 my-2" />
          <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-none border border-blue-100/50">
            Design
          </div>
        </motion.div>

        {/* Card 2: Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="w-full h-[360px] bg-white rounded-none p-8 flex flex-col items-center justify-between text-center shadow-sm border border-gray-200 transition-all hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex flex-col items-center justify-center w-full min-w-0 mt-2">
            <h3 className="text-base font-bold text-gray-900 truncate leading-tight">{data.name || "No Name"}</h3>
            <p className="text-xs font-medium text-gray-500 truncate mt-1 uppercase tracking-wider">{data.role || "No Role Provided"}</p>
          </div>
          
          {(data.email || data.phone) && (
            <>
              <div className="w-full h-[1px] bg-gray-100 my-2" />
              <div className="flex items-center justify-center gap-3 w-full">
                {data.email && <Mail className="w-4 h-4 text-gray-400" />}
                {data.phone && <Phone className="w-4 h-4 text-gray-400" />}
              </div>
            </>
          )}
        </motion.div>

        {/* Card 3: Socials */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="w-full h-[360px] bg-white rounded-none p-8 flex flex-col items-center justify-between text-center shadow-sm border border-gray-200 transition-all hover:shadow-md"
        >
          <div className="w-14 h-14 bg-green-50/50 rounded-none flex items-center justify-center border border-green-100/50 shrink-0">
            <Share2 className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex flex-col items-center justify-center mt-2">
            <h3 className="text-base font-bold text-gray-900 leading-tight">{connectedSocials.length} Networks</h3>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Synchronized</p>
          </div>
          
          <div className="w-full h-[1px] bg-gray-100 my-2" />
          
          <div className="flex items-center justify-center flex-wrap gap-2 w-full">
            {connectedSocials.length > 0 ? (
              connectedSocials.slice(0, 4).map((key, i) => {
                const platformInfo = SOCIAL_PLATFORMS.find(p => p.id === key);
                const Icon = platformInfo?.icon;
                return Icon ? (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + (i * 0.1) }}
                    key={key} 
                    className="w-7 h-7 rounded-none bg-gray-50 border border-gray-200 flex items-center justify-center"
                  >
                    <Icon className={`w-3.5 h-3.5 ${platformInfo.colorClass}`} />
                  </motion.div>
                ) : null;
              })
            ) : (
              <div className="text-[11px] font-medium text-gray-400 italic">No links added</div>
            )}
            {connectedSocials.length > 4 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} className="w-7 h-7 rounded-none bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center border border-gray-200">
                +{connectedSocials.length - 4}
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
