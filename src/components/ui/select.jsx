"use client";

import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const springs = {
  fast: { type: "spring", duration: 0.08, bounce: 0 },
  moderate: { type: "spring", duration: 0.16, bounce: 0.15 },
};

const shape = {
  bg: "rounded-[20px]",
  item: "rounded-[20px]",
  input: "rounded-[20px]",
  focusRing: "rounded-[20px]",
  container: "rounded-[20px]",
};

function useProximityHover(containerRef) {
  const itemsRef = useRef(new Map());
  const [activeIndex, setActiveIndex] = useState(null);
  const [itemRects, setItemRects] = useState([]);
  const itemRectsRef = useRef([]);
  const sessionRef = useRef(0);
  const rafIdRef = useRef(null);

  const registerItem = useCallback((index, element) => {
    if (element) itemsRef.current.set(index, element);
    else itemsRef.current.delete(index);
  }, []);

  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const rects = [];
    itemsRef.current.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      rects[index] = {
        top: rect.top - containerRect.top + container.scrollTop - container.clientTop,
        height: rect.height,
        left: rect.left - containerRect.left + container.scrollLeft - container.clientLeft,
        width: rect.width,
      };
    });
    itemRectsRef.current = rects;
    setItemRects(rects);
  }, [containerRef]);

  const handleMouseMove = useCallback((e) => {
    const mouseY = e.clientY;
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      let closestIndex = null; let closestDistance = Infinity; let containingIndex = null;
      const rects = itemRectsRef.current;
      for (let index = 0; index < rects.length; index++) {
        const r = rects[index]; if (!r) continue;
        const itemStart = containerRect.top + container.clientTop + r.top - container.scrollTop;
        const itemEnd = itemStart + r.height;
        if (mouseY >= itemStart && mouseY <= itemEnd) containingIndex = index;
        const distance = Math.abs(mouseY - (itemStart + r.height / 2));
        if (distance < closestDistance) { closestDistance = distance; closestIndex = index; }
      }
      setActiveIndex(containingIndex ?? closestIndex);
    });
  }, [containerRef]);

  const handleMouseEnter = useCallback(() => { sessionRef.current += 1; }, []);
  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current !== null) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
    setActiveIndex(null);
  }, []);

  useEffect(() => { return () => { if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current); }; }, []);

  return {
    activeIndex, setActiveIndex, itemRects, sessionRef,
    handlers: { onMouseMove: handleMouseMove, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    registerItem, measureItems,
  };
}

const SelectContext = createContext(null);
function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select compound components must be inside <Select>");
  return ctx;
}

const SelectContentContext = createContext(null);

