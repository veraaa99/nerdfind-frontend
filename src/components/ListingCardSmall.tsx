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
    <div className="w-60 rounded-md overflow-hidden">
      <Link to={`/listings/${listing._id}`}>
        <div>
          <img
            className="object-cover h-45 w-60 rounded-t-md rounded-r-md"
            src={listing.images[0].url}
            alt={listing.images[0].url}
          />
        </div>
        <div className="p-5">
          <h3>{listing.title}</h3>
          <h4>{listing.type}</h4>
          <p>{listing.location.address.split(",").slice(0, 1).join(" - ")}</p>
          <p>{listing.location.city}</p>
          <div className="flex flex-wrap items-center gap-2">
            {listing.category.predefinedCategory &&
              listing.category.predefinedCategory.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="relative gap-2 rounded-sm px-3 py-1.5 bg-green-800 text-white"
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
                  className="relative gap-2 rounded-sm px-3 py-1.5 bg-green-800 text-white"
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
          <div>{host?.name}</div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCardSmall;
