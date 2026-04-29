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

type GeoResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
};

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
  alt?: string;
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
  location: {
    // address: string;
    // TODO: FIX ADRESS AND CITY SEPARATELY
    address: string;
    city: string;
    type: "Point";
    coordinates: [number, number];
  };

  website?: string;
  host: User | string;
};
