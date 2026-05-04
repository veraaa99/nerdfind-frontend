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
    <div className="pt-10 mx-auto flex flex-col justify-center md:p-10 ">
      <hr className="divide-solid border-green-300 mt-8 md:mb-5" />
      <div className="p-5 md:p-0">
        <h1>{listing.title}</h1>

        <h2>{listing.type}</h2>

        <h3 className="pb-1 pt-5">STAD:</h3>
        <p className="text-lg">{listing.location.city}</p>
      </div>

      <div>
        <div>
          <div className="w-full md:mt-5">
            <img
              src={listing.images[0].url}
              alt={listing.images[0].alt}
              className="w-full aspect-4/3 object-cover md:rounded-lg"
            />
          </div>

          <div className="flex gap-4 flex-wrap mt-4 px-5 md:px-0 ">
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

        {/* <div className="p-5 md:p-0">
          <h1>{listing.title}</h1>

          <h2>{listing.type}</h2>

          <h3 className="pb-1 pt-5">STAD:</h3>
          <p className="text-lg">{listing.location.city}</p>
        </div> */}
        {/* <hr className="divide-solid border-green-300 mt-3 mb-3" /> */}
        <div className="flex flex-col gap-10 p-5 md:flex-row md:justify-between md:gap-2 md:px-0">
          <div className="md:w-100">
            <h3 className="pb-1">BESKRIVNING</h3>
            <p>{listing.description}</p>

            <h3 className="pb-3 pt-5">KATEGORIER</h3>
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
                <h3 className="pt-5 pb-2">TIDER & DATUM</h3>
                <div className=" flex flex-col gap-5">
                  <div className="p-3 border rounded-lg">
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
                  </div>

                  <div className="p-3 border rounded-lg flex flex-row justify-between">
                    {listing.openingHours.map((day) =>
                      day.times.start == "STÄNGT" ? (
                        <>
                          <p>{day.day}:</p>
                          <p>{day.times.start}</p>
                        </>
                      ) : (
                        <>
                          <p>{day.day}:</p>
                          <p>
                            {day.times.start} - {day.times.end}
                          </p>
                        </>
                      ),
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="pt-5 pb-2">TIDER</h3>

                <div className="p-3 border rounded-lg flex flex-row justify-between">
                  {listing.openingHours.map((day) =>
                    day.times.start == "STÄNGT" ? (
                      <>
                        <p>{day.day}:</p>
                        <p>{day.times.start}</p>
                      </>
                    ) : (
                      <>
                        <p>{day.day}:</p>
                        <p>
                          {day.times.start} - {day.times.end}
                        </p>
                      </>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
          <div>
            <SaveListingButton listing={listing} />
          </div>
        </div>
      </div>

      <hr className="divide-solid border-green-300 my-5" />

      <div className="flex flex-col md:flex-row md:gap-10">
        <div className="p-5 md:p-0">
          <h3 className="pb-3">PLATS</h3>
          <p>{listing.location.address.split(",").slice(0, 4).join(" - ")}</p>
          <div className="rounded-xl overflow-hidden md:w-120 mt-5">
            <MapContainer
              center={position}
              zoom={13}
              style={{ height: "400px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position}>
                <Popup>{listing.location.address}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <hr className="divide-solid border-green-300 mb-5 mt-8" />

        <div className="p-5 md:p-0">
          <h3 className=" pb-3">ARRANGÖR:</h3>
          <p className="font-semibold">{host?.name}</p>
          {listing.website && (
            <>
              <h4 className="font-semibold pb-2 pt-7">HEMSIDA:</h4>{" "}
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
      </div>
    </div>
  );
};
export default Listing;
