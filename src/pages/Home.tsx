import ListingCardSmall from "../components/ListingCard.Small";
import Searchbar from "../components/Searchbar";
import { dummyListings } from "../data/listings";

const Home = () => {
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
            {dummyListings.map(
              (listing) =>
                listing.type == "Event" && (
                  <ListingCardSmall listing={listing} />
                ),
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
                listing.type == "Mässa" && (
                  <ListingCardSmall listing={listing} />
                ),
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
                listing.type == "Butik" && (
                  <ListingCardSmall listing={listing} />
                ),
            )}
            {!dummyListings.find((listing) => listing.type == "Butik") && (
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
