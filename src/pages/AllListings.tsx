import ListingCardSmall from "@/components/ListingCardSmall";
import { useListing } from "@/contexts/listingContext";

const AllListings = () => {
  const { listings } = useListing();

  return (
    <div>
      <div className="h-80 flex flex-col justify-center text-center px-10">
        <h1 className="text-center text-shadow-lg/50">ALLA ANNONSER</h1>
      </div>

      <div className="mx-auto md:max-w-5xl">
        <hr className="divide-solid border-green-300 mt-8 md:mb-5" />
        <div>
          <h3 className="text-center pb-3 sm:pb-5">EVENT</h3>
          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto sm:flex-wrap">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Event" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Event").length ==
              0 && (
              <p className="text-shadow-lg/50">
                Inga event pågår just nu. Kom tillbaka senare!
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-center pb-3 sm:pb-5">LOPPISAR</h3>

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto sm:flex-wrap">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Loppis" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Loppis").length ==
              0 && (
              <p className="text-shadow-lg/50">
                Inga loppisar pågår just nu. Kom tillbaka senare!
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-center pb-3 sm:pb-5">MÄSSOR</h3>

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto sm:flex-wrap">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Mässa" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Mässa").length ==
              0 && (
              <p className="text-shadow-lg/50">
                Inga mässor pågår just nu. Kom tillbaka senare!
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-center pb-3 sm:pb-5">BUTIKER</h3>
          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto sm:flex-wrap">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Butik" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Butik").length ==
              0 && (
              <p className="text-shadow-lg/50">
                Inga butiker finns tillgängliga just nu. Kom tillbaka senare!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllListings;
