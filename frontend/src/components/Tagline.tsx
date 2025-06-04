import { useState } from "react";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { SportCategory } from "@/hooks/useSportsData";

type TaglineProps = {
  sportsData: SportCategory[];
  isLoading: boolean;
};

export function Tagline({ sportsData, isLoading }: TaglineProps) {
  const [editingTagline, setEditingTagline] = useState(false);
  const [selects, setSelects] = useState(["", "", "", ""]);
  const [tags, setTags] = useState<TagType[]>([null, null, null, null]);

  const handleSelectChange = (index: number, value: string) => {
    setSelects((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleTagChange = (index: number, tag: TagType) => {
    setTags((prev) => {
      const next = [...prev];
      next[index] = tag;
      return next;
    });
  };

  const getDisabledValues = (currentIndex: number) => {
    return selects.filter((_, idx) => idx !== currentIndex && selects[idx]);
  };

  const getLabelForValue = (value: string) => {
    if (!value) return "";
    for (const group of sportsData) {
      const item = group.items.find((item) => item.value === value);
      if (item) return item.label;
    }
    return "";
  };

  const selectsLength = selects.filter(Boolean).length;
  const tagsLength = tags.filter(Boolean).length;
  const submitDisabled = selectsLength < 4 || tagsLength < 4;

  return (
    <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Tagline</h2>
      {editingTagline ? (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground mb-4">
            You must fill out all four rows, selecting an athlete, team, or sport and choosing either{" "}
            <span className="font-semibold text-green-600">love</span>{" "}
            <span role="img" aria-label="thumbs up">
              👍
            </span>{" "}
            or <span className="font-semibold text-red-600">loathe</span>{" "}
            <span role="img" aria-label="thumbs down">
              👎
            </span>{" "}
            for each.
          </p>
          <div className="ml-4 space-y-4">
            {[0, 1, 2, 3].map((idx) => (
              <TaglineRow
                key={idx}
                value={selects[idx]}
                onChange={(val) => handleSelectChange(idx, val)}
                tag={tags[idx]}
                onTagChange={(tag) => handleTagChange(idx, tag)}
                disabledValues={getDisabledValues(idx)}
                sportsData={sportsData}
                isLoading={isLoading}
              />
            ))}
          </div>
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => setEditingTagline(false)}>
              Cancel
            </Button>
            <Button disabled={submitDisabled} onClick={() => setEditingTagline(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center space-y-2 my-10">
            <p>
              Am I the only person in the world who{" "}
              {selects
                .map((value, idx) => {
                  if (!value) return null;
                  const tag = tags[idx];
                  if (!tag) return null;
                  const label = getLabelForValue(value);

                  return (
                    <span key={idx}>
                      {tag === "love" && <span className="font-semibold text-green-600">loves {label}</span>}
                      {tag === "loathe" && <span className="font-semibold text-red-600">loathes {label}</span>}
                    </span>
                  );
                })
                // Filter out nulls (where tag is not set)
                .filter(Boolean)
                // Add commas and "and" before the last item
                .map((el, idx, arr) => (
                  <span key={idx}>
                    {el}
                    {arr.length > 1 && idx < arr.length - 2 && ", "}
                    {arr.length > 1 && idx === arr.length - 2 && ", and "}
                  </span>
                ))}
              {(selectsLength === 0 || tagsLength === 0) && <span className="text-muted-foreground">...</span>}
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setEditingTagline(true)}>Edit Tagline</Button>
          </div>
        </>
      )}
    </div>
  );
}

type TagType = "love" | "loathe" | null;

interface TaglineRowProps {
  value: string;
  onChange: (value: string) => void;
  tag: TagType;
  onTagChange: (tag: TagType) => void;
  disabledValues: string[];
  sportsData: SportCategory[];
  isLoading: boolean;
}

function TaglineRow({ value, onChange, tag, onTagChange, disabledValues, sportsData, isLoading }: TaglineRowProps) {
  return (
    <div className="flex gap-2 items-center">
      {/* Thumbs Up */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => onTagChange(tag === "love" ? null : "love")}
              variant={tag === "love" ? "default" : "outline"}
              size="icon"
              className={`${
                tag === "love"
                  ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                  : "bg-green-100 hover:bg-green-200 border-green-300 text-green-600"
              }`}
              aria-label="Thumbs up"
            >
              <ThumbsUp className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Love!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Thumbs Down */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => onTagChange(tag === "loathe" ? null : "loathe")}
              variant={tag === "loathe" ? "default" : "outline"}
              size="icon"
              className={`${
                tag === "loathe"
                  ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                  : "bg-red-100 hover:bg-red-200 border-red-300 text-red-600"
              }`}
              aria-label="Thumbs down"
            >
              <ThumbsDown className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Loathe!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SingleSelectDropdown
        selectedValue={value}
        onChange={onChange}
        disabledValues={disabledValues}
        sportsData={sportsData}
        isLoading={isLoading}
      />
    </div>
  );
}
