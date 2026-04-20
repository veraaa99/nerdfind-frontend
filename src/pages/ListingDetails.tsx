import Listing from "@/components/Listing";
import { dummyListings } from "@/data/listings";
import { useParams } from "react-router";

const ListingDetails = () => {
  const listingId = useParams().id;
  const listing = dummyListings.find((listing) => listing._id == listingId);

  console.log(listingId);
  console.log(listing);

  return <div>{listing && <Listing listing={listing} />}</div>;
};
export default ListingDetails;
