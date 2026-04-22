import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";

// ARRAYS
const categories: string[] = [
  "Tv-spel",
  "Sci-fi",
  "Serietidningar",
  "Cosplay",
  "Anime",
  "Manga",
  "Rollspel",
];

const weekDays = [
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
  "Söndag",
  "Måndag - Fredag",
  "Lördag - Söndag",
];

// SCHEMAS
// CATEGORIES SCHEMA
const categoriesSchema = z.object({
  predefinedCategory: z.array(z.enum(categories)).optional(),
  customCategory: z.array(z.string()).optional(),
});

// OPENINGHOURS SCHEMA
const openingHoursSchema = z.object({
  day: z.string().min(1),
  times: z.object({
    start: z.union([z.string(), z.literal("STÄNGT")]),
    end: z.string().optional(),
  }),
});

// IMAGE UPLOAD SCHEMA
const imageSchema = z.object({
  url: z.string(),
  publicId: z.string().min(1),
  alt: z.string(),
});
const imagesSchema = z.array(imageSchema);

// LOCATIONSCHEMA
const locationSchema = z.object({
  city: z.string().min(1, "Stad krävs"),
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number(), // long
    z.number(), // lat
  ]),
});

// FORM SCHEMA
const formSchema = z.object({
  title: z.string().nonempty({ message: "Ange en titel" }),
  description: z.string().nonempty({ message: "Ange en beskrivning" }),
  type: z.enum(["Event", "Butik", "Mässa", "Loppis"]),
  category: categoriesSchema,
  images: imagesSchema,
  date: z.date().optional(),
  openingHours: z.array(openingHoursSchema).refine(
    (items) => {
      const days = items.map((i) => i.day);
      return new Set(days).size === days.length;
    },
    {
      message: "Vänligen välj en dag som inte redan är vald",
    },
  ),
  location: locationSchema,
  website: z.string().optional(),
});
type CreateListingInputs = z.infer<typeof formSchema>;

