import React from "react";
import { useLoader } from "../context/LoaderContext";
import Loader from "./Loader";

const GlobalLoader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Loader />
    </div>
  );
};

export default GlobalLoader;
