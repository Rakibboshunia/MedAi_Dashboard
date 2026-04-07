import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

export default function FilterDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Filter",
  icon = "material-symbols:filter-list-rounded",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="shadow cursor-pointer flex items-center gap-2 text-primary hover:text-white font-semibold px-4 py-2 rounded-lg bg-background-main hover:bg-primary transition border border-primary/30"
      >
        <Icon icon={icon} width="22" height="22" />
        {value || placeholder}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 min-w-[140px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                value === option.value ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



