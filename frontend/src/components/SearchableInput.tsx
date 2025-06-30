import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SportCategory } from "@/lib/types";

type SearchableInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sportsData: SportCategory[];
  isLoading?: boolean;
};

export function SearchableInput({
  value,
  onChange,
  placeholder = "Search for athletes or teams...",
  sportsData,
  isLoading = false,
}: SearchableInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState(value);

  // Update local state when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 100);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Filter and limit data based on search query
  const getFilteredData = () => {
    const searchLower = value.toLowerCase();

    return sportsData
      .map((group) => {
        // First filter by search term
        const matchedItems = searchLower
          ? group.items.filter((item) => item.label.toLowerCase().includes(searchLower))
          : group.items;

        // Then deduplicate the results
        const uniqueItems = [];
        const seenLabels = new Set();

        for (const item of matchedItems) {
          if (!seenLabels.has(item.label)) {
            seenLabels.add(item.label);
            uniqueItems.push(item);
          }
        }

        return {
          ...group,
          totalCount: uniqueItems.length,
          items: uniqueItems.slice(0, 10),
        };
      })
      .filter((group) => group.items.length > 0);
  };

  const filteredData = getFilteredData();

  const handleItemSelect = (itemValue: string) => {
    setLocalValue(itemValue);
    // The onChange will be called via the useEffect
    setIsFocused(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        dropdownRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-1 relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {isFocused && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-md border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="py-6 text-center text-sm">Loading options...</div>
            ) : filteredData.length === 0 ? (
              <div className="py-6 text-center text-sm">No results found.</div>
            ) : (
              filteredData.map((group) => {
                const displayCount = group.items.length;
                const totalCount = group.totalCount;
                const countDisplay = displayCount < totalCount ? `${displayCount} of ${totalCount}` : totalCount;

                return (
                  <div key={group.category} className="py-1">
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                      {group.category} ({countDisplay})
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item.value}
                        className="w-full px-2 py-1.5 text-sm text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={() => handleItemSelect(item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
