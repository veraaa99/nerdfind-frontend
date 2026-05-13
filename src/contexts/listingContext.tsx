import axios from "@/api/axios";
import type { CreateListingInputs } from "@/schemas/zod";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type ListingState = {
  listings: Listing[] | null;
  actions: {
    createListing: (listingInformation: CreateListingInputs) => void;
  };
};

const defaultState: ListingState = {
  listings: null,
  actions: {
    createListing: () => {},
  },
};

export const ListingContext = createContext<ListingState>(defaultState);

const ListingContextProvider = ({ children }: PropsWithChildren) => {
  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    const getAllListings = async () => {
      try {
        const res = await axios.get("api/listings/");

        if (res.status === 200) {
          setListings(res.data);
        }
      } catch (error: any) {
        console.log(error.response.data);
        throw error;
      }
    };
    getAllListings();
  }, []);

  const createListing: typeof defaultState.actions.createListing = async (
    listingInformation: CreateListingInputs,
  ) => {
    try {
      const res = await axios.post("api/listings/", listingInformation, {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("jwt") || ""}`,
        },
      });

      if (res.status === 201) {
        setListings((prev) => (prev ? [res.data, ...prev] : [res.data]));
      }

      return;
    } catch (error: any) {
      console.log(error.response.data);
      throw error;
    }
  };

  const actions = { createListing };

  return (
    <ListingContext.Provider value={{ listings, actions }}>
      {children}
    </ListingContext.Provider>
  );
};

export default ListingContextProvider;

export const useListing = () => {
  const context = useContext(ListingContext);

  if (!context)
    throw new Error(
      "useListing must be called inside an ListingContextProvider",
    );

  return context;
};
