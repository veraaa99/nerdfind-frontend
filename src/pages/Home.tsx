import { useListing } from "@/contexts/listingContext";
import ListingCardSmall from "../components/ListingCardSmall";
import Searchbar from "../components/Searchbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const Home = () => {
  const { listings } = useListing();
  const location = useLocation();

  const [eventListings, setEventListings] = useState<Listing[] | undefined>([]);
  const [marketListings, setMarketListings] = useState<Listing[] | undefined>(
    [],
  );
  const [conventionListings, setConventionListings] = useState<
    Listing[] | undefined
  >([]);
  const [storeListings, setStoreListings] = useState<Listing[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const setHomePageListings = () => {
      setLoading(true);

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
    setLoading(false);
  }, [listings, location.pathname]);

  return (
    <div className="container mx-auto md:max-w-5xl">
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
          <h3 className="text-center pb-3 sm:pb-5">EVENT</h3>
          {loading && <p>Laddar event...</p>}
          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto">
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
          <h3 className="text-center pb-3 sm:pb-5">LOPPISAR</h3>
          {loading && <p>Laddar loppisar...</p>}

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto">
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
          <h3 className="text-center pb-3 sm:pb-5">MÄSSOR</h3>
          {loading && <p>Laddar mässor...</p>}

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto">
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
          <h3 className="text-center pb-3 sm:pb-5">BUTIKER</h3>
          {loading && <p>Laddar butiker...</p>}

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-evenly sm:mx-auto">
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
