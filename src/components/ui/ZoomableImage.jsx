import { useState, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ZoomableImage({ src, alt, className, imageClassName }) {
  const [isOpen, setIsOpen] = useState(false);
  const layoutId = useId();

  return (
    <>
      <motion.div
        className={cn("cursor-pointer h-full w-full", className)}
        onClick={() => setIsOpen(true)}
      >
        <motion.img
          layoutId={layoutId}
          src={src}
          alt={alt || "Image"}
          className={cn("w-full h-full object-cover", imageClassName)}
          loading="lazy"
        />
      </motion.div>

      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
            >
              {/* Blurred ambient background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/70 hover:text-white transition-colors z-20 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>

              {/* Expanded Image */}
              <motion.img
                layoutId={layoutId}
                src={src}
                alt={alt || "Image"}
                className="relative z-10 w-full sm:w-auto sm:max-w-5xl h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
