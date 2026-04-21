import { useState } from "react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";

const categories: string[] = [
  "Tv-spel",
  "Sci-fi",
  "Serietidningar",
  "Cosplay",
  "Anime",
  "Manga",
  "Rollspel",
];

const CreateListingForm = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");

  function addCategory(category: string) {
    const trimmed = category.trim();
    if (!trimmed || customCategories.includes(trimmed)) return;

    setCustomCategories([...customCategories, trimmed]);
    setCategoryInput("");
  }

  function removeCategory(category: string) {
    setCustomCategories(customCategories.filter((c) => c !== category));
  }

  return (
    <div>
      <form action="">
        <div>
          <h3>TITEL</h3>
          <input type="text" />

          <h4>BESKRIVNING</h4>
          <input type="text" />

          <h4>TYP AV ANNONS</h4>

          <RadioGroup defaultValue="plus" className="max-w-50">
            <FieldLabel htmlFor="plus-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>EVENT</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="Event" id="Event" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="pro-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>BUTIK</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="Butik" id="Butik" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="enterprise-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>LOPPIS</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="Loppis" id="Loppis" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="enterprise-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>MÄSSA</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="Mässa" id="Mässa" />
              </Field>
            </FieldLabel>
          </RadioGroup>

          <h4>KATEGORI</h4>
          <div className="flex items-center gap-2">
            {categories.map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="relative gap-2 rounded-sm px-3 py-1.5 has-[input:checked]:bg-green-800 has-[input:checked]:text-white"
              >
                <Checkbox
                  id={label}
                  checked={selectedCategories.includes(label)}
                  onCheckedChange={(checked) =>
                    setSelectedCategories(
                      checked
                        ? [...selectedCategories, label]
                        : selectedCategories.filter((item) => item !== label),
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
          <h4>(VALFRITT) EGEN KATEGORI: </h4>

          {customCategories.map((category) => (
            <Badge key={category}>
              {category}
              <button onClick={() => removeCategory(category)}>X</button>
            </Badge>
          ))}
          <Input
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCategory(categoryInput);
              }

              if (e.key === "Backspace" && !categoryInput) {
                setCustomCategories(customCategories.slice(0, -1));
              }
            }}
          />

          <h4>BILDER</h4>
          <h4>(VALFRITT) DATUM</h4>
          <h4>TIDER</h4>
          <h4>PLATS</h4>
          <h4>(VALFRITT) HEMSIDA</h4>

          <button>SKAPA ANNONS</button>
        </div>
      </form>
    </div>
  );
};
export default CreateListingForm;

// title: string;
// description: string;
// type: listingType;
// category: {
//   predefinedCategory?: category[];
//   customCategory?: string[];
// };
// images: ImageUpload[];
// date?: Date;
// openingHours: OpeningHours[];
// location: { city: string; type: "Point"; coordinates: [number, number] };

// website?: string;
// host: User;
