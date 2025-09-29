import React, { useState } from "react";
import { useMap } from "../hooks/useMap";

const Sidebar: React.FC = () => {
  const { setOrigin, setDestination } = useMap();
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<"origin" | "destination" | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(
          query
        )}`,
        { headers: { "Accept-Language": "en" } }
      );

      if (!response.ok) throw new Error("Nominatim error");

      const data = await response.json();
      setSuggestions(data.map((item: any) => item.display_name));
    } catch (error) {
      console.error("Nominatim error", error);
      setSuggestions([]);
    }
  };

  const handleChange = (value: string, field: "origin" | "destination") => {
    if (field === "origin") setOriginInput(value);
    else setDestinationInput(value);

    setActiveField(field);
    fetchSuggestions(value);
  };

  const handleSelect = (value: string) => {
    if (activeField === "origin") {
      setOriginInput(value);
    } else if (activeField === "destination") {
      setDestinationInput(value);
    }

    setSuggestions([]);
    setActiveField(null);
  };
  
  const handleSetMarkers = () => {
    console.log("setMarkers function from sidebar called")
    if (originInput.trim()) setOrigin(originInput.trim());
    if (destinationInput.trim()) setDestination(destinationInput.trim());
  };

  return (
    <div className="w-80 bg-white shadow-lg p-4 rounded-2xl h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Route Planner</h2>

      {/* Origin Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Pickup Location</label>
        <input
          type="text"
          value={originInput}
          onChange={(e) => handleChange(e.target.value, "origin")}
          placeholder="Enter pickup location"
          className="w-full border rounded-lg px-3 py-2"
        />
        {activeField === "origin" && suggestions.length > 0 && (
          <ul className="border rounded-lg mt-1 bg-white max-h-40 overflow-y-auto z-50">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSelect(s)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destination Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Drop Location</label>
        <input
          type="text"
          value={destinationInput}
          onChange={(e) => handleChange(e.target.value, "destination")}
          placeholder="Enter drop location"
          className="w-full border rounded-lg px-3 py-2"
        />
        {activeField === "destination" && suggestions.length > 0 && (
          <ul className="border rounded-lg mt-1 bg-white max-h-40 overflow-y-auto z-50">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSelect(s)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleSetMarkers}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Set Markers
      </button>
    </div>
  );
};

export default Sidebar;
