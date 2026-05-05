import axios from "@/api/axios";
import ListingCardSmall from "@/components/ListingCardSmall";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

const Profile = () => {
  const { user, token, actions } = useAuth();

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [userCreatedListings, setUserCreatedListings] = useState<Listing[]>([]);

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;

      setLoading(true);

      try {
        // getUserByID:
        const userRes = await axios.get(`/api/users/${user}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (userRes.status !== 200) return;

        const userData = userRes.data;
        setUserProfile(userData);

        // findCreatedListings:
        if (userData.isHost) {
          const createdRes = await axios.get("api/listings/createdListings", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          if (createdRes.status == 200) {
            setUserCreatedListings(createdRes.data);
          }
        }

        // findSavedListings
        if (userData.savedListings?.length) {
          const savedRes = await axios.get("api/listings/savedlistings", {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          if (savedRes.status == 200) {
            setSavedListings(savedRes.data);
          }
        }
      } catch (error: any) {
        console.log(error.response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user, token, location.key]);

  const handleLogout = () => {
    actions.logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <div className="mx-auto md:max-w-6xl p-10">
      {userProfile && (
        <>
          <div className="h-50 flex flex-col justify-center align-center items-center md:items-start">
            <h1 className="text-shadow-lg/50">PROFIL</h1>
            {loading && <p>Laddar användare...</p>}
            <h2>Välkommen {userProfile.name}!</h2>
          </div>

          <hr className="divide-solid border-green-300 mt-8 md:mb-5" />

          <div>
            <h3 className="mb-4 text-center md:text-left">SPARADE ANNONSER</h3>
            {loading && (
              <p className="text-center md:text-left">
                Laddar sparade annonser...
              </p>
            )}

            {savedListings.length == 0 ? (
              <div>
                <p className="text-center md:text-left">
                  Du har inga sparade annonser just nu.
                </p>
              </div>
            ) : (
              <div className="flex items-center align-center justify-center flex-wrap gap-10 md:justify-start md:items-start">
                {savedListings.map((listing) => (
                  <ListingCardSmall key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </div>

          <hr className="divide-solid border-green-300 mt-8 md:mb-5" />

          {userProfile.isHost && (
            <>
              <h3 className="my-4 text-center md:text-left">
                SKAPADE ANNONSER
              </h3>
              {loading && (
                <p className="text-center md:text-left">
                  Laddar skapade annonser...
                </p>
              )}

              <div>
                {userCreatedListings.length == 0 ? (
                  <div>
                    <p className="text-center md:text-left">
                      Du har inte skapat några annonser än.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center align-center justify-center flex-wrap gap-10 md:justify-start md:items-start">
                    {userCreatedListings.map((listing) => (
                      <ListingCardSmall key={listing._id} listing={listing} />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 border border-emerald-500 rounded-md p-8 mt-7 items-center md:items-start">
                <h3 className="text-center md:text-left">
                  Vill du skapa en ny annons till ditt event, din butik eller
                  loppis? Gör det här!
                </h3>
                <NavLink
                  className="p-2 pl-5 rounded-md cursor-pointer border-2 border-emerald-500 w-50 bg-green-800 text-white hover:bg-green-500/60 hover:border-emerald-700  transition duration-300 ease-in-out;"
                  to="/host/createListing"
                >
                  {" "}
                  SKAPA NY ANNONS
                </NavLink>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2 py-5 mt-7 items-center md:items-start">
            <a
              className="w-full text-center p-3 rounded-md cursor-pointer border-2 border-red-900 sm:w-40 bg-red-500/80 hover:bg-red-500 text-white transition duration-300 ease-in-out;"
              onClick={handleLogout}
            >
              LOGGA UT
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
