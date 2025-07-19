import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEBOUNCE_DELAY = 300; // 300ms delay

interface Suggestion {
  placePrediction?: {
    text?: {
      text: string;
    };
  };
}

interface PlacesAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function PlacesAutocomplete({ value = "", onChange }: PlacesAutocompleteProps) {
  const [input, setInput] = useState(value);
  const [predictions, setPredictions] = useState<string[]>([]);
  const debounceTimerRef = useRef<number | null>(null);

  // Sync with external value
  useEffect(() => {
    setInput(value);
  }, [value]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchPredictions = async (searchText: string) => {
    if (!searchText) {
      setPredictions([]);
      return;
    }

    try {
      const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        },
        body: JSON.stringify({
          input: searchText,
          includedPrimaryTypes: "locality",
        }),
      });

      const data = await response.json();

      // Extract just the text strings from the predictions
      const textPredictions = (data.suggestions || [])
        .filter((suggestion: Suggestion) => suggestion.placePrediction?.text?.text)
        .map((suggestion: Suggestion) => suggestion.placePrediction!.text!.text);

      setPredictions(textPredictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictions([]);
    }
  };

  const debouncedFetchPredictions = (searchText: string) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = window.setTimeout(() => {
      fetchPredictions(searchText);
    }, DEBOUNCE_DELAY);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    debouncedFetchPredictions(newValue);
    onChange?.(newValue);
  };

  const handleSelectPlace = (text: string) => {
    setInput(text);
    setPredictions([]);
    onChange?.(text);
  };

  return (
    <div className="relative">
      <Label className="mb-2" htmlFor="location">
        Location
      </Label>
      <Input id="location" type="text" value={input} onChange={handleInputChange} placeholder="Enter your location" />

      {predictions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((text, index) => (
            <li key={index} onClick={() => handleSelectPlace(text)} className="p-2 hover:bg-gray-100 cursor-pointer">
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
