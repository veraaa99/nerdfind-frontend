import { useListing } from "@/contexts/listingContext";
import ListingCardSmall from "../components/ListingCardSmall";
import Searchbar from "../components/Searchbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const Home = () => {
  // TODO: Lögg till unik key prop i alla .map-funktioner
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
    <div className="mx-auto">
      <div className="h-80 flex flex-col justify-center text-center px-10 bg-[url('./assets/pexels-brentsingletonphoto-36398813.webp')] bg-cover bg-center bg-black/60 bg-blend-overlay sm:h-90">
        <h1 className="text-center text-shadow-lg/50">NERDFIND SVERIGE</h1>
        <h2 className="text-center text-shadow-lg/50">
          SVERIGES GEMENSAMMA PORTAL FÖR NÖRDEVENT, LOPPISAR, MÄSSOR OCH
          BUTIKER!
        </h2>
      </div>
      <div className="py-10 lg:max-w-5xl mx-auto ">
        <h3 className="text-center">Sök efter annonser i hela landet!</h3>
        <Searchbar />

        <hr className="divide-solid border-green-300 mt-8 md:mb-5" />

        <div className="mt-10">
          <h3 className="text-center pb-3 sm:pb-5">EVENT</h3>
          {loading && <p className="text-shadow-lg/50">Laddar event...</p>}
          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-center sm:mx-auto sm:flex-wrap sm:items-start">
            {eventListings &&
              eventListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {eventListings == undefined ||
              (eventListings.length == 0 && (
                <p className="text-shadow-lg/50">
                  Inga event pågår just nu. Kom tillbaka senare!
                </p>
              ))}
          </div>
        </div>
        <div>
          <h3 className="text-center pb-3 sm:pb-5">LOPPISAR</h3>
          {loading && <p className="text-shadow-lg/50">Laddar loppisar...</p>}

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-center sm:mx-auto sm:flex-wrap sm:items-start">
            {" "}
            {marketListings &&
              marketListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {marketListings == undefined ||
              (marketListings.length == 0 && (
                <p className="text-shadow-lg/50">
                  Inga loppisar pågår just nu. Kom tillbaka senare!
                </p>
              ))}
          </div>
        </div>
        <div>
          <h3 className="text-center pb-3 sm:pb-5">MÄSSOR</h3>
          {loading && <p className="text-shadow-lg/50">Laddar mässor...</p>}

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-center sm:mx-auto sm:flex-wrap sm:items-start">
            {conventionListings &&
              conventionListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {conventionListings == undefined ||
              (conventionListings.length == 0 && (
                <p className="text-shadow-lg/50">
                  Inga mässor pågår just nu. Kom tillbaka senare!
                </p>
              ))}
          </div>
        </div>
        <div>
          <h3 className="text-center pb-3 sm:pb-5">BUTIKER</h3>
          {loading && <p className="text-shadow-lg/50">Laddar butiker...</p>}

          <div className="container flex flex-col gap-10 items-center min-h-52 pb-10 sm:pb-15 sm:flex-row sm:justify-center sm:mx-auto sm:flex-wrap sm:items-start">
            {storeListings &&
              storeListings.map((listing) => (
                <ListingCardSmall listing={listing} />
              ))}
            {storeListings == undefined ||
              (storeListings.length == 0 && (
                <p className="text-shadow-lg/50">
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
