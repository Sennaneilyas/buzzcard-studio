export default function ConfiguredFields({ controls = [], register, errors }) {
  if (!controls.length) return null;

  return (
    <div className="space-y-5 rounded-none border border-gray-200 bg-white p-6 shadow-sm">
      {controls.map(control => {
        const error = errors?.[control.name];
        const sharedClass = `w-full border bg-gray-50 px-4 font-medium text-gray-900 outline-none focus:bg-white ${error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-gray-900"}`;
        return (
          <div key={control.name} className="relative">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-gray-500">{control.label}</label>
            {control.type === "textarea" ? (
              <textarea rows={control.rows || 3} placeholder={control.placeholder} className={`${sharedClass} resize-none p-4`} {...register(control.name)} />
            ) : (
              <input type={control.type || "text"} placeholder={control.placeholder} className={`${sharedClass} h-12`} {...register(control.name)} />
            )}
            {error && <p className="mt-1 text-[10px] font-medium text-red-500">{error.message}</p>}
          </div>
        );
      })}
    </div>
  );
}
