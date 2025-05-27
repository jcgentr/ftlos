import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Sample data of famous athletes and sports teams
export const sportsOptions = [
  {
    category: "Athletes",
    items: [
      { value: "lebron-james", label: "LeBron James" },
      { value: "serena-williams", label: "Serena Williams" },
      { value: "lionel-messi", label: "Lionel Messi" },
      { value: "simone-biles", label: "Simone Biles" },
      { value: "usain-bolt", label: "Usain Bolt" },
      { value: "michael-phelps", label: "Michael Phelps" },
      { value: "cristiano-ronaldo", label: "Cristiano Ronaldo" },
      { value: "tom-brady", label: "Tom Brady" },
    ],
  },
  {
    category: "Teams",
    items: [
      { value: "lakers", label: "Los Angeles Lakers" },
      { value: "real-madrid", label: "Real Madrid" },
      { value: "yankees", label: "New York Yankees" },
      { value: "manchester-united", label: "Manchester United" },
      { value: "patriots", label: "New England Patriots" },
      { value: "barcelona", label: "FC Barcelona" },
      { value: "warriors", label: "Golden State Warriors" },
      { value: "chiefs", label: "Kansas City Chiefs" },
    ],
  },
  {
    category: "Sports",
    items: [
      { value: "soccer", label: "Soccer" },
      { value: "american-football", label: "American Football" },
      { value: "tennis", label: "Tennis" },
      { value: "baseball", label: "Baseball" },
      { value: "basketball", label: "Basketball" },
      { value: "cricket", label: "Cricket" },
      { value: "golf", label: "Golf" },
      { value: "hockey", label: "Hockey" },
    ],
  },
];

type SingleSelectDropdownProps = {
  selectedValue?: string;
  onChange?: (value: string) => void;
  disabledValues?: string[];
  placeholder?: string;
};

export function SingleSelectDropdown({
  selectedValue = "",
  onChange,
  disabledValues = [],
  placeholder = "Select an athlete or team...",
}: SingleSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);

  // Update local state when prop changes
  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  // Find the selected item label
  const getSelectedLabel = () => {
    for (const group of sportsOptions) {
      const item = group.items.find((item) => item.value === value);
      if (item) return item.label;
    }
    return placeholder;
  };

  return (
    <div className="w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {getSelectedLabel()}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[400px] p-0" align="start" side="bottom" sideOffset={4}>
          <Command>
            <CommandInput placeholder="Search athletes and teams..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {sportsOptions.map((group) => (
                <CommandGroup key={group.category} heading={group.category}>
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
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
