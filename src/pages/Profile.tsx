import axios from "@/api/axios";
import Listing from "@/components/Listing";
import ListingCardSmall from "@/components/ListingCardSmall";
import { useAuth } from "@/contexts/authContext";
import { dummyListings } from "@/data/listings";
import { useEffect, useState } from "react";

const Profile = () => {
  const { user, token } = useAuth();

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [userCreatedListings, setUserCreatedListings] = useState<Listing[]>([]);

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

    const findSavedListings = () => {
      if (!userProfile?.savedListings?.length) return;

      const savedSet = new Set(userProfile.savedListings);

      const foundListings = dummyListings.filter((listing) =>
        savedSet.has(listing._id),
      );

      setSavedListings(foundListings);
    };

    const findCreatedListings = () => {
      if (!userProfile?.isHost) return;

      const foundCreatedListings = dummyListings.filter(
        (listing) => listing.host._id == userProfile._id,
      );
      setUserCreatedListings(foundCreatedListings);
    };

    getUserById();
    findSavedListings();
    findCreatedListings();
  }, []);

  return (
    <div>
      {userProfile && (
        <>
          <div>
            <h1>PROFIL</h1>
            <h2>Välkommen {userProfile.name}!</h2>
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

          {userProfile.isHost && (
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
