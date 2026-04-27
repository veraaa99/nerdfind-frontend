import { useEffect, useState } from "react";
import Bookmark from "../assets/bokmärke.svg";
import SavedBookmark from "../assets/bokmärke-ifylld.svg";
import { useAuth } from "@/contexts/authContext";
import axios from "@/api/axios";

type SaveListingProps = {
  listing: Listing;
};

const SaveListingButton = ({ listing }: SaveListingProps) => {
  const { user, token } = useAuth();
  const [saved, setSaved] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    const getUserById = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`/api/users/${user}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.status !== 200) return;
        setUserProfile(res.data);
        return;
      } catch (error: any) {
        console.log(error.response.data);
        return;
      }
    };

    const checkListing = () => {
      if (
        !userProfile ||
        !userProfile.savedListings ||
        userProfile.savedListings.length == 0
      ) {
        setSaved(false);
        return;
      }

      const savedListing: string | undefined = userProfile.savedListings.find(
        (l) => l == listing._id,
      );

      if (savedListing) {
        setSaved(true);
      } else {
        setSaved(false);
      }
      return;
    };

    getUserById();
    checkListing();
  }, [userProfile, listing]);

  const handleSaveListing = async () => {
    if (userProfile && userProfile.savedListings) {
      const savedListing: string | undefined = userProfile.savedListings.find(
        (l) => l == listing._id,
      );

      if (savedListing) {
        try {
          const res = await axios.put(
            `/api/users/savelisting/${listing._id}`,
            {},
            {
              headers: {
                authorization: `Bearer ${sessionStorage.getItem("jwt") || ""}`,
              },
            },
          );

          if (res.status !== 200) return;
          setSaved(false);
          return;
        } catch (error: any) {
          console.log(error.response.data);
          return;
        }
      } else {
        try {
          const res = await axios.put(
            `/api/users/savelisting/${listing._id}`,
            {},
            {
              headers: {
                authorization: `Bearer ${sessionStorage.getItem("jwt") || ""}`,
              },
            },
          );

          if (res.status !== 200) return;
          setSaved(true);
          return;
        } catch (error: any) {
          console.log(error.response.data);
          return;
        }
      }
    }
  };

  return (
    <>
      {user == null ? (
        <button type="button" className="flex gap-1">
          <img src={Bookmark} alt="" className="w-6" />
          LOGGA IN FÖR ATT SPARA EN ANNONS{" "}
        </button>
      ) : (
        <button
          type="button"
          className="flex gap-1 cursor-pointer"
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
