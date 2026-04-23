import ListingCardSmall from "@/components/ListingCardSmall";
import { dummyListings } from "@/data/listings";

const AllListings = () => {
  return (
    <div>
      <h1 className="text-center">ALLA ANNONSER</h1>

      <div>
        <h3 className="text-center">EVENT</h3>
        <div className="container mx-auto flex justify-evenly min-h-52">
          {dummyListings.map(
            (listing) =>
              listing.type == "Event" && <ListingCardSmall listing={listing} />,
          )}
          {!dummyListings.filter((listing) => listing.type == "Event") && (
            <p>Inga event pågår just nu. Kom tillbaka senare!</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-center">LOPPISAR</h3>
        <div className="container mx-auto flex justify-evenly min-h-52">
          {dummyListings.map(
            (listing) =>
              listing.type == "Loppis" && (
                <ListingCardSmall listing={listing} />
              ),
          )}
          {!dummyListings.filter((listing) => listing.type == "Loppis") && (
            <p>Inga loppisar pågår just nu. Kom tillbaka senare!</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-center">MÄSSOR</h3>
        <div className="container mx-auto flex justify-evenly min-h-52">
          {dummyListings.map(
            (listing) =>
              listing.type == "Mässa" && <ListingCardSmall listing={listing} />,
          )}
          {!dummyListings.find((listing) => listing.type == "Mässa") && (
            <p>Inga mässor pågår just nu. Kom tillbaka senare!</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-center">BUTIKER</h3>
        <div className="container mx-auto flex justify-evenly min-h-52">
          {dummyListings.map(
            (listing) =>
              listing.type == "Butik" && <ListingCardSmall listing={listing} />,
          )}
          {!dummyListings.find((listing) => listing.type == "Butik") && (
            <p>Inga butiker finns tillgängliga just nu. Kom tillbaka senare!</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default AllListings;
