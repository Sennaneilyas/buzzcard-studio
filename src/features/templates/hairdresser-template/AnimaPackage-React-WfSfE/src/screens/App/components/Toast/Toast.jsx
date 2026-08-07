import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, { type = "info", duration = 3000 } = {}) => {
        const id = Date.now() + Math.random().toString(36).slice(2, 9);
        setToasts((t) => [...t, { id, message, type }]);
        setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex items-end justify-center px-4">
                <div className="w-full max-w-md space-y-2">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto rounded-lg px-4 py-3 shadow-lg transition transform duration-200 ease-out bg-white/95 border ${toast.type === "error" ? "border-red-300" : "border-slate-200"
                                }`}
                        >
                            <div className="text-sm text-slate-800">{toast.message}</div>
                        </div>
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx.addToast;
};

export default ToastProvider;
