import { dummyUsers } from "./users";

export const dummyListings: Listing[] = [
  {
    _id: "1",
    title: "Event 1",
    description: "Lorem ipsum",
    type: "Event",
    category: { predefinedCategory: ["Tv-spel"] },
    images: [
      {
        url: "https://images.unsplash.com/photo-1589208733220-40ef1ca2bdb7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: "123",
        alt: "Ett foto på körsbärsblommorna i Kungsträdgården.",
      },
    ],
    date: new Date("2026-04-30"),
    openingHours: [{ day: 5, times: [{ start: "10:00", end: "18:00" }] }],
    location: {
      city: "Stockholm",
      type: "Point",
      coordinates: [59.325415365, 18.0695163886],
    },
    website:
      "https://images.unsplash.com/photo-1589208733220-40ef1ca2bdb7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    host: dummyUsers[0],
  },
  {
    _id: "2",
    title: "Event 2",
    description: "Lorem ipsum",
    type: "Event",
    category: { predefinedCategory: ["Tv-spel"] },
    images: [
      {
        url: "https://images.unsplash.com/photo-1589208733220-40ef1ca2bdb7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: "123",
        alt: "Ett foto på körsbärsblommorna i Kungsträdgården.",
      },
    ],
    date: new Date("2026-04-30"),
    openingHours: [{ day: 5, times: [{ start: "10:00", end: "18:00" }] }],
    location: {
      city: "Stockholm",
      type: "Point",
      coordinates: [59.325415365, 18.0695163886],
    },
    website:
      "https://images.unsplash.com/photo-1589208733220-40ef1ca2bdb7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    host: dummyUsers[0],
  },
  {
    _id: "3",
    title: "Event 3",
    description: "Lorem ipsum",
    type: "Loppis",
    category: { predefinedCategory: ["Tv-spel"] },
    images: [
      {
        url: "https://images.unsplash.com/photo-1589208733220-40ef1ca2bdb7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        publicId: "123",
        alt: "Ett foto på körsbärsblommorna i Kungsträdgården.",
      },
    ],
    date: new Date("2026-04-30"),
    openingHours: [{ day: 5, times: [{ start: "10:00", end: "18:00" }] }],
    location: {
      city: "Uppsala",
      type: "Point",
      coordinates: [59.325415365, 18.0695163886],
    },
    website:
      "https://images.unsplash.com/photo-1589208733220-40ef1ca2bdb7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    host: dummyUsers[0],
  },
];
