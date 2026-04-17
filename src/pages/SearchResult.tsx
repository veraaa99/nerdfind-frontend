import ListingCardSmall from "@/components/ListingCard.Small";
import { dummyListings } from "@/data/listings";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState<Listing[]>([]);

  useEffect(() => {
    if (searchParams.size == 0) {
      setSearchResult(dummyListings);
      return;
    }

    const getListingsByFilter = () => {
      const filtered = dummyListings.filter((listing) => {
        if (searchParams.has("location")) {
          if (
            !searchParams.getAll("location").includes(listing.location.city)
          ) {
            return false;
          }
        }

        if (searchParams.has("type")) {
          if (listing.type !== searchParams.get("type")) {
            return false;
          }
        }

        if (searchParams.has("searchString")) {
          const searchString = searchParams.get("searchString")!.toLowerCase();

          if (listing.title.toLowerCase().includes(searchString)) {
            return true;
          } else if (
            listing.location.city.toLowerCase().includes(searchString)
          ) {
            return true;
          } else if (listing.type.toLowerCase().includes(searchString)) {
            return true;
          } else {
            return false;
          }
        }

        return true;
      });

      setSearchResult(filtered);
    };

    // if (searchParams.has("searchString")) {
    //   if (
    //     !listing.title.includes(searchParams.get("searchString") as string)
    //   ) {
    //     return;
    //   }
    // }

    // if (searchParams.has("type")) {
    //   if (listing.type !== searchParams.get("type")?.toString()) {
    //     return;
    //   }
    // }

    getListingsByFilter();
  }, [searchParams]);

  return (
    <div>
      {searchResult !== undefined && (
        <div>
          {searchResult.map((listing) => (
            <ListingCardSmall listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};
export default SearchResult;
