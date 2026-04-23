import Listing from "@/components/Listing";
import ListingCardSmall from "@/components/ListingCardSmall";
import { dummyListings } from "@/data/listings";
import { dummyUsers } from "@/data/users";
import { useEffect, useState } from "react";

const Profile = () => {
  // const { user } = useAuth();
  const user = dummyUsers[1];
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [userCreatedListings, setUserCreatedListings] = useState<Listing[]>([]);

  useEffect(() => {
    const findSavedListings = () => {
      if (!user?.savedListings?.length) return;

      const savedSet = new Set(user.savedListings);

      const foundListings = dummyListings.filter((listing) =>
        savedSet.has(listing._id),
      );

      setSavedListings(foundListings);
    };
    const findCreatedListings = () => {
      if (!user.isHost) return;

      const foundCreatedListings = dummyListings.filter(
        (listing) => listing.host._id == user._id,
      );
      setUserCreatedListings(foundCreatedListings);
    };

    findSavedListings();
    findCreatedListings();
  }, [user]);

  return (
    <div>
      {user && (
        <>
          <div>
            <h1>PROFIL</h1>
            <h2>Välkommen {user.name}!</h2>
          </div>

          <div>
            <h3>SPARADE ANNONSER</h3>
            {savedListings.length == 0 ? (
              <div>
                <p>Du har inga sparade annonser just nu.</p>
              </div>
            ) : (
              <div>
                {savedListings.map((listing) => (
                  <Listing key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </div>

          {user.isHost && (
            <>
              <h3>SKAPADE ANNONSER</h3>
              {userCreatedListings.length == 0 ? (
                <div>
                  <p>Du har inte skapat några annonser än.</p>
                </div>
              ) : (
                <div>
                  {userCreatedListings.map((listing) => (
                    <ListingCardSmall key={listing._id} listing={listing} />
                  ))}
                </div>
              )}

              <div>
                <h3>
                  Vill du skapa en ny annons till ditt event, din butik eller
                  loppis? Gör det här!
                </h3>
                <button>Skapa ny annons</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
