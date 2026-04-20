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

        if (searchParams.has("category")) {
          if (listing.category.predefinedCategory) {
            if (
              searchParams
                .getAll("category")
                .filter((category) =>
                  listing.category.predefinedCategory?.includes(
                    category as category,
                  ),
                ).length > 0
            ) {
              return true;
            } else {
              return false;
            }
          }

          if (listing.category.customCategory) {
            if (
              searchParams
                .getAll("category")
                .filter((category) =>
                  listing.category.customCategory?.includes(category),
                ).length > 0
            ) {
              return true;
            } else {
              return false;
            }
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
          } else if (listing.description.toLowerCase().includes(searchString)) {
            return true;
          } else if (
            listing.category.predefinedCategory &&
            listing.category.predefinedCategory?.filter((category) =>
              category.toLowerCase().includes(searchString),
            ).length > 0
          ) {
            return true;
          } else if (
            listing.category.customCategory &&
            listing.category.customCategory?.filter((category) =>
              category.toLowerCase().includes(searchString),
            ).length > 0
          ) {
            return true;
          } else {
            return false;
          }
        }

        return true;
      });

      setSearchResult(filtered);
    };

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
