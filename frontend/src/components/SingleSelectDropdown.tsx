import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SportCategory } from "@/lib/types";

type SingleSelectDropdownProps = {
  selectedValue?: string;
  onChange?: (value: string) => void;
  disabledValues?: string[];
  placeholder?: string;
  sportsData: SportCategory[];
  isLoading?: boolean;
};

export function SingleSelectDropdown({
  selectedValue = "",
  onChange,
  disabledValues = [],
  placeholder = "Select an athlete, team, or sport...",
  sportsData,
  isLoading = false,
}: SingleSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Update local state when prop changes
  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Find the selected item label
  const getSelectedLabel = () => {
    if (sportsData.length === 0) return placeholder;

    for (const group of sportsData) {
      const item = group.items.find((item) => item.value === value);
      if (item) return item.label;
    }
    return placeholder;
  };

  // Filter and limit data based on search query
  const getFilteredData = () => {
    if (!debouncedSearchQuery) {
      return sportsData.map((group) => {
        // Deduplicate items by label (b/c of duplicates in database)
        const uniqueItems = [];
        const seenLabels = new Set();

        for (const item of group.items) {
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
      });
    }

    const searchLower = debouncedSearchQuery.toLowerCase();
    return sportsData
      .map((group) => {
        // First filter by search term
        const matchedItems = group.items.filter((item) => item.label.toLowerCase().includes(searchLower));

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

  return (
    <div className="flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {getSelectedLabel()}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[400px] p-0" align="start" side="bottom" sideOffset={4}>
          <Command>
            <CommandInput placeholder={placeholder} value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No results found.</CommandEmpty>
              {isLoading ? (
                <div className="py-6 text-center text-sm">Loading options...</div>
              ) : (
                filteredData.map((group) => {
                  const displayCount = group.items.length;
                  const totalCount = group.totalCount;
                  const countDisplay = displayCount < totalCount ? `${displayCount} of ${totalCount}` : totalCount;

                  return (
                    <CommandGroup key={group.category} heading={`${group.category} (${countDisplay})`}>
                      {group.items.map((item) => {
                        const isDisabled = disabledValues.includes(item.value);

                        return (
                          <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue);
                              onChange?.(currentValue === value ? "" : currentValue);
                              setOpen(false);
                            }}
                            disabled={isDisabled}
                            className={cn(
                              value === item.value && "bg-accent font-medium",
                              isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <span>{item.label}</span>
                            <Check className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")} />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
