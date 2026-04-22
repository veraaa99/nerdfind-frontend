import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";

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
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateListingInputs>({
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      category: {
        predefinedCategory: [],
        customCategory: [],
      },
      images: [],
      openingHours: [],
      location: {},
    },
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");

  function addCategory(category: string) {
    const trimmed = category.trim();
    if (!trimmed || customCategories.includes(trimmed)) return;

    setCustomCategories([...customCategories, trimmed]);
    setCategoryInput("");
    return customCategories;
  }

  function removeCategory(category: string) {
    setCustomCategories(customCategories.filter((c) => c !== category));
    return customCategories;
  }

  const onSubmit: SubmitHandler<CreateListingInputs> = async (
    data: CreateListingInputs,
  ) => {
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
      <form
        action=""
        onSubmit={handleSubmit(async (data) => await onSubmit(data))}
      >
        <div>
          <h3>TITEL</h3>
          <input
            type="title"
            id="title"
            {...register("title", { required: true })}
          />

          <h4>BESKRIVNING</h4>
          <input
            type="description"
            id="description"
            {...register("description", { required: true })}
          />

          <h4>TYP AV ANNONS</h4>

          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                defaultValue="plus"
                className="max-w-50"
                onChange={onChange}
                value={value}
              >
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
            )}
          />

          <h4>KATEGORI</h4>

          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
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
                        (setSelectedCategories(
                          checked
                            ? [...selectedCategories, label]
                            : selectedCategories.filter(
                                (item) => item !== label,
                              ),
                        ),
                          onChange(selectedCategories));
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

          <h4>(VALFRITT) EGEN KATEGORI: </h4>
          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
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
                      onChange(addCategory(categoryInput));
                    }

                    if (e.key === "Backspace" && !categoryInput) {
                      setCustomCategories(customCategories.slice(0, -1));
                      onChange(customCategories);
                    }
                  }}
                />
              </>
            )}
          />

          <h4>BILDER</h4>

          <h4>(VALFRITT) DATUM</h4>
          <Controller
            name="date"
            control={control}
            rules={{ required: true }}
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
          <h4>TIDER</h4>

          <h4>PLATS</h4>

          <h4>(VALFRITT) LÄNK TILL HEMSIDA</h4>
          <input type="text" />

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