// CREATE LISTING FORM COMPONENT
const CreateListingForm = () => {
  // LOCATION - QUERY & RESULTS
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  // CATEGORIES - SELECTED & CUSTOM
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  // IMAGES - UPLOAD
  const [uploading, setUploading] = useState(false);

  // USEFORM
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateListingInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      category: {
        predefinedCategory: undefined,
        customCategory: undefined,
      },
      images: undefined,
      date: undefined,
      openingHours: [],
      location: {
        city: "",
        type: "Point",
        coordinates: [0, 0],
      },
      website: undefined,
    },
  });

  // CONSOLE LOG ERRORS
  const onError = (errors: any) => {
    console.log("ERRORS:", errors);
  };

  // USEEFFECT - LOCATION QUERY
  useEffect(() => {
    if (!query) return;

    const timeout = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      );
      const data = await res.json();
      setResults(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // CATEGORIES - ADD & REMOVE
  function addCategory(category: string) {
    const trimmed = category.trim();
    if (!trimmed || customCategories.includes(trimmed)) return;

    const updated = [...customCategories, trimmed];
    setCustomCategories(updated);
    setCategoryInput("");
    return updated; // ✔ viktigt
  }
  function removeCategory(category: string) {
    const updated = customCategories.filter((c) => c !== category);
    setCustomCategories(updated);
    return updated; // ✔ viktigt
  }

  // IMAGES - HANDLE & UPLOAD
  const imagesFieldArray = useFieldArray({
    control,
    name: "images",
  });

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) throw new Error("Upload failed");

    return res.json();

    // const data = await res.json();

    // return {
    //   url: data.secure_url,
    //   publicId: data.public_id,
    // };
  }

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const data = await uploadImage(file);

      imagesFieldArray.append({
        url: data.secure_url,
        publicId: data.public_id,
        alt: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // OPENING HOURS - HANDLE HOURS & DAYS
  const openingHoursFieldArray = useFieldArray({
    control,
    name: "openingHours",
  });

  const selectedDays = openingHoursFieldArray.fields.map((f) => f.day);

  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  // LOCATION - HANDLE
  function handleSelectLocation(r: GeoResult) {
    setValue("location.city", r.display_name);

    setValue("location.coordinates", [parseFloat(r.lon), parseFloat(r.lat)]);

    setResults([]);
    setQuery(r.display_name);
  }

  // ONSUBMIT
  const onSubmit = (data: CreateListingInputs) => {
    console.log(data);
    // if (
    //   !data.title ||
    //   !data.images ||
    //   !data.location ||
    //   !data.description ||
    //   !data.rules ||
    //   !data.dates ||
    //   !data.guests ||
    //   !data.rooms
    // ) {
    //   setFormMessage("Please fill in all required fields");
    //   console.log("Please fill in all required fields");
    //   return;
    // }
    // const allDatesInRange = getDatesInRange(data.dates.from, data.dates.to);
    // const newArray = allDatesInRange?.map((date) => {
    //   return format(date, "yyyy-MM-dd");
    // });
    // const dataToSubmit = { ...data, dates: newArray };
    // setLoading(true);
    // setFormMessage("");
    // try {
    //   const res = await axios.post("api/listings", dataToSubmit, {
    //     headers: {
    //       authorization: `Bearer ${token}`,
    //     },
    //   });
    //   if (res.status === 201) {
    //     actions.updateListings(res.data);
    //     setFormMessage("Castle listing succesfully created!");
    //     setIsSubmitted(true);
    //     setIsListingUpdated((isListingUpdated) => !isListingUpdated);
    //   }
    //   return;
    // } catch (error: any) {
    //   setFormMessage(error.response?.data?.message || "Something went wrong");
    //   console.log(error.response?.data?.message || "Something went wrong");
    // } finally {
    //   setLoading(false);
    //   return;
    // }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          {/* TITLE */}
          <h3>TITEL</h3>
          <input
            type="title"
            id="title"
            {...register("title", { required: true })}
          />
          {/* DESCRIPTION */}
          <h4>BESKRIVNING</h4>
          <input
            type="description"
            id="description"
            {...register("description", { required: true })}
          />

          {/* TYPE */}
          <h4>TYP AV ANNONS</h4>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value} onChange={field.onChange}>
                <FieldLabel htmlFor="event">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>EVENT</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="Event" id="Event" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="butik">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>BUTIK</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="Butik" id="Butik" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="loppis">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>LOPPIS</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="Loppis" id="Loppis" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="massa">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>MÄSSA</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="Mässa" id="Mässa" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            )}
          />

          {/* CATEGORY */}
          <h4>KATEGORI</h4>

          {/* PREDEFINED CATEGORY */}
          <Controller
            name="category.predefinedCategory"
            control={control}
            render={({ field: { onChange } }) => (
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
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...selectedCategories, label]
                          : selectedCategories.filter((item) => item !== label);

                        setSelectedCategories(updated);
                        onChange(updated); // ✔ rätt värde
                      }}
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
            )}
          />

          {/* CUSTOM CATEGORY */}
          <h4>(VALFRITT) EGEN KATEGORI: </h4>
          <Controller
            name="category.customCategory"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                {customCategories.map((category) => (
                  <Badge key={category}>
                    {category}
                    <button onClick={() => onChange(removeCategory(category))}>
                      X
                    </button>
                  </Badge>
                ))}
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const updated = addCategory(categoryInput);
                      if (updated) onChange(updated);
                    }
                  }}
                />
              </>
            )}
          />

          {/* IMAGES */}
          <h4>BILDER</h4>
          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(handleImageUpload);
            }}
          />
          {uploading && <p>Laddar upp bild...</p>}

          <div className="flex gap-4 flex-wrap mt-4">
            {imagesFieldArray.fields.map((img, index) => (
              <div key={img.id} className="relative">
                <img
                  src={img.url}
                  alt=""
                  className="w-32 h-32 object-cover rounded"
                />

                <button
                  type="button"
                  onClick={() => imagesFieldArray.remove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* DATE */}
          <h4>(VALFRITT) DATUM</h4>
          <Controller
            name="date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Calendar
                mode="single"
                captionLayout="dropdown"
                className="rounded-lg border"
                selected={value}
                onSelect={onChange}
              />
            )}
          />

          {/* OPENING HOURS */}
          <h4>TIDER</h4>
          <div className="space-y-4">
            {openingHoursFieldArray.fields.map((field, index) => {
              const startValue = watch(`openingHours.${index}.times.start`);
              const isClosed = startValue === "STÄNGT";

              return (
                <div key={field.id} className="flex gap-3 items-center">
                  {/* DAY */}
                  <select {...register(`openingHours.${index}.day` as const)}>
                    {weekDays.map((day) => (
                      <option
                        key={day}
                        value={day}
                        disabled={selectedDays.includes(day)}
                      >
                        {day}
                      </option>
                    ))}
                  </select>

                  {/* STÄNGT */}
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue(
                            `openingHours.${index}.times.start`,
                            "STÄNGT",
                          );
                          setValue(`openingHours.${index}.times.end`, "");
                        } else {
                          setValue(`openingHours.${index}.times.start`, "");
                        }
                      }}
                    />
                    STÄNGT
                  </label>

                  {/* START */}
                  <select
                    disabled={isClosed}
                    {...register(`openingHours.${index}.times.start` as const)}
                  >
                    <option value="">Start</option>
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  {/* END */}
                  <select
                    disabled={isClosed || !startValue}
                    {...register(`openingHours.${index}.times.end` as const)}
                  >
                    <option value="">Slut</option>
                    {hours
                      .filter((h) => {
                        if (!startValue || startValue === "STÄNGT")
                          return false;
                        return h > startValue;
                      })
                      .map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                  </select>

                  {/* TA BORT */}
                  <button
                    type="button"
                    onClick={() => openingHoursFieldArray.remove()}
                  >
                    - Ta bort öppettider
                  </button>
                </div>
              );
            })}

            {/* LÄGG TILL ÖPPETTIDER */}
            <button
              type="button"
              onClick={() =>
                openingHoursFieldArray.append({
                  day: "",
                  times: {
                    start: "",
                    end: "",
                  },
                })
              }
            >
              + Lägg till öppettid
            </button>
          </div>

          {/* LOCATION */}
          <h4>PLATS</h4>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök adress..."
          />

          {results.map((r) => (
            <div
              key={r.place_id}
              onClick={() => handleSelectLocation(r)}
              className="cursor-pointer"
            >
              {r.display_name}
            </div>
          ))}

          {/* WEBSITE */}
          <h4>(VALFRITT) LÄNK TILL HEMSIDA</h4>
          <input type="text" />

          {/* CREATE LISTING */}
          <button type="submit" className="cursor-pointer">
            SKAPA ANNONS
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateListingForm;
