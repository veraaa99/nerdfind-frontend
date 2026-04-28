import axios from "@/api/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

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
    <div className="w-52 rounded-md overflow-hidden">
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
          <p>{listing.location.city.split(",").slice(0, 1).join(" - ")}</p>
          <div>
            {listing.category.predefinedCategory &&
              listing.category.predefinedCategory.map((category) => (
                <p>{category}</p>
              ))}
            {listing.category.customCategory &&
              listing.category.customCategory.map((category) => (
                <p>{category}</p>
              ))}
          </div>
          <div>{host?.name}</div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCardSmall;
