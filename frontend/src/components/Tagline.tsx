import { useState } from "react";
import { SingleSelectDropdown, sportsOptions } from "./SingleSelectDropdown";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function Tagline() {
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
    for (const group of sportsOptions) {
      const item = group.items.find((item) => item.value === value);
      if (item) return item.label;
    }
    return "";
  };

  const loves = selects
    .map((value, idx) => (tags[idx] === "love" && value ? { value, label: getLabelForValue(value) } : null))
    .filter(Boolean) as { value: string; label: string }[];

  const loathes = selects
    .map((value, idx) => (tags[idx] === "loathe" && value ? { value, label: getLabelForValue(value) } : null))
    .filter(Boolean) as { value: string; label: string }[];

  const selectsLength = selects.filter(Boolean).length;
  const tagsLength = tags.filter(Boolean).length;
  const submitDisabled = selectsLength !== 4 || tagsLength !== 4;

  return (
    <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Tagline</h2>
      {editingTagline ? (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground mb-4">
            You must fill out all four rows, selecting a player or team and choosing either{" "}
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
            {loves.length > 0 ? (
              <p>
                <span className="font-bold text-primary text-lg">loves</span>{" "}
                <span className="font-bold text-lg">{loves.map((item) => item.label).join(", ")}</span>
              </p>
            ) : (
              <p>
                <span className="font-bold text-primary text-lg">loves</span>{" "}
                <span className="text-muted-foreground">No selections yet</span>
              </p>
            )}

            {loathes.length > 0 ? (
              <p>
                <span className="font-bold text-primary text-lg">loathes</span>{" "}
                <span className="font-bold text-lg">{loathes.map((item) => item.label).join(", ")}</span>
              </p>
            ) : (
              <p>
                <span className="font-bold text-primary text-lg">loathes</span>{" "}
                <span className="text-muted-foreground">No selections yet</span>
              </p>
            )}
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
}

function TaglineRow({ value, onChange, tag, onTagChange, disabledValues }: TaglineRowProps) {
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
      <SingleSelectDropdown selectedValue={value} onChange={onChange} disabledValues={disabledValues} />
    </div>
  );
}
