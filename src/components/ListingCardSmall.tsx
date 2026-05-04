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
    <div className="w-80 rounded-md overflow-hidden border border-b-emerald-100">
      <Link to={`/listings/${listing._id}`}>
        <div
          className="p-5 flex flex-col justify-end h-50 w-80 rounded-t-md rounded-r-md lg:w-90 lg:h-70 bg-cover bg-center bg-black/60 bg-blend-overlay"
          style={{ backgroundImage: `url(${listing.images[0].url})` }}
        >
          {/* <img
            className="object-cover h-50 w-80 rounded-t-md rounded-r-md lg:w-90 lg:h-70"
            src={listing.images[0].url}
            alt={listing.images[0].url}
          /> */}
          <h3 className="font-bold ">{listing.title}</h3>
        </div>
        <div className="p-5 flex flex-col gap-1 font-light">
          <h4>{listing.type}</h4>
          <p>{listing.location.address.split(",").slice(0, 1).join(" - ")}</p>
          <p>{listing.location.city}</p>
          <div className="flex flex-wrap items-center gap-2">
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
          <div className="pt-2">
            <p className="font-semibold text-md">ARRANGÖR: </p>
            <p>{host?.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCardSmall;
