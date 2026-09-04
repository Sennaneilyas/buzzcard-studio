import { motion, AnimatePresence } from "framer-motion";
import { X, Download, User, Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  pending: { label: "PENDING", className: "bg-amber-100 text-amber-900" },
  paid: { label: "PAID", className: "bg-emerald-100 text-emerald-900" },
  shipped: { label: "SHIPPED", className: "bg-blue-100 text-blue-900" },
  cancelled: { label: "CANCELLED", className: "bg-red-100 text-red-900" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-black tracking-widest uppercase ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-3xl bg-white shadow-2xl overflow-hidden my-auto border border-ink/20"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 sm:p-8 bg-ink text-white">
            <div>
              <p className="text-[10px] text-white/50 font-mono tracking-[0.2em] mb-2 uppercase">Order Manifest</p>
              <h2 className="text-3xl font-black tracking-tight leading-none">
                {order.id.split("-").join("").toUpperCase()}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="grid place-items-center w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto bg-[#fafafa]">
            {/* Top Grid: Meta & Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border border-ink/10 mb-8">
              {/* Meta */}
              <div className="bg-white p-6 space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-1">Status</p>
                  <StatusBadge status={order.status} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-1">Date</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Calendar className="w-4 h-4 text-ink/40" />
                    {new Date(order.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-ink tracking-tight">
                    {Number(order.total_amount).toLocaleString("fr-MA")} <span className="text-sm text-ink/50 font-bold tracking-normal">MAD</span>
                  </p>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-white p-6 space-y-5">
                <div>
                   <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-1">Customer</p>
                   <p className="text-lg font-black text-ink">{order.customer_name || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-1">Email</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <Mail className="w-4 h-4 text-ink/40" />
                    {order.customer_email || "—"}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mb-1">Phone</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <Phone className="w-4 h-4 text-ink/40" />
                    {order.customer_phone || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-ink/20 flex-1" />
                <h3 className="text-xs font-black text-ink tracking-widest uppercase">Order Contents</h3>
                <div className="h-px bg-ink/20 flex-1" />
              </div>
              
              <div className="space-y-6">
                {order.order_items?.map((item, index) => (
                  <div key={item.id} className="bg-white border border-ink/10 shadow-sm relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-navy" />
                    {/* Item Header */}
                    <div className="flex items-start justify-between p-5 border-b border-ink/5 bg-[#fafafa]">
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-ink/40">0{index + 1}</span>
                           <h4 className="font-black text-ink text-base uppercase tracking-tight">
                             {item.product_name}
                           </h4>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-1.5 ml-6">
                           <span className="text-xs font-bold text-ink/60 bg-ink/5 px-2 py-0.5">QTY: {item.quantity}</span>
                           {item.variant_name && (
                             <span className="text-xs font-bold text-ink/60 bg-ink/5 px-2 py-0.5">VAR: {item.variant_name.toUpperCase()}</span>
                           )}
                        </div>
                      </div>
                      <p className="font-black text-ink text-lg tracking-tight">
                        {Number(item.unit_price * item.quantity).toLocaleString("fr-MA")} <span className="text-xs text-ink/50">MAD</span>
                      </p>
                    </div>

                    {/* Customization Details */}
                    {(item.customization || item.configuration) && (
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Text Data */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-ink uppercase tracking-[0.2em] mb-4 pb-2 border-b border-ink/10">
                            Client Specifications
                          </p>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                            {item.customization?.designType && (
                              <div className="col-span-2">
                                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-wider mb-0.5">Design Type</p>
                                <p className="text-sm font-bold text-ink uppercase tracking-tight">{item.customization.designType}</p>
                              </div>
                            )}
                            {item.customization?.displayName && (
                              <div className="col-span-2">
                                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-wider mb-0.5">Display Name</p>
                                <p className="text-sm font-bold text-ink">{item.customization.displayName}</p>
                              </div>
                            )}
                            {item.customization?.businessName && (
                              <div>
                                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-wider mb-0.5">Business Name</p>
                                <p className="text-sm font-bold text-ink">{item.customization.businessName}</p>
                              </div>
                            )}
                            {item.customization?.profession && (
                              <div>
                                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-wider mb-0.5">Profession</p>
                                <p className="text-sm font-bold text-ink">{item.customization.profession}</p>
                              </div>
                            )}
                            {item.configuration && Object.entries(item.configuration).map(([key, val]) => (
                              <div key={key} className="col-span-2">
                                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-wider mb-0.5">{key}</p>
                                <p className="text-sm font-medium text-ink break-all border-l-2 border-navy pl-2 bg-cloud/50 py-1">{val}</p>
                              </div>
                            ))}
                          </div>

                          {item.customization?.designNotes && (
                            <div className="pt-2">
                              <p className="text-[10px] text-ink/40 font-bold uppercase tracking-wider mb-1">Production Notes</p>
                              <p className="text-xs font-medium text-ink/80 leading-relaxed bg-[#f4f5f7] p-3 border border-ink/10">
                                {item.customization.designNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Logo / Asset */}
                        <div className="flex flex-col">
                           <p className="text-[10px] font-black text-ink uppercase tracking-[0.2em] mb-4 pb-2 border-b border-ink/10">
                            Attached Media
                          </p>
                          {item.customization?.logoUrl ? (
                            <div className="flex-1 bg-[#f4f5f7] border border-ink/10 flex flex-col items-center justify-center p-6">
                              <img 
                                src={item.customization.logoUrl} 
                                alt="Client Asset" 
                                className="max-w-full max-h-[160px] object-contain mb-6 drop-shadow-sm"
                              />
                              <button 
                                onClick={() => handleDownload(item.customization.logoUrl)}
                                className="w-full flex items-center justify-between py-3 px-4 bg-ink text-white text-xs font-black uppercase tracking-wider hover:bg-navy transition-colors"
                              >
                                <span>Get Asset File</span>
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center bg-[#f4f5f7] border border-ink/5 border-dashed p-6">
                              <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest text-center">No media attached</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {(!order.order_items || order.order_items.length === 0) && (
                  <div className="py-12 bg-white border border-ink/10 text-center">
                    <p className="text-xs font-bold text-ink/40 uppercase tracking-widest">No Line Items Found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer actions */}
          <div className="bg-ink p-4 sm:px-8 flex justify-between items-center">
             <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Studio / Fulfillment</p>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-white/70 transition-colors"
            >
              <span>Close Manifest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}