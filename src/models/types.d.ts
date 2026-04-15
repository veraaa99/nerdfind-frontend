type listingType = "Event" | "Butik" | "Mässa" | "Loppis";
type category =
  | "Tv-spel"
  | "Sci-fi"
  | "Serietidningar"
  | "Cosplay"
  | "Anime"
  | "Manga"
  | "Rollspel";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isHost: boolean;
};

type ImageUpload = {
  url: string;
  publicId: string;
  alt: string;
};

type OpeningHours = {
  day: number;
  times: [
    {
      start: string;
      end: string;
    },
  ];
};

type Listing = {
  _id: string;
  title: string;
  description: string;
  type: listingType;
  category: {
    predefinedCategory?: [category];
    customCategory?: [string];
  };
  images: [ImageUpload];
  date: Date;
  openingHours: [OpeningHours];
  location: { type: "Point"; coordinates: [number, number] };

  website?: string;
  host: User;
};
