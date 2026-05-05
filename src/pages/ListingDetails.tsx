import Listing from "@/components/Listing";
import { useListing } from "@/contexts/listingContext";
import { useEffect } from "react";
import { useParams } from "react-router";

const ListingDetails = () => {
  const { listings } = useListing();

  const listingId = useParams().id;
  const listing = listings?.find((listing) => listing._id == listingId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto md:max-w-5xl">
      {listing && <Listing listing={listing} />}
    </div>
  );
};
export default ListingDetails;
