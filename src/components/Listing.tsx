import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SaveListingButton from "./SaveListingButton";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Badge } from "./ui/badge";

type ListingProps = {
  listing: Listing;
};

const Listing = ({ listing }: ListingProps) => {
  const [lat, lng] = listing.location.coordinates;
  const position: [number, number] = [lng, lat];
  const [host, setHost] = useState<User | null>(null);

  useEffect(() => {
    const getHostByID = async (userId: string | User) => {
      const res = await axios.get(`api/users/${userId}`);

      if (res.status !== 200) return;

      setHost(res.data);
    };

    getHostByID(listing.host);
  }, []);

  return (
    <div className="mx-auto flex flex-col justify-center p-10">
      <div>
        <h1>{listing.title}</h1>

        <div>
          <div className="w-full sm:w-xl md:w-full">
            <img
              src={listing.images[0].url}
              alt={listing.images[0].alt}
              className="w-full aspect-4/3 object-cover rounded-lg"
            />
          </div>

          <div className="flex gap-4 flex-wrap mt-4">
            {listing.images.slice(1).map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  className="w-40 aspect-4/3 object-cover rounded-lg sm:w-55 lg:w-65"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10 pb-5 sm:flex-row sm:justify-between sm:gap-2">
          <div>
            <h2 className="pb-5">{listing.type}</h2>
            <h4 className="font-semibold pb-1">PLATS:</h4>
            <p>{listing.location.address.split(",").slice(0, 4).join(" - ")}</p>
            <p className="font-semibold pb-1 pt-3">STAD:</p>
            <h4>{listing.location.city}</h4>

            <hr className="divide-solid border-green-300 my-5" />

            <h3 className="pb-1">BESKRIVNING</h3>
            <p>{listing.description}</p>

            <hr className="divide-solid border-green-300 my-5" />

            <h3 className="pb-3">KATEGORIER</h3>
            <div className="flex items-center gap-2">
              {listing.category.predefinedCategory &&
                listing.category.predefinedCategory.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 bg-green-800 text-white"
                  >
                    <label
                      htmlFor={category}
                      className=" select-none after:absolute after:inset-0 "
                    >
                      {category}
                    </label>
                  </Badge>
                ))}
              {listing.category.customCategory &&
                listing.category.customCategory.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 bg-green-800 text-white"
                  >
                    <label
                      htmlFor={category}
                      className=" select-none after:absolute after:inset-0 "
                    >
                      {category}
                    </label>
                  </Badge>
                ))}
            </div>

            {listing.date ? (
              <>
                <h3 className="pt-5 pb-1">TIDER & DATUM</h3>
                <p>
                  {new Date(listing.date).toLocaleDateString("sv-SE", {
                    weekday: "long",
                    day: "numeric",
                    year: "numeric",
                    month: "long",
                  })}{" "}
                  (
                  {new Date(listing.date).getFullYear() +
                    "-" +
                    (new Date(listing.date).getMonth() + 1) +
                    "-" +
                    new Date(listing.date).getDate()}
                  )
                </p>

                <p>
                  {listing.openingHours.map((day) =>
                    day.times.start == "STÄNGT" ? (
                      <p>
                        {day.day}: {day.times.start}
                      </p>
                    ) : (
                      <p>
                        {day.day}: {day.times.start} - {day.times.end}
                      </p>
                    ),
                  )}
                </p>
              </>
            ) : (
              <>
                <h3 className="pt-5">TIDER</h3>

                {listing.openingHours.map((day) =>
                  day.times.start == "STÄNGT" ? (
                    <p>
                      {day.day}: {day.times.start}
                    </p>
                  ) : (
                    <p>
                      {day.day}: {day.times.start} - {day.times.end}
                    </p>
                  ),
                )}
              </>
            )}
          </div>
          <div>
            <SaveListingButton listing={listing} />
          </div>
        </div>
      </div>

      <hr className="divide-solid border-green-300 my-5" />

      <h3 className="pb-3">PLATS</h3>

      <div className="rounded-xl overflow-hidden">
        <MapContainer center={position} zoom={13} style={{ height: "400px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>{listing.location.address}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <hr className="divide-solid border-green-300 mb-5 mt-8" />

      <h3 className="font-semibold pb-3">ARRANGÖR: {host?.name}</h3>
      {listing.website && (
        <>
          <h4 className="font-semibold pb-1">HEMSIDA:</h4>{" "}
          <a
            className="underline font-extralight break-all"
            href={listing.website}
            target="_blank"
          >
            {listing.website}
          </a>
        </>
      )}
    </div>
  );
};
export default Listing;
