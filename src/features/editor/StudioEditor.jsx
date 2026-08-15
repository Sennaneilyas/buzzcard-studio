import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Layout, Palette, User, Share2 } from "lucide-react";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import TemplateRegistry from "@/config/TemplateRegistry";

export default function StudioEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  // Zustand Store
  const profileData = useEditorStore((s) => s.profileData);
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const templateId = useEditorStore((s) => s.templateId);

  const handleInputChange = (field, value) => {
    setProfileData({ [field]: value });
  };

  const handleSocialChange = (network, value) => {
    setProfileData({ socials: { ...profileData.socials, [network]: value } });
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#e0e5ec] overflow-hidden font-sans">
      
      {/* ── LEFT PANE: Editor Controls ── */}
      <div className="w-full max-w-[400px] h-full bg-white shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-20 flex flex-col">
        
        {/* Editor Header */}
        <div className="h-16 border-b border-black/5 flex items-center justify-between px-6 shrink-0 bg-white">
          <button 
            onClick={() => navigate(`/profile/${slug}`)}
            className="flex items-center gap-2 text-navy/60 hover:text-navy text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Editor
          </button>
          <button className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-black transition-all active:scale-95">
            <Save className="w-4 h-4" />
            Publish
          </button>
        </div>

        {/* Editor Tabs */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-black/5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: "personal", icon: User, label: "Info" },
            { id: "theme", icon: Palette, label: "Theme" },
            { id: "socials", icon: Share2, label: "Links" },
            { id: "layout", icon: Layout, label: "Layout" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-mint/10 text-mint" : "text-navy/50 hover:bg-black/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "personal" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name || ""} 
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full h-11 rounded-xl bg-cloud border border-transparent px-4 text-navy focus:border-mint focus:bg-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-1.5">Professional Role</label>
                <input 
                  type="text" 
                  value={profileData.role || ""} 
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full h-11 rounded-xl bg-cloud border border-transparent px-4 text-navy focus:border-mint focus:bg-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea 
                  value={profileData.bio || ""} 
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-cloud border border-transparent p-4 text-navy focus:border-mint focus:bg-white focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "socials" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {["linkedin", "twitter", "instagram"].map((network) => (
                <div key={network}>
                  <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-1.5 capitalize">{network} URL</label>
                  <input 
                    type="url" 
                    value={profileData.socials?.[network] || ""} 
                    onChange={(e) => handleSocialChange(network, e.target.value)}
                    placeholder={`https://${network}.com/yourprofile`}
                    className="w-full h-11 rounded-xl bg-cloud border border-transparent px-4 text-navy focus:border-mint focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "theme" && (
            <div className="flex flex-col items-center justify-center h-40 opacity-50 text-sm font-medium">
              Theme settings coming soon
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANE: Live Template Preview ── */}
      <div className="flex-1 h-full relative overflow-hidden bg-cloud/50 flex flex-col items-center justify-center p-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mint/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="w-full max-w-[420px] h-[800px] max-h-[90dvh] bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.1),inset_0_0_0_8px_#f4f5f7] ring-1 ring-black/5 overflow-hidden relative z-10 flex flex-col scale-[0.85] 2xl:scale-100 origin-center transition-transform">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* The actual template rendered live */}
            <TemplateRegistry templateId={templateId} profileData={profileData} isEditMode={true} />
          </div>
        </div>
        
        <div className="absolute bottom-6 font-medium text-xs text-navy/40 tracking-wider uppercase flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          Live Preview
        </div>
      </div>

    </div>
  );
}
