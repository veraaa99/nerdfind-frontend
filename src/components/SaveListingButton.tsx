import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import axios from "@/api/axios";

import DisabledBookmark from "../assets/bokmärke.svg";
import Bookmark from "../assets/ny-bokmärke.svg";
import SavedBookmark from "../assets/ny-bokmärke-ifylld.svg";

type SaveListingProps = {
  listing: Listing;
};

const SaveListingButton = ({ listing }: SaveListingProps) => {
  const { user, token } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const saved = currentUser?.savedListings?.includes(listing._id) ?? false;

  useEffect(() => {
    const getUserById = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`/api/users/${user}`);

        if (res.status === 200) {
          setCurrentUser(res.data);
        }
      } catch (error: any) {
        console.log(error.response.data);
      }
    };

    getUserById();
  }, [user]);

  const handleSaveListing = async () => {
    if (!currentUser) return;

    try {
      const res = await axios.put(
        `/api/users/savelisting/${listing._id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status !== 200) return;

      setCurrentUser((prev) => {
        if (!prev) return prev;

        const alreadySaved = prev.savedListings?.includes(listing._id);

        return {
          ...prev,
          savedListings: alreadySaved
            ? prev?.savedListings?.filter((id) => id !== listing._id)
            : [...(prev.savedListings || []), listing._id],
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {currentUser == null ? (
        <button
          type="button"
          className="flex gap-2 text-left items-start w-full text-gray-400 "
        >
          <img src={DisabledBookmark} alt="" className="w-6" />
          LOGGA IN FÖR ATT SPARA EN ANNONS{" "}
        </button>
      ) : currentUser && currentUser._id == listing.host ? (
        <button
          type="button"
          className="flex gap-2 text-left items-start w-full text-gray-400"
        >
          <img src={DisabledBookmark} alt="" className="w-6" />
          DET GÅR INTE ATT SPARA DINA EGNA ANNONSER{" "}
        </button>
      ) : (
        <button
          type="button"
          className="flex gap-2 cursor-pointer items-start w-30 ml-auto"
          onClick={handleSaveListing}
        >
          <img src={saved ? SavedBookmark : Bookmark} alt="" className="w-6" />
          {saved ? "TA BORT" : "SPARA"}
        </button>
      )}
    </>
  );
};

export default SaveListingButton;
