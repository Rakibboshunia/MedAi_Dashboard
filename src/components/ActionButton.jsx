export default function ActionButton({
  label = "Add",
  onClick,
  buttonRef,
  className = "",
}) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`
        px-4 py-2
        bg-primary
        text-white
        rounded-lg
        font-semibold
        whitespace-nowrap
        transition
        hover:opacity-90
        ${className}
      `}
    >
      {label}
    </button>
  );
}


