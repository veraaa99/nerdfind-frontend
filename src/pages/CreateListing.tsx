import CreateListingForm from "@/components/CreateListingForm";
import { useEffect } from "react";

const CreateListing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto md:max-w-5xl p-10 ">
      <div className="h-50 flex justify-center align-center items-center">
        <h1 className="text-shadow-lg/50">SKAPA ANNONS</h1>
      </div>
      <CreateListingForm />
    </div>
  );
};

export default CreateListing;