function Select({ children, value, defaultValue, onValueChange, disabled = false, name, required }) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const currentValue = value !== undefined ? value : internalValue;
  const triggerRef = useRef(null);
  const labelMap = useRef(new Map());
  const [, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const onChange = useCallback((v) => {
    if (value === undefined) setInternalValue(v);
    onValueChange?.(v);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [value, onValueChange]);

  return (
    <SelectContext.Provider value={{ value: currentValue, onChange, open, setOpen, disabled, triggerRef, labelMap }}>
      {children}
      {name && <input type="hidden" name={name} value={currentValue} required={required} />}
    </SelectContext.Provider>
  );
}
Select.displayName = "Select";

const triggerVariants = cva(
  ["group inline-flex items-center justify-between gap-2 outline-none cursor-pointer",
   "text-sm font-semibold h-11 px-4 min-w-[200px]", "transition-all duration-80",
   "disabled:opacity-50 disabled:pointer-events-none", "focus-visible:ring-2 focus-visible:ring-mint"],
  {
    variants: {
      variant: {
        bordered: "border-2 border-white/50 bg-[#e0e5ec] text-navy hover:bg-[#d8dee6] shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.8)]",
        borderless: "border-2 border-transparent bg-transparent text-navy hover:bg-black/5",
      },
    },
    defaultVariants: { variant: "bordered" },
  }
);

const SelectTrigger = forwardRef(
  ({ className, variant, icon: Icon, placeholder = "Select…", error, ...props }, ref) => {
    const { value, open, setOpen, disabled, triggerRef, labelMap } = useSelectContext();
    const label = value ? labelMap.current.get(value) ?? value : undefined;

    return (
      <div className="flex flex-col gap-1">
        <button
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="button" role="combobox" aria-expanded={open} aria-haspopup="listbox" disabled={disabled}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => { if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); setOpen(true); } }}
          aria-invalid={!!error || undefined}
          className={cn(triggerVariants({ variant }), shape.input, error && "border-red-500/50", className)}
          {...props}
        >
          <span className="flex items-center gap-2 min-w-0 flex-1">
            {Icon && <Icon size={18} strokeWidth={2} className="shrink-0 text-navy/60 transition-[color,stroke-width] duration-80 group-hover:text-navy group-hover:stroke-[2.5]" />}
            <span className="min-w-0 flex-1 text-left truncate">
              {label ?? <span className="text-navy/50">{placeholder}</span>}
            </span>
          </span>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-navy/60 transition-colors duration-80 group-hover:text-navy">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {error && <span className="text-[12px] text-red-500 pl-3">{error}</span>}
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = forwardRef(
  ({ className, children }, ref) => {
    const { open, setOpen, value, triggerRef } = useSelectContext();
    const containerRef = useRef(null);
    const [triggerRect, setTriggerRect] = useState(null);

    const { activeIndex, setActiveIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [checkedIndex, setCheckedIndex] = useState(undefined);

    useEffect(() => {
      if (open && triggerRef.current) setTriggerRect(triggerRef.current.getBoundingClientRect());
    }, [open, triggerRef]);

    useEffect(() => {
      if (!open || !triggerRect) return;
      let outer; let inner;
      outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          measureItems();
          const container = containerRef.current;
          if (container) {
            const items = Array.from(container.querySelectorAll("[data-proximity-index]"));
            const idx = items.findIndex((el) => el.getAttribute("data-value") === value);
            setCheckedIndex(idx !== -1 ? idx : undefined);
            containerRef.current?.focus({ preventScroll: true });
          }
        });
      });
      return () => { cancelAnimationFrame(outer); cancelAnimationFrame(inner); };
    }, [open, triggerRect, measureItems, value]);

    useEffect(() => {
      if (!open) return;
      const onKey = (e) => { if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); } };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, setOpen, triggerRef]);

    useEffect(() => {
      if (!open) return;
      const onPointer = (e) => {
        if (!containerRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", onPointer);
      return () => document.removeEventListener("mousedown", onPointer);
    }, [open, setOpen, triggerRef]);

    const handleKeyDown = useCallback((e) => {
      const items = Array.from(containerRef.current?.querySelectorAll('[role="option"]:not([data-disabled])') ?? []);
      const currentIdx = items.indexOf(e.target);
      if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        if (currentIdx === -1) { const checked = checkedIndex != null ? items[checkedIndex] : null; (checked ?? items[0])?.focus(); }
        else { const next = ["ArrowDown", "ArrowRight"].includes(e.key) ? (currentIdx + 1) % items.length : (currentIdx - 1 + items.length) % items.length; items[next]?.focus(); }
      } else if (e.key === "Home") { e.preventDefault(); items[0]?.focus(); }
      else if (e.key === "End") { e.preventDefault(); items[items.length - 1]?.focus(); }
    }, [checkedIndex]);

    if (!open) return <div hidden aria-hidden="true">{children}</div>;
    if (!triggerRect) return null;

    const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
    const checkedRect = checkedIndex != null ? itemRects[checkedIndex] : null;
    const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
    const isHoveringOther = activeIndex !== null && activeIndex !== checkedIndex;

    return createPortal(
      <SelectContentContext.Provider value={{ registerItem, activeIndex, checkedIndex }}>
        <div style={{ position: "fixed", top: triggerRect.bottom + 10, left: triggerRect.left, minWidth: triggerRect.width, zIndex: 9999 }}>
          <motion.div
            ref={(node) => {
              containerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            role="listbox" tabIndex={-1}
            onMouseEnter={() => { handlers.onMouseEnter(); setFocusedIndex(null); }}
            onMouseMove={handlers.onMouseMove}
            onMouseLeave={handlers.onMouseLeave}
            onFocus={(e) => {
              const indexAttr = e.target.closest("[data-proximity-index]")?.getAttribute("data-proximity-index");
              if (indexAttr != null) { const idx = Number(indexAttr); setActiveIndex(idx); setFocusedIndex(e.target.matches(":focus-visible") ? idx : null); }
            }}
            onBlur={(e) => { if (containerRef.current?.contains(e.relatedTarget)) return; setFocusedIndex(null); setActiveIndex(null); }}
            onKeyDown={handleKeyDown}
            className={cn(`relative flex flex-col gap-1 max-h-[300px] overflow-y-auto ${shape.container} bg-[#e0e5ec] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-2 border-white/50 p-2 select-none outline-none`, className)}
            initial={{ opacity: 0, y: -10, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            transition={springs.fast}
            style={{ transformOrigin: "top center" }}
          >
            <AnimatePresence>
              {checkedRect && (
                <motion.div className={`absolute ${shape.bg} bg-white/60 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5),_inset_-2px_-2px_5px_rgba(255,255,255,1)] pointer-events-none`} initial={false}
                  animate={{ top: checkedRect.top, left: checkedRect.left, width: checkedRect.width, height: checkedRect.height, opacity: isHoveringOther ? 0.8 : 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ ...springs.moderate, opacity: { duration: 0.08 } }} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeRect && (
                <motion.div key={sessionRef.current} className={`absolute ${shape.bg} bg-white/30 pointer-events-none`}
                  initial={{ opacity: 0, top: checkedRect?.top ?? activeRect.top, left: checkedRect?.left ?? activeRect.left, width: checkedRect?.width ?? activeRect.width, height: checkedRect?.height ?? activeRect.height }}
                  animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                  exit={{ opacity: 0, transition: { duration: 0.06 } }} transition={{ ...springs.fast, opacity: { duration: 0.08 } }} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {focusRect && (
                <motion.div className={`absolute ${shape.focusRing} pointer-events-none z-20 border-2 border-mint`} initial={false}
                  animate={{ left: focusRect.left - 2, top: focusRect.top - 2, width: focusRect.width + 4, height: focusRect.height + 4 }}
                  exit={{ opacity: 0, transition: { duration: 0.06 } }} transition={{ ...springs.fast, opacity: { duration: 0.08 } }} />
              )}
            </AnimatePresence>
            {children}
          </motion.div>
        </div>
      </SelectContentContext.Provider>,
      document.body
    );
  }
);
SelectContent.displayName = "SelectContent";

const SelectItem = forwardRef(
  ({ className, children, icon: Icon, value, index, disabled = false, ...props }, ref) => {
    const selectCtx = useSelectContext();
    const contentCtx = useContext(SelectContentContext);
    const internalRef = useRef(null);
    const hasMounted = useRef(false);

    useEffect(() => { hasMounted.current = true; }, []);
    useEffect(() => { if (typeof children === "string") selectCtx.labelMap.current.set(value, children); }, [value, children, selectCtx.labelMap]);
    useEffect(() => { contentCtx?.registerItem(index, internalRef.current); return () => contentCtx?.registerItem(index, null); }, [index, contentCtx]);

    const isActive = contentCtx?.activeIndex === index;
    const isChecked = selectCtx.value === value;
    const skipAnimation = !hasMounted.current;

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-proximity-index={index} data-value={value} data-disabled={disabled || undefined}
        role="option" aria-selected={isChecked} aria-label={typeof children === "string" ? children : undefined}
        tabIndex={isChecked ? 0 : index === (contentCtx?.checkedIndex ?? 0) ? 0 : -1}
        onClick={() => { if (!disabled) selectCtx.onChange(value); }}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); selectCtx.onChange(value); } }}
        className={cn(`relative z-10 flex items-center gap-3 ${shape.item} px-4 py-3 text-sm font-semibold cursor-pointer outline-none select-none`, "transition-[color] duration-80", isActive || isChecked ? "text-navy" : "text-navy/70", disabled && "opacity-50 pointer-events-none", className)}
        {...props}
      >
        {Icon && <Icon size={18} strokeWidth={isActive || isChecked ? 2.5 : 2} className="shrink-0 transition-[color,stroke-width] duration-80" />}
        <span className="flex-1 min-w-0 truncate">{children}</span>
        <AnimatePresence>
          {isChecked && (
            <motion.svg key="check" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-mint" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
              <motion.path d="M4 12L9 17L20 6" initial={{ pathLength: skipAnimation ? 1 : 0 }} animate={{ pathLength: 1, transition: { duration: 0.08, ease: "easeOut" } }} exit={{ pathLength: 0, transition: { duration: 0.04, ease: "easeIn" } }} />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

function SelectGroup({ children, className, ...props }) {
  return <div role="group" className={className} {...props}>{children}</div>;
}
SelectGroup.displayName = "SelectGroup";

const SelectLabel = forwardRef(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("px-4 py-2 text-[11px] text-navy/40 font-bold uppercase tracking-widest", className)} {...props} />
);
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = forwardRef(
  ({ className, ...props }, ref) => <div ref={ref} role="separator" className={cn("my-2 h-px bg-white/40 shadow-[0_1px_0_rgba(163,177,198,0.2)]", className)} {...props} />
);
SelectSeparator.displayName = "SelectSeparator";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator, triggerVariants };
