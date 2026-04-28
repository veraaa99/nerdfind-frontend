import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";

import ImageKit from "imagekit-javascript";
import {
  categories,
  createListingSchema,
  weekDays,
  type CreateListingInputs,
} from "@/schemas/zod";
import { useListing } from "@/contexts/listingContext";
import { useNavigate } from "react-router";
import axios from "@/api/axios";

//  IMAGEKIT
const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
});

// CREATE LISTING FORM COMPONENT
const CreateListingForm = () => {
  const { actions } = useListing();
  const [listingFormError, setListingFormError] = useState<string>("");
  // const navigate = useNavigate();

  // LOCATION - QUERY & RESULTS
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  // CATEGORIES - SELECTED & CUSTOM
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  // IMAGES - PREVIEWS & UPLOAD
  const [localImages, setLocalImages] = useState<
    { file: File; preview: string }[]
  >([]);

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
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      category: {
        predefinedCategory: undefined,
        customCategory: undefined,
      },
      images: [],
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
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`,
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
    return updated;
  }
  function removeCategory(category: string) {
    const updated = customCategories.filter((c) => c !== category);
    setCustomCategories(updated);
    return updated;
  }

  // IMAGES - UPLOAD
  async function uploadImage(file: File) {
    const { data: auth } = await axios.get("/api/imagekit-auth");

    const result = await imagekit.upload({
      file,
      fileName: file.name,
      ...auth,
    });

    return {
      url: result.url,
      publicId: result.fileId,
      alt: result.name,
    };
  }

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
    setQuery(r.display_name.split(",").slice(0, 4).join(" - "));
  }

  // ONSUBMIT
  async function onSubmit(data: CreateListingInputs) {
    if (
      !data.title ||
      !data.description ||
      !data.type ||
      !data.category ||
      !localImages ||
      !data.openingHours ||
      !data.location
    ) {
      setListingFormError("Fyll i alla obligatoriska fält");
      return;
    }

    try {
      const imageFiles = localImages.map((img) => img.file);
      const uploadedImages = await Promise.all(
        imageFiles.map((file) => uploadImage(file)),
      );

      const createListingData = { ...data, images: uploadedImages };

      await actions.createListing(createListingData);
    } catch (error: any) {
      setListingFormError(
        error.response?.data?.message || "Något gick fel, försök igen.",
      );
      return;
    }

    setListingFormError("");
    // navigate("/", { replace: true });
    return;
  }

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
          {errors.title && <p>Vänligen fyll i en titel</p>}

          {/* DESCRIPTION */}
          <h4>BESKRIVNING</h4>
          <input
            type="description"
            id="description"
            {...register("description", { required: true })}
          />
          {errors.description && <p>Vänligen fyll i en beskrivning</p>}

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
          {errors.type && (
            <p>Vänligen välj vilken typ av annons du vill skapa</p>
          )}

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
          {errors.category && <p>Vänligen välj minst en kategori</p>}

          {/* IMAGES */}
          <h4>BILDER</h4>

          <Controller
            name="images"
            control={control}
            render={() => {
              return (
                <div>
                  {/* FILE INPUT */}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);

                      const mapped = files.map((file) => ({
                        file,
                        preview: URL.createObjectURL(file),
                      }));

                      setLocalImages((prev) => [...prev, ...mapped]);

                      e.target.value = "";
                    }}
                  />

                  {/* PREVIEW GRID */}
                  <div className="flex gap-4 flex-wrap mt-4">
                    {localImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.preview}
                          className="w-32 h-32 object-cover rounded"
                        />

                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() => {
                            URL.revokeObjectURL(img.preview);

                            setLocalImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />
          {errors.images && (
            <p>Vänligen lägg till minst en bild till din annons</p>
          )}

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
            {errors.openingHours && (
              <p>Vänligen välj minst en veckodag och dess öppningstider</p>
            )}

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
              {r.display_name.split(",").slice(0, 4).join(" - ")} —{" "}
              {r.address?.city ||
                r.address?.town ||
                r.address?.village ||
                r.address?.municipality}
            </div>
          ))}

          {errors.location && <p>Vänligen välj en adress</p>}

          {/* WEBSITE */}
          <h4>(VALFRITT) LÄNK TILL HEMSIDA</h4>
          <input type="website" id="website" {...register("website")} />

          <div>
            <p>{listingFormError}</p>
          </div>

          {/* CREATE LISTING */}
          <div>
            <button type="submit" className="cursor-pointer">
              SKAPA ANNONS
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreateListingForm;
