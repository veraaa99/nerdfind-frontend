import axios from "@/api/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Badge } from "./ui/badge";

type ListingProps = {
  listing: Listing;
};

const ListingCardSmall = ({ listing }: ListingProps) => {
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
    <div className="group relative w-80 rounded-md overflow-hidden border border-emerald-500 bg-emerald-950 text-emerald-400 shadow-xl/30 hover:text-emerald-200 transition transform hover:-translate-y-1 duration-500 lg:w-78 self-start">
      <div className="absolute inset-0 bg-white opacity-5 group-hover:opacity-10 transition pointer-events-none duration-500" />

      <Link to={`/listings/${listing._id}`}>
        <div
          className="relative z-10 p-5 flex flex-col justify-end h-50 w-80 rounded-t-md rounded-r-md sm:w-78 lg:h-78  bg-cover bg-center bg-black/60 bg-blend-overlay group-hover:bg-black/20 transition duration-500"
          style={{ backgroundImage: `url(${listing.images[0].url})` }}
        >
          <h3 className="font-bold text-wrap text-shadow-lg/50 group-hover:text-shadow-2xl">
            {listing.title}
          </h3>
        </div>
        <div className="p-5 flex flex-col gap-1 font-light ">
          <h4>{listing.type}</h4>
          <p>{listing.location.address.split(",").slice(0, 1).join(" - ")}</p>
          <p>{listing.location.city}</p>
          <div className="flex flex-wrap items-center gap-2">
            {listing.category.predefinedCategory &&
              listing.category.predefinedCategory.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 bg-emerald-400 text-black group-hover:bg-green-300 duration-500"
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
                  className="relative gap-2 rounded-sm px-4 py-4 text-sm sm:px-3 sm:py-4 md:text-sm md:px-4 md:py-3.5 bg-emerald-400 text-black group-hover:bg-green-300 duration-500"
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
          <div className="pt-2">
            <h4 className="font-semibold text-md">ARRANGÖR: </h4>
            <p>{host?.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCardSmall;
