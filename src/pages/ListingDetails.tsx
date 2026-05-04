import Listing from "@/components/Listing";
import { useListing } from "@/contexts/listingContext";
import { useParams } from "react-router";

const ListingDetails = () => {
  const { listings } = useListing();

  const listingId = useParams().id;
  const listing = listings?.find((listing) => listing._id == listingId);

  return (
    <div className="mx-auto md:max-w-4xl">
      {listing && <Listing listing={listing} />}
    </div>
  );
};
export default ListingDetails;
