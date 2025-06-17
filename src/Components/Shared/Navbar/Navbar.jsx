import React, { useContext } from "react";
import logo from "../../../assets/career.png";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../../Contexts/AuthContext";
import Swal from "sweetalert2";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        Swal.fire({
          title: "Sign Out Successfully",
          icon: "success",
          draggable: true,
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-red-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-2">
        <Link to={"/"} className="flex items-center gap-2">
          <img src={logo} alt="" className="w-16" />
          <h1 className="text-2xl font-bold hidden md:inline">
            Career Roadmap
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user?.photoURL ? (
                <>
                  <img
                    className="w-8 rounded-full relative"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt=""
                  />
                  <img
                    className="w-8 rounded-full absolute"
                    src={user?.photoURL}
                    alt=""
                  />
                </>
              ) : (
                <>
                  <img
                    className="w-8 rounded-full"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="user-image"
                  />
                </>
              )}
              <button
                onClick={handleSignOut}
                className="btn bg-red-500 hover:bg-red-700 text-white"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to={"/sign-in"}
                className="btn bg-red-500 hover:bg-red-700 text-white"
              >
                <FaSignInAlt /> Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
