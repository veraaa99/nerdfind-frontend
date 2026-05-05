const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-between bg-black/50 pt-5">
      <div className="container flex flex-col mx-auto gap-2 p-5">
        <p className="text-center">
          Välkommen till Nerdfind Sverige! Utforska, hitta och spara annonser
          relaterade till dina intressen.
        </p>
        <p className="text-center">
          Är du en arrangör intresserad av att dela din verksamhet? Skapa ett
          företagskonto och skapa en annons idag!
        </p>
      </div>
      <div className="container mx-auto flex flex-col justify-center p-5">
        <p className="text-center font-bold">2026 - Vera Althini</p>
      </div>
    </div>
  );
};
export default Footer;
