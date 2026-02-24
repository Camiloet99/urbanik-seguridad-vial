import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineSearch, MdClose } from "react-icons/md";

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Buscar...",
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Filtrar opciones según la búsqueda
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  // Obtener label del valor seleccionado
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  // Manejar clicks fuera del componente
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (e) => {
    if (!isOpen && e.key !== "Enter") return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div
        className={`group flex items-center gap-2 rounded-full border h-12 px-5 transition-all ${
          error
            ? "border-red-400/70 bg-red-500/5"
            : isOpen
              ? "border-[#6C4CFF]/50 bg-white/10"
              : "border-white/15 bg-white/5"
        } ${isOpen ? "ring-2 ring-[#6C4CFF]/20" : "hover:border-white/25 hover:bg-white/7.5"}`}
      >
        <MdOutlineSearch size={18} className="text-white/60 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? search : selectedLabel}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-invalid={error}
          className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/40 text-sm"
        />
        {value && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition text-white/60 hover:text-white"
          >
            <MdClose size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-2 w-full bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  className={`w-full text-left px-5 py-3 transition-colors text-sm font-medium cursor-pointer ${
                    highlightedIndex === index
                      ? "bg-[#6C4CFF]/20 text-white"
                      : value === option.value
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {value === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-[#6C4CFF]"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sin resultados */}
      <AnimatePresence>
        {isOpen && search && filteredOptions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 w-full bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-4 text-center text-white/50 text-sm pointer-events-none"
          >
            No se encontraron opciones para "{search}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
