import axios from "@/api/axios";
import Listing from "@/components/Listing";
import ListingCardSmall from "@/components/ListingCardSmall";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

const Profile = () => {
  const { user, token } = useAuth();

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [userCreatedListings, setUserCreatedListings] = useState<Listing[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserById = async () => {
      if (!user) return;

      setLoading(true);

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

    const findCreatedListings = async () => {
      if (!userProfile?.isHost) return;

      const res = await axios.get("api/listings/createdListings", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) return;

      setUserCreatedListings(res.data);
    };

    const findSavedListings = async () => {
      if (!userProfile?.savedListings?.length) return;

      const res = await axios.get("api/listings/savedlistings", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) return;

      setSavedListings(res.data);
    };

    getUserById();
    findCreatedListings();
    findSavedListings();
    setLoading(false);
  }, [userProfile]);

  return (
    <div>
      {userProfile && (
        <>
          <div>
            <h1>PROFIL</h1>
            {loading && <p>Laddar användare...</p>}
            <h2>Välkommen {userProfile.name}!</h2>
          </div>

          <div>
            <h3>SPARADE ANNONSER</h3>
            {loading && <p>Laddar sparade annonser...</p>}

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
              {loading && <p>Laddar skapade annonser...</p>}

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

              <div className="flex flex-col gap-2">
                <h3>
                  Vill du skapa en ny annons till ditt event, din butik eller
                  loppis? Gör det här!
                </h3>
                <NavLink
                  className="w-50 cursor-pointer relative gap-2 text-center rounded-sm py-2 bg-white text-black hover:bg-green-800 hover:text-white"
                  to="/host/createListing"
                >
                  {" "}
                  SKAPA NY ANNONS
                </NavLink>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
