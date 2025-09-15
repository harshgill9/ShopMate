import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DeleteAccount = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!user || !token) {
      toast.error("User not logged in!");
      return;
    }

    try {
      // ✅ correct
      const res = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      toast.success("Account deleted successfully");
      logout();  
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Are you sure you want to delete your account?</h2>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete My Account
      </button>
    </div>
  );
};

export default DeleteAccount;
