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
          <div className="container mx-auto flex justify-evenly">
            {dummyListings.map(
              (listing) =>
                listing.type == "Event" && (
                  <ListingCardSmall listing={listing} />
                ),
            )}
          </div>
        </div>
        <div>
          <h3 className="text-center">LOPPISAR</h3>
          <div className="container mx-auto flex justify-evenly">
            {dummyListings.map(
              (listing) =>
                listing.type == "Loppis" && (
                  <ListingCardSmall listing={listing} />
                ),
            )}
          </div>
        </div>
        <div>
          <h3 className="text-center">MÄSSOR</h3>
          <div className="container mx-auto flex justify-evenly">
            {dummyListings.map(
              (listing) =>
                listing.type == "Mässa" && (
                  <ListingCardSmall listing={listing} />
                ),
            )}
          </div>
        </div>
        <div>
          <h3 className="text-center">BUTIK</h3>
          <div className="container mx-auto flex justify-evenly">
            {dummyListings.map(
              (listing) =>
                listing.type == "Butik" && (
                  <ListingCardSmall listing={listing} />
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
