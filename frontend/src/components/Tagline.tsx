import { useEffect, useState } from "react";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { EntityType, SportCategory } from "@/hooks/useSportsData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type TaglineProps = {
  sportsData: SportCategory[];
  isLoading: boolean;
};

export type UserTagline = {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: number;
  entityName: string;
  sentiment: "LOVE" | "LOATHE";
  position: number;
  createdAt: string;
  updatedAt: string;
};

export function Tagline({ sportsData, isLoading }: TaglineProps) {
  const { session } = useAuth();
  const [editingTagline, setEditingTagline] = useState(false);
  const [selects, setSelects] = useState(["", "", "", ""]);
  const [tags, setTags] = useState<TagType[]>([null, null, null, null]);
  const [userTaglines, setUserTaglines] = useState<UserTagline[]>([]);
  const [combinedSportsData, setCombinedSportsData] = useState<SportCategory[]>([]);

  useEffect(() => {
    const fetchUserTaglines = async () => {
      if (!session?.access_token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/taglines`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch taglines");

        const data = await response.json();
        setUserTaglines(data);
      } catch (error) {
        console.error("Error fetching user taglines:", error);
        toast.error("Failed to load your taglines");
      }
    };

    if (!editingTagline) fetchUserTaglines();
  }, [session, editingTagline]);

  useEffect(() => {
    // Always start with a fresh copy of the original sportsData
    const newSportsData = JSON.parse(JSON.stringify(sportsData)) as SportCategory[];

    // Then add any entities from userTaglines that don't exist in sportsData
    userTaglines.forEach((tagline) => {
      let categoryIndex = -1;

      if (tagline.entityType === "ATHLETE") categoryIndex = 0;
      else if (tagline.entityType === "TEAM") categoryIndex = 1;
      else if (tagline.entityType === "SPORT") categoryIndex = 2;

      if (categoryIndex === -1 || !newSportsData[categoryIndex]) return;

      // Check if entity already exists
      const exists = newSportsData[categoryIndex].items.some(
        (item) => item.entityType === tagline.entityType && item.entityId === tagline.entityId
      );

      // If not, add it
      if (!exists) {
        newSportsData[categoryIndex].items.push({
          id: tagline.entityId,
          entityId: tagline.entityId,
          entityType: tagline.entityType,
          value: tagline.entityName,
          label: tagline.entityName,
        });
      }
    });

    // Sort each category alphabetically
    newSportsData.forEach((category) => {
      category.items.sort((a, b) => a.label.localeCompare(b.label));
    });

    setCombinedSportsData(newSportsData);

    // Only update selects and tags if we have userTaglines
    if (userTaglines.length > 0) {
      // Map taglines to items with values
      const taglineItems = userTaglines.map((item) => {
        let value = "";

        // Find the corresponding item in newSportsData
        for (const category of newSportsData) {
          const matchingItem = category.items.find(
            (sportItem) => sportItem.entityType === item.entityType && sportItem.entityId === item.entityId
          );

          if (matchingItem) {
            value = matchingItem.value;
            break;
          }
        }

        return {
          value,
          sentiment: item.sentiment,
          position: item.position,
        };
      });

      // Sort by position (0-3)
      taglineItems.sort((a, b) => a.position - b.position);

      // Create new arrays with the sorted values
      const newSelects = Array(4).fill("");
      const newTags = Array(4).fill(null);

      taglineItems.forEach((item, index) => {
        if (index < 4) {
          newSelects[index] = item.value;
          // Convert backend LOVE/LOATHE to frontend love/loathe
          newTags[index] = item.sentiment === "LOVE" ? "love" : "loathe";
        }
      });

      setSelects(newSelects);
      setTags(newTags as TagType[]);
    }
  }, [sportsData, userTaglines]);

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

  const handleSaveTagline = async () => {
    try {
      // Filter out empty selections and tags
      const validTaglines = selects
        .map((value, idx) => ({ value, sentiment: tags[idx], position: idx }))
        .filter((item) => item.value && item.sentiment);

      if (validTaglines.length < 4) return;

      // Map the frontend selections to the backend expected format
      const taglinesPayload = validTaglines.map((item) => {
        // Find the selected item in sportsData
        let entityType: EntityType | undefined;
        let entityId: number | undefined;

        // Search through all categories to find the matching item
        for (const category of combinedSportsData.length > 0 ? combinedSportsData : sportsData) {
          const foundItem = category.items.find((sportItem) => sportItem.value === item.value);
          if (foundItem) {
            entityType = foundItem.entityType;
            entityId = foundItem.entityId;
            break;
          }
        }

        if (!entityType || !entityId) {
          throw new Error(`Item not found: ${item.value}`);
        }

        return {
          entityType,
          entityId,
          // Convert frontend love/loathe to backend LOVE/LOATHE
          sentiment: item.sentiment === "love" ? "LOVE" : "LOATHE",
          position: item.position,
        };
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/taglines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ taglines: taglinesPayload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save tagline");
      }

      toast.success("Tagline saved successfully!");
      setEditingTagline(false);
    } catch (error) {
      console.error("Error saving tagline:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
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
                sportsData={combinedSportsData.length > 0 ? combinedSportsData : sportsData}
                isLoading={isLoading}
              />
            ))}
          </div>
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => setEditingTagline(false)}>
              Cancel
            </Button>
            <Button disabled={submitDisabled} onClick={handleSaveTagline}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center space-y-2 my-10">
            <p>
              Am I the only person in the world who{" "}
              {userTaglines
                .sort((a, b) => a.position - b.position)
                .map((tagline) => {
                  return (
                    <span key={tagline.id}>
                      {tagline.sentiment === "LOVE" && (
                        <span className="font-semibold text-green-600">loves {tagline.entityName}</span>
                      )}
                      {tagline.sentiment === "LOATHE" && (
                        <span className="font-semibold text-red-600">loathes {tagline.entityName}</span>
                      )}
                    </span>
                  );
                })
                // Add commas and "and" before the last item
                .map((el, idx, arr) => (
                  <span key={idx}>
                    {el}
                    {arr.length > 1 && idx < arr.length - 2 && ", "}
                    {arr.length > 1 && idx === arr.length - 2 && ", and "}
                  </span>
                ))}
              {userTaglines.length === 0 && <span className="text-muted-foreground">...</span>}
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
