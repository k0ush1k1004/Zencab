import React, { useEffect, useRef, useState } from "react";

type AutocompleteInputProps = {
  id: string;
  placeholder: string;
  onSelect: (place: google.maps.places.PlaceResult) => void;
};

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  id,
  placeholder,
  onSelect,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      setValue(target.value);
    };

    const handlePlaceChange = () => {
      const place = node.getPlace?.();
      if (place) {
        setValue(place.formatted_address || "");
        onSelect(place);
      }
    };

    node.addEventListener("input", handleInput);
    node.addEventListener("gmpx-placechange", handlePlaceChange);

    return () => {
      node.removeEventListener("input", handleInput);
      node.removeEventListener("gmpx-placechange", handlePlaceChange);
    };
  }, [onSelect]);

  return (
    <div className="relative">
      <gmpx-place-autocomplete
        ref={ref}
        id={id}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 14px 12px 38px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "15px",
          backgroundColor: "#fff",
          outline: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        {...({ value } as Record<string, unknown>)}
      />
      {/* Add circle indicators like Uber */}
      <span
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
          id === "pickup" ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
    </div>
  );
};

export default AutocompleteInput;
