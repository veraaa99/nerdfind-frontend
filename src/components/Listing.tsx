import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SaveListingButton from "./SaveListingButton";
import { useEffect, useState } from "react";
import axios from "@/api/axios";

type ListingProps = {
  listing: Listing;
};

const Listing = ({ listing }: ListingProps) => {
  const [lat, lng] = listing.location.coordinates;
  const position: [number, number] = [lng, lat];
  const [host, setHost] = useState<User | null>(null);

  useEffect(() => {
    const getUserByID = async (userId: string | User) => {
      const res = await axios.get(`api/users/${userId}`);

      if (res.status !== 200) return;

      setHost(res.data);
    };
    getUserByID(listing.host);
  }, []);

  return (
    <div>
      <div>
        <h1>{listing.title}</h1>

        <div>
          <img
            src={listing.images[0].url}
            alt={listing.images[0].alt}
            className="w-3xl"
          />
        </div>

        <div className="flex justify-between w-2xl">
          <div>
            <p>{listing.type}</p>
            <p>{listing.location.city}</p>

            <h2>BESKRIVNING</h2>
            <p>{listing.description}</p>

            {listing.date ? (
              <>
                <h3>TIDER & DATUM</h3>
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
                <h3>TIDER</h3>

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

      <h3>PLATS</h3>

      <MapContainer center={position} zoom={13} style={{ height: "300px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>{listing.location.city}</Popup>
        </Marker>
      </MapContainer>

      <h3>ARRANGÖR: {host?.name}</h3>
      {listing.website && (
        <>
          <h4>HEMSIDA:</h4>{" "}
          <a className="underline" href={listing.website} target="_blank">
            {listing.website}
          </a>
        </>
      )}
    </div>
  );
};
export default Listing;
