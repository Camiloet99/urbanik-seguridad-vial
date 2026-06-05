export default function Input({
  iconLeft,
  rightAdornment,
  size = "lg",
  error = "",
  helperText = "",
  className = "",
  id,
  ...props
}) {
  const sizeClasses =
    size === "lg" ? "h-12 px-5 text-[15px]" : "h-11 px-4 text-sm";
  const borderClasses = error
    ? "border-red-400/70 focus-within:border-red-400 bg-red-500/5"
    : "border-[#1D4789]/30 focus-within:border-[#1D4789] bg-white focus-within:bg-white";

  const describedBy =
    helperText || error ? `${id || props.name}-desc` : undefined;

  return (
    <label className={`block ${className}`}>
      <div
        className={[
          "group flex items-center gap-2 rounded-full border transition-colors",
          sizeClasses,
          borderClasses,
        ].join(" ")}
      >
        {iconLeft && (
          <span
            className={`shrink-0 ${error ? "text-red-400" : "text-[#1D4789]"}`}
          >
            {iconLeft}
          </span>
        )}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="peer min-w-0 flex-1 bg-transparent text-[#1a1a1a] placeholder:text-[#1a1a1a] outline-none"
          {...props}
        />
        {rightAdornment && (
          <span
            className={`shrink-0 ${error ? "text-red-400" : "text-[#1a1a1a]"}`}
          >
            {rightAdornment}
          </span>
        )}
      </div>

      {(error || helperText) && (
        <p
          id={describedBy}
          className={`mt-2 text-xs ${error ? "text-red-500" : "text-[#1a1a1a]"}`}
        >
          {error || helperText}
        </p>
      )}
    </label>
  );
}
