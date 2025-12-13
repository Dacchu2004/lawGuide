import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

interface SearchableDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  align?: "left" | "right";
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  icon,
  className = "", // default empty
  align = "left",
  showChevron = true,
}: SearchableDropdownProps & {
  className?: string;
  align?: "left" | "right";
  showChevron?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch(""); // Reset search on close
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`relative ${className ? "inline-block w-auto" : "w-full"}`}
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center transition-all group ${
          className
            ? className
            : "w-full px-3 py-2 rounded-[6px] text-[14px] font-open-sans justify-between h-[41px] border border-[#DEE1E6] text-[#171A1F] bg-white shadow-sm focus:outline-none focus:border-[#2F8EFF] focus:ring-1 focus:ring-[#2F8EFF]"
        }`}
      >
        <div
          className={`flex items-center gap-2 ${
            className ? "" : "truncate pr-2"
          }`}
        >
          {icon && (
            <span
              className={className ? "" : "text-[#323743] opacity-70 scale-90"}
            >
              {icon}
            </span>
          )}
          <span className={value ? "text-inherit" : "text-gray-400"}>
            {value || placeholder}
          </span>
        </div>
        {showChevron && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } ${className ? "text-inherit opacity-80" : "text-[#171A1F]"}`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-[110%] ${
            align === "right" ? "right-0" : "left-0"
          } bg-white border border-[#DEE1E6] rounded-[8px] shadow-lg z-50 overflow-hidden flex flex-col max-h-[250px] animate-in fade-in zoom-in-95 duration-100 ${
            className ? "min-w-[150px] w-max" : "w-full"
          }`}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-[#F3F4F6] sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-[#F8F9FA] border border-transparent focus:bg-white focus:border-[#2F8EFF] focus:ring-1 focus:ring-[#2F8EFF] rounded-[4px] outline-none transition-all placeholder-gray-400 text-[#171A1F]"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors ${
                    value === option
                      ? "bg-[#EFF6FF] text-[#2F8EFF] font-medium"
                      : "text-[#323743] hover:bg-[#F3F4F6]"
                  }`}
                >
                  {option}
                  {value === option && <Check className="w-3.5 h-3.5" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-[12px] text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
