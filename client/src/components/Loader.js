import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-70 z-50">
      {/* Multi-color loader */}
      <div className="animate-spin rounded-full h-40 w-40 border-t-8 border-b-8 border-transparent"
        style={{
          borderTopColor: "#7c3aed",   // Purple
          borderRightColor: "#ec4899", // Pink
          borderBottomColor: "#f59e0b",// Amber
          borderLeftColor: "#3b82f6",  // Blue
        }}
      ></div>
    </div>
  );
};

export default Loader;
