import axios from "@/api/axios";
import ListingCardSmall from "@/components/ListingCardSmall";
import { useListing } from "@/contexts/listingContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const SearchResult = () => {
  const { listings } = useListing();

  const [searchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState<Listing[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getListingsByFilter = async () => {
      if (searchParams.size == 0) {
        setSearchResult(listings);
        return;
      }

      setLoading(true);

      try {
        const res = await axios.get(`/api/listings/search/?${searchParams}`);

        if (res.status !== 200) return;
        setSearchResult(res.data);
        setLoading(false);

        return;
      } catch (error: any) {
        console.log(error.response.data);
        setLoading(false);

        return;
      }
    };

    getListingsByFilter();
  }, [searchParams]);

  return (
    <div>
      {loading && <p>Söker efter annonser...</p>}
      {searchResult !== null && searchResult.length > 0 ? (
        searchResult.map((listing) => <ListingCardSmall listing={listing} />)
      ) : (
        <>
          <p>
            Inga annonser matchade din sökning. Testa några andra filter eller
            kom tillbaka senare!
          </p>
        </>
      )}
    </div>
  );
};
export default SearchResult;
