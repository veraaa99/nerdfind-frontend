import { useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { useNavigate, useSearchParams } from "react-router";
import { useListing } from "@/contexts/listingContext";

const types: string[] = ["Event", "Butik", "Mässa", "Loppis"];

const categories: string[] = [
  "Tv-spel",
  "Sci-fi",
  "Serietidningar",
  "Cosplay",
  "Anime",
  "Manga",
  "Rollspel",
];

const Searchbar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { listings } = useListing();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [textInput, setTextInput] = useState<string>();

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [uniqueLocation, setUniqueLocation] = useState<string[]>([]);

  if (listings) {
    listings.map((listing) => {
      if (uniqueLocation.indexOf(listing.location.city) === -1) {
        setUniqueLocation([...uniqueLocation, listing.location.city]);
      }
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextInput(value);
  };

  const handleSearch = () => {
    if (textInput && textInput.trim() !== "") {
      searchParams.append("searchString", textInput);
    }

    if (selectedType.length > 0) {
      selectedType.map((type) => {
        searchParams.append("type", type);
      });
    }

    if (selectedCategory.length > 0) {
      selectedCategory.map((category) => {
        searchParams.append("category", category);
      });
    }

    if (selectedLocation.length > 0) {
      selectedLocation.map((location) => {
        searchParams.append("location", location);
      });
    }

    if (searchParams.toString() == "") {
      navigate("/search/");
    } else {
      navigate(`/search/?${searchParams}`);
    }
  };

  return (
    <div className=" mx-auto p-5 md:w-2xl lg:w-xl">
      <input
        type="text"
        placeholder="Sök annons..."
        onChange={handleChange}
        value={textInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            buttonRef.current?.click();
          }
        }}
      />

      <h4 className="mt-2 mb-1">TYP AV ANNONS</h4>
      <div className="flex items-center gap-2 mb-5">
        {types.map((type) => (
          <Badge
            key={type}
            variant="secondary"
            className="bg-green-200 relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 has-[input:checked]:bg-green-800 has-[input:checked]:text-white"
          >
            <Checkbox
              id={type}
              checked={selectedType.includes(type)}
              onCheckedChange={(checked) =>
                setSelectedType(
                  checked
                    ? [...selectedType, type]
                    : selectedType.filter((item) => item !== type),
                )
              }
              className="hidden"
            />
            <label
              htmlFor={type}
              className="cursor-pointer select-none after:absolute after:inset-0 "
            >
              {type}
            </label>
          </Badge>
        ))}
      </div>

      <h4 className="mt-2 mb-1">KATEGORI</h4>
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {categories.map((label) => (
          <Badge
            key={label}
            variant="secondary"
            className="bg-green-200 relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 has-[input:checked]:bg-green-800 has-[input:checked]:text-white"
          >
            <Checkbox
              id={label}
              checked={selectedCategory.includes(label)}
              onCheckedChange={(checked) =>
                setSelectedCategory(
                  checked
                    ? [...selectedCategory, label]
                    : selectedCategory.filter((item) => item !== label),
                )
              }
              className="hidden"
            />
            <label
              htmlFor={label}
              className="cursor-pointer select-none after:absolute after:inset-0 "
            >
              {label}
            </label>
          </Badge>
        ))}
      </div>

      <h4 className="mt-2 mb-1">PLATS (STAD/ORT)</h4>
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {uniqueLocation.map((location) => (
          <Badge
            key={location}
            variant="secondary"
            className="bg-green-200 relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 has-[input:checked]:bg-green-800 has-[input:checked]:text-white"
          >
            <Checkbox
              id={location}
              checked={selectedLocation.includes(location)}
              onCheckedChange={(checked) =>
                setSelectedLocation(
                  checked
                    ? [...selectedLocation, location]
                    : selectedLocation.filter((item) => item !== location),
                )
              }
              className="hidden"
            />
            <label
              htmlFor={location}
              className="cursor-pointer select-none after:absolute after:inset-0 "
            >
              {location}
            </label>
          </Badge>
        ))}
      </div>

      <div className="mt-3">
        <button
          ref={buttonRef}
          className="p-2 px-5 rounded-md cursor-pointer border-2 border-emerald-500 w-full bg-green-800 text-white hover:bg-green-500/60 hover:border-emerald-700  transition duration-300 ease-in-out;"
          onClick={handleSearch}
        >
          SÖK
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
