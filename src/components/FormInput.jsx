export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black tracking-widest text-gray-400 uppercase px-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
      />
    </div>
  );
}



