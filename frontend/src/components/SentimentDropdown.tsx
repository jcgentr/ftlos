import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, getSentimentDisplay, getSentimentsByType, TAGLINE_SENTIMENTS } from "@/lib/utils";
import { TaglineSentiment } from "@/lib/types";

const getButtonStyles = (sentiment: TaglineSentiment | null) => {
  if (!sentiment) return "text-muted-foreground";

  const type = TAGLINE_SENTIMENTS[sentiment]?.type;

  if (type === "positive") {
    return "text-green-600 border-green-300 hover:bg-green-50";
  }

  if (type === "negative") {
    return "text-red-600 border-red-300 hover:bg-red-50";
  }

  return "";
};

type SentimentDropdownProps = {
  sentiment: TaglineSentiment | null;
  onChange: (sentiment: TaglineSentiment | null) => void;
};

export function SentimentDropdown({ sentiment, onChange }: SentimentDropdownProps) {
  const [open, setOpen] = useState(false);

  const positiveOptions = getSentimentsByType("positive");
  const negativeOptions = getSentimentsByType("negative");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[140px] justify-between", getButtonStyles(sentiment))}
        >
          {sentiment ? getSentimentDisplay(sentiment) : "Select..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No sentiment found.</CommandEmpty>
            <CommandGroup heading="Positive">
              {positiveOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(sentiment === option && "bg-accent font-medium", "text-green-600")}
                >
                  {getSentimentDisplay(option)}
                  <Check className={cn("ml-auto h-4 w-4", sentiment === option ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Negative">
              {negativeOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(sentiment === option && "bg-accent font-medium", "text-red-600")}
                >
                  {getSentimentDisplay(option)}
                  <Check className={cn("ml-auto h-4 w-4", sentiment === option ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
