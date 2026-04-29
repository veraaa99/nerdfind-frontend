import z from "zod";

// ARRAYS
export const categories: string[] = [
  "Tv-spel",
  "Sci-fi",
  "Serietidningar",
  "Cosplay",
  "Anime",
  "Manga",
  "Rollspel",
];

export const weekDays = [
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

// REGISTER FORM SCHEMA
export const registerFormSchema = z
  .object({
    name: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().nonempty().min(10),
    confirmPassword: z.string(),
    isHost: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

export type RegisterUserInputs = z.infer<typeof registerFormSchema>;

// LOGIN FORM SCHEMA
export const loginFormSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});

export type LoginUserInputs = z.infer<typeof loginFormSchema>;

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

// IMAGE UPLOAD SCHEMA + IMAGEKIT
const imageSchema = z.object({
  url: z.string(),
  publicId: z.string().min(1),
  alt: z.string().optional(),
});

// LOCATIONSCHEMA
const locationSchema = z.object({
  address: z.string().min(1, "Adress krävs"),
  city: z.string().min(1, "Stad krävs"),
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number(), // long
    z.number(), // lat
  ]),
});

// CREATE LISTING SCHEMA
export const createListingSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  type: z.enum(["Event", "Butik", "Mässa", "Loppis"]),
  category: categoriesSchema,
  images: z.array(imageSchema),
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

export type CreateListingInputs = z.infer<typeof createListingSchema>;
