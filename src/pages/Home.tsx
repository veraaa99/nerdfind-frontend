import { useListing } from "@/contexts/listingContext";
import ListingCardSmall from "../components/ListingCardSmall";
import Searchbar from "../components/Searchbar";
import { useEffect, useState } from "react";

const Home = () => {
  const { listings } = useListing();

  const [eventListings, setEventListings] = useState<Listing[] | undefined>([]);
  const [marketListings, setMarketListings] = useState<Listing[] | undefined>(
    [],
  );
  const [conventionListings, setConventionListings] = useState<
    Listing[] | undefined
  >([]);
  const [storeListings, setStoreListings] = useState<Listing[] | undefined>([]);

  useEffect(() => {
    const setHomePageListings = () => {
      const eventListingsList: Listing[] | undefined = listings
        ?.filter((listing) => listing.type == "Event")
        .slice(0, 3);
      setEventListings(eventListingsList);

      const marketListingsList: Listing[] | undefined = listings
        ?.filter((listing) => listing.type == "Loppis")
        .slice(0, 3);
      setMarketListings(marketListingsList);

      const conventionListingsList: Listing[] | undefined = listings
        ?.filter((listing) => listing.type == "Mässa")
        .slice(0, 3);
      setConventionListings(conventionListingsList);

      const storeListingsList: Listing[] | undefined = listings
        ?.filter((listing) => listing.type == "Butik")
        .slice(0, 3);
      setStoreListings(storeListingsList);
    };

    setHomePageListings();

    console.log(storeListings);
  }, [listings]);

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
            {eventListings &&
              eventListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {eventListings == undefined ||
              (eventListings.length == 0 && (
                <p>Inga event pågår just nu. Kom tillbaka senare!</p>
              ))}
          </div>
        </div>
        <div>
          <h3 className="text-center">LOPPISAR</h3>
          <div className="container mx-auto flex justify-evenly min-h-52">
            {marketListings &&
              marketListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {marketListings == undefined ||
              (marketListings.length == 0 && (
                <p>Inga loppisar pågår just nu. Kom tillbaka senare!</p>
              ))}
          </div>
        </div>
        <div>
          <h3 className="text-center">MÄSSOR</h3>
          <div className="container mx-auto flex justify-evenly min-h-52">
            {conventionListings &&
              conventionListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {conventionListings == undefined ||
              (conventionListings.length == 0 && (
                <p>Inga mässor pågår just nu. Kom tillbaka senare!</p>
              ))}
          </div>
        </div>
        <div>
          <h3 className="text-center">BUTIKER</h3>
          <div className="container mx-auto flex justify-evenly min-h-52">
            {storeListings &&
              storeListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {storeListings == undefined ||
              (storeListings.length == 0 && (
                <p>
                  Inga butiker finns tillgängliga just nu. Kom tillbaka senare!
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
