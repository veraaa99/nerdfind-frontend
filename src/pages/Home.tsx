import { useListing } from "@/contexts/listingContext";
import ListingCardSmall from "../components/ListingCardSmall";
import Searchbar from "../components/Searchbar";

const Home = () => {
  const { listings } = useListing();

  return (
    <div>
      <div>
        <h1 className="text-center">NERDFIND SVERIGE</h1>
        <h2 className="text-center">
          SVERIGES GEMENSAMMA PORTAL FÖR NÖRDEVENT, LOPPISAR, MÄSSOR OCH
          BUTIKER!
        </h2>
      </div>
      <div>
        <h2 className="text-center">Sök efter det du letar efter!</h2>
        <Searchbar />
        <div>
          <h3 className="text-center">EVENT</h3>
          <div className="container mx-auto flex justify-evenly min-h-52">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Event" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Event").length ==
              0 && <p>Inga event pågår just nu. Kom tillbaka senare!</p>}
          </div>
        </div>
        <div>
          <h3 className="text-center">LOPPISAR</h3>
          <div className="container mx-auto flex justify-evenly min-h-52">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Loppis" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Loppis").length ==
              0 && <p>Inga loppisar pågår just nu. Kom tillbaka senare!</p>}
          </div>
        </div>
        <div>
          <h3 className="text-center">MÄSSOR</h3>
          <div className="container mx-auto flex justify-evenly min-h-52">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Mässa" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Mässa").length ==
              0 && <p>Inga mässor pågår just nu. Kom tillbaka senare!</p>}
          </div>
        </div>
        <div>
          <h3 className="text-center">BUTIKER</h3>
          <div className="container mx-auto flex justify-evenly min-h-52">
            {listings &&
              listings.map(
                (listing) =>
                  listing.type == "Butik" && (
                    <ListingCardSmall listing={listing} />
                  ),
              )}
            {listings?.filter((listing) => listing.type == "Butik").length ==
              0 && (
              <p>
                Inga butiker finns tillgängliga just nu. Kom tillbaka senare!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
