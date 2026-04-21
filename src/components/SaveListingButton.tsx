import { useEffect, useState } from "react";
import Bookmark from "../assets/bokmärke.svg";
import SavedBookmark from "../assets/bokmärke-ifylld.svg";
import { useAuth } from "@/contexts/authContext";

type SaveListingProps = {
  listing: Listing;
};

const SaveListingButton = ({ listing }: SaveListingProps) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    const checkListing = () => {
      if (!user || !user.savedListings || user.savedListings.length == 0) {
        setSaved(false);
        return;
      }

      const savedListing: string | undefined = user.savedListings.find(
        (id) => id == listing._id,
      );
      if (savedListing == undefined) {
        setSaved(false);
      } else {
        setSaved(true);
      }
      return;
    };
    checkListing();
  }, []);

  const handleSaveListing = () => {
    if (user && user.savedListings) {
      const savedListing: string | undefined = user.savedListings.find(
        (id) => id == listing._id,
      );
      if (savedListing) {
        setSaved(false);
      } else {
        setSaved(true);
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
          className="flex gap-1"
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
