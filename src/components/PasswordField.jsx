const PasswordField = ({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  showStrength = false,
}) => (
  
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
      {label}
    </label>

    <div className="relative group">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-gray-700 font-bold pr-12"
        value={value}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
      >
        <Icon
          icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
          width="18"
        />
      </button>
    </div>

    {showStrength && value && (
      <div className="flex gap-1 px-1 pt-1">
        {[1, 2, 3].map((lvl) => (
          <div
            key={lvl}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              strength >= lvl
                ? strength === 1
                  ? "bg-red-400"
                  : strength === 2
                  ? "bg-orange-400"
                  : "bg-green-400"
                : "bg-gray-100"
            }`}
          />
        ))}
      </div>
    )}
  </div>
);
