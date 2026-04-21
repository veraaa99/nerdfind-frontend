type listingType = "Event" | "Butik" | "Mässa" | "Loppis";
type category =
  | "Tv-spel"
  | "Sci-fi"
  | "Serietidningar"
  | "Cosplay"
  | "Anime"
  | "Manga"
  | "Rollspel";

type weekDay =
  | "Måndag"
  | "Tisdag"
  | "Onsdag"
  | "Torsdag"
  | "Fredag"
  | "Lördag"
  | "Söndag"
  | "Måndag - Fredag"
  | "Lördag - Söndag";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isHost: boolean;
  savedListings?: string[];
};

type ImageUpload = {
  url: string;
  publicId: string;
  alt: string;
};

type OpeningHours = {
  day: weekDay;
  times: {
    start: string | "STÄNGT";
    end?: string;
  };
};

type Listing = {
  _id: string;
  title: string;
  description: string;
  type: listingType;
  category: {
    predefinedCategory?: category[];
    customCategory?: string[];
  };
  images: ImageUpload[];
  date?: Date;
  openingHours: OpeningHours[];
  location: { city: string; type: "Point"; coordinates: [number, number] };

  website?: string;
  host: User;
};

type CreateListingInputs = {
  title: string;
  description: string;
  type: listingType;
  category: {
    predefinedCategory?: category[];
    customCategory?: string[];
  };
  images: ImageUpload[];
  date?: Date;
  openingHours: OpeningHours[];
  location: { city: string; type: "Point"; coordinates: [number, number] };

  website?: string;
  host: User;
};
