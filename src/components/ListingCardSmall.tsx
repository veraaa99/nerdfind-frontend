import { Link } from "react-router";

type ListingProps = {
  listing: Listing;
};

const ListingCardSmall = ({ listing }: ListingProps) => {
  return (
    <div className="w-52 rounded-md overflow-hidden">
      <Link to={`/listings/${listing._id}`}>
        <div>
          <img src={listing.images[0].url} alt={listing.images[0].url} />
        </div>
        <div className="p-5">
          <h3>{listing.title}</h3>
          <h4>{listing.type}</h4>
          <p>{listing.location.city}</p>
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
          <div>{listing.host.name}</div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCardSmall;
