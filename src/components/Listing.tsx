type ListingProps = {
  listing: Listing;
};

const Listing = ({ listing }: ListingProps) => {
  return (
    <div>
      <h1>{listing.title}</h1>

      <div>
        <img
          src={listing.images[0].url}
          alt={listing.images[0].alt}
          className="w-3xl"
        />
      </div>

      <p>{listing.type}</p>
      <p>{listing.location.city}</p>

      <h2>BESKRIVNING</h2>
      <p>{listing.description}</p>

      {listing.date ? (
        <>
          <h3>TIDER & DATUM</h3>
          <p>
            {listing.date.toLocaleDateString("sv-SE", {
              weekday: "long",
              day: "numeric",
              year: "numeric",
              month: "long",
            })}{" "}
            (
            {listing.date.getFullYear() +
              "-" +
              (listing.date.getMonth() + 1) +
              "-" +
              listing.date.getDate()}
            )
          </p>

          <p>
            {listing.openingHours.map((day) =>
              day.times.start == "STÄNGT" ? (
                <p>
                  {day.day}: {day.times.start}
                </p>
              ) : (
                <p>
                  {day.day}: {day.times.start} - {day.times.end}
                </p>
              ),
            )}
          </p>
        </>
      ) : (
        <>
          <h3>TIDER</h3>

          {listing.openingHours.map((day) =>
            day.times.start == "STÄNGT" ? (
              <p>
                {day.day}: {day.times.start}
              </p>
            ) : (
              <p>
                {day.day}: {day.times.start} - {day.times.end}
              </p>
            ),
          )}
        </>
      )}

      <h3>PLATS</h3>
      <p></p>

      <h3>ARRANGÖR: {listing.host.name}</h3>
      {listing.website && (
        <>
          {" "}
          <h4>HEMSIDA:</h4> <p>{listing.website}</p>{" "}
        </>
      )}
    </div>
  );
};
export default Listing;
