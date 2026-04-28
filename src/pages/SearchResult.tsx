import axios from "@/api/axios";
import ListingCardSmall from "@/components/ListingCardSmall";
import { useListing } from "@/contexts/listingContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const SearchResult = () => {
  const { listings } = useListing();

  const [searchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState<Listing[] | null>([]);

  useEffect(() => {
    const getListingsByFilter = async () => {
      if (searchParams.size == 0) {
        setSearchResult(listings);
        return;
      }

      try {
        const res = await axios.get(`/api/listings/search/?${searchParams}`);

        if (res.status !== 200) return;
        setSearchResult(res.data);
        return;
      } catch (error: any) {
        console.log(error.response.data);
        return;
      }
    };

    getListingsByFilter();
  }, [searchParams]);

  return (
    <div>
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
