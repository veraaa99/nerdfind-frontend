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
import { NavLink } from "react-router";
import axios from "@/api/axios";
import { cn } from "@/lib/utils";

//  IMAGEKIT
const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
});

// CREATE LISTING FORM COMPONENT
const CreateListingForm = () => {
  const { actions } = useListing();
  const [listingFormError, setListingFormError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
        address: "",
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

  const openingHours = watch("openingHours");

  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  // LOCATION - HANDLE
  function handleSelectLocation(r: GeoResult) {
    const city =
      r.address?.city ||
      r.address?.municipality ||
      r.address?.town ||
      r.address?.village;

    if (city) {
      setValue("location.city", city);
    } else {
      setValue("location.city", r.display_name.split(",").slice(4).join(" "));
    }

    setValue("location.address", r.display_name);
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

    setLoading(true);

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
    setLoading(false);
    setIsSubmitted(true);
    reset({
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
        address: "",
        city: "",
        type: "Point",
        coordinates: [0, 0],
      },
      website: undefined,
    });
    return;
  }

  return (
    <div>
      <form
        className="md:flex md:justify-center"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div
          className="flex flex-col w-full gap-2 md:w-170 
        "
        >
          {/* TITLE */}
          <h3>TITEL</h3>
          <input
            type="title"
            id="title"
            {...register("title", { required: true })}
          />
          {errors.title && <p>Vänligen fyll i en titel</p>}

          {/* DESCRIPTION */}
          <h3>BESKRIVNING</h3>
          <input
            className="mb-2"
            type="description"
            id="description"
            {...register("description", { required: true })}
          />
          {errors.description && <p>Vänligen fyll i en beskrivning</p>}

          {/* TYPE */}
          <h3>TYP AV ANNONS</h3>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="sm:w-100"
              >
                <FieldLabel htmlFor="event">
                  <Field
                    onClick={() => field.onChange("Event")}
                    orientation="horizontal"
                    className={cn(
                      "flex items-center justify-between border rounded-md p-3 cursor-pointer",
                      field.value === "Event"
                        ? "bg-green-800 border-emerald-500 text-white"
                        : "bg-green-200 border-emerald-500 text-black",
                    )}
                  >
                    <FieldContent>
                      <FieldTitle>EVENT</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value="Event"
                      id="Event"
                      className="hidden"
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="butik">
                  <Field
                    onClick={() => field.onChange("Butik")}
                    orientation="horizontal"
                    className={cn(
                      "flex items-center justify-between border rounded-md p-3 cursor-pointer",
                      field.value === "Butik"
                        ? "bg-green-800 border-emerald-500 text-white"
                        : "bg-green-200 border-emerald-500 text-black",
                    )}
                  >
                    <FieldContent>
                      <FieldTitle>BUTIK</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value="Butik"
                      id="Butik"
                      className="hidden"
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="loppis">
                  <Field
                    onClick={() => field.onChange("Loppis")}
                    orientation="horizontal"
                    className={cn(
                      "flex items-center justify-between border rounded-md p-3 cursor-pointer",
                      field.value === "Loppis"
                        ? "bg-green-800 border-emerald-500 text-white"
                        : "bg-green-200 border-emerald-500 text-black",
                    )}
                  >
                    <FieldContent>
                      <FieldTitle>LOPPIS</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value="Loppis"
                      id="Loppis"
                      className="hidden"
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="massa">
                  <Field
                    onClick={() => field.onChange("Mässa")}
                    orientation="horizontal"
                    className={cn(
                      "flex items-center justify-between border rounded-md p-3 cursor-pointer",
                      field.value === "Mässa"
                        ? "bg-green-800 border-emerald-500 text-white"
                        : "bg-green-200 border-emerald-500 text-black",
                    )}
                  >
                    <FieldContent>
                      <FieldTitle>MÄSSA</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value="Mässa"
                      id="Mässa"
                      className="hidden"
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            )}
          />
          {errors.type && (
            <p>Vänligen välj vilken typ av annons du vill skapa</p>
          )}

          {/* CATEGORY */}
          <h3 className="mt-2">KATEGORI</h3>

          {/* PREDEFINED CATEGORY */}
          <Controller
            name="category.predefinedCategory"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="bg-green-200 relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 has-[input:checked]:bg-green-800 has-[input:checked]:text-white"
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
          <h3 className="mt-2">(VALFRITT) EGEN KATEGORI: </h3>
          <Controller
            name="category.customCategory"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                {customCategories.map((category) => (
                  <Badge
                    key={category}
                    className="bg-green-200 relative gap-2 rounded-sm px-4 py-4 text-sm text-black sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 "
                  >
                    {category}
                    <button
                      className="cursor-pointer"
                      onClick={() => onChange(removeCategory(category))}
                    >
                      X
                    </button>
                  </Badge>
                ))}
                <Input
                  className="w-full mb-2 px-2 py-2 rounded-sm bg-[oklch(92.578%_0.08442_155.922/0.129)] text-[#a4f4cf] border border-[#a4f4cf81]"
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
          <h3 className="mt-2">BILDER</h3>

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
          <h3 className="mt-2">(VALFRITT) DATUM</h3>
          <Controller
            name="date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Calendar
                mode="single"
                captionLayout="dropdown"
                className="rounded-lg border border-emerald-500"
                selected={value}
                onSelect={onChange}
              />
            )}
          />

          {/* OPENING HOURS */}
          <h3 className="mt-2">TIDER</h3>
          <div className="flex flex-col gap-5 ">
            {openingHoursFieldArray.fields.map((field, index) => {
              const startValue = watch(`openingHours.${index}.times.start`);
              const isClosed = startValue === "STÄNGT";

              return (
                <div
                  key={field.id}
                  className="bg-[oklch(92.578%_0.08442_155.922/0.129)] text-[#a4f4cf] flex flex-col gap-3 items-start border rounded-sm  border-emerald-500 flex-wrap p-3 md:flex-row md:p-5 md:items-center"
                >
                  {/* DAY */}
                  <select
                    className="border rounded-sm cursor-pointer  border-emerald-500 p-3 w-full sm:w-130 md:w-50"
                    {...register(`openingHours.${index}.day` as const)}
                  >
                    {weekDays.map((day) => (
                      <option
                        key={day}
                        value={day}
                        disabled={openingHours?.some(
                          (h, i) => h?.day === day && i !== index,
                        )}
                        className="cursor-pointer text-emerald-600 bg-emerald-950 disabled:text-gray-600"
                      >
                        {day}
                      </option>
                    ))}
                  </select>

                  {/* STÄNGT */}
                  <label className="cursor-pointer flex gap-3 border rounded-sm border-emerald-500 items-center p-3 w-50 sm:w-90 md:w-30 md:p-4">
                    <input
                      type="checkbox"
                      className="cursor-pointer h-4 w-4 m-0 relative top-px accent-green-800 "
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
                    <span className="leading-none">STÄNGT</span>
                  </label>

                  {/* START */}
                  <select
                    className="cursor-pointer border rounded-sm border-emerald-500 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-default p-2 w-70 sm:w-90 md:w-30 md:p-3"
                    disabled={isClosed}
                    {...register(`openingHours.${index}.times.start` as const)}
                  >
                    <option value="">Start</option>
                    {hours.map((h) => (
                      <option
                        key={h}
                        value={h}
                        className="cursor-pointer text-emerald-600 bg-emerald-950 disabled:text-gray-300"
                      >
                        {h}
                      </option>
                    ))}
                  </select>

                  {/* END */}
                  <select
                    className="cursor-pointer border rounded-sm p-2 border-emerald-500 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-default w-70 sm:w-90 md:w-30 md:p-3"
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
                        <option
                          key={h}
                          value={h}
                          className="cursor-pointer text-emerald-600 bg-emerald-950 disabled:text-gray-300"
                        >
                          {h}
                        </option>
                      ))}
                  </select>

                  {/* TA BORT */}
                  <button
                    className="cursor-pointer rounded-md  p-3 w-50 sm:w-70 md:w-50 border-2 border-red-900  bg-red-500/60 hover:bg-red-500/90 text-white transition duration-300 ease-in-out;"
                    type="button"
                    onClick={() => openingHoursFieldArray.remove(index)}
                  >
                    — Ta bort öppettider
                  </button>
                </div>
              );
            })}
            {errors.openingHours && (
              <p>Vänligen välj minst en veckodag och dess öppningstider</p>
            )}

            {/* LÄGG TILL ÖPPETTIDER */}
            <button
              className="cursor-pointer relative gap-2 rounded-sm border border-green-300 px-4 py-4 
               sm:px-3 sm:py-4 md:px-4 md:py-3.5 bg-emerald-600 text-white hover:bg-emerald-400 hover:text-black duration-300"
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
          <h3 className="mt-2">PLATS</h3>
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
          <h3 className="mt-2">(VALFRITT) LÄNK TILL HEMSIDA</h3>
          <input type="website" id="website" {...register("website")} />

          <div>
            <p>{listingFormError}</p>
          </div>

          {/* CREATE LISTING */}
          <div>
            <button
              type="submit"
              className="mt-7 p-2 px-5 rounded-md cursor-pointer border-2 border-emerald-500 w-full bg-green-800 text-white hover:bg-green-500/60 hover:border-emerald-700  transition duration-300 ease-in-out;"
              disabled={loading || isSubmitted}
            >
              {loading
                ? "SKAPAR ANNONS..."
                : isSubmitted
                  ? "ANNONS SKAPAD!"
                  : "SKAPA ANNONS"}
            </button>
          </div>

          <div>
            {isSubmitted && (
              <>
                <p>Annonsen har skapats!</p>
                <div>
                  <NavLink
                    className="mt-7 p-2 px-5 rounded-md cursor-pointer border-2 border-emerald-500 w-full bg-green-800 text-white hover:bg-green-500/60 hover:border-emerald-700  transition duration-300 ease-in-out;"
                    to="/profile"
                  >
                    {" "}
                    TILL DINA ANNONSER{" "}
                  </NavLink>
                  <NavLink
                    className="mt-7 p-2 px-5 rounded-md cursor-pointer border-2 border-emerald-500 w-full bg-green-800 text-white hover:bg-green-500/60 hover:border-emerald-700  transition duration-300 ease-in-out;"
                    to="/"
                  >
                    {" "}
                    TILLBAKA TILL START
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreateListingForm;
