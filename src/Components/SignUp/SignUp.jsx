import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

export const SignUp = () => {
  const [showPassoword, setShowPassword] = useState(false);
  const { createUser, userProfileUpdate } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const photo = e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (passwordRegExp.test(password) === false) {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "Password must include at least 1 uppercase, 1 lowercase letter, and be at least 6 characters long.",
      });
      return;
    }

    createUser(email, password)
      .then((result) => {
        console.log(result.user);
        Swal.fire({
          title: "SignUp Successfully",
          icon: "success",
          draggable: true,
          showConfirmButton: false,
          timer: 2000,
        });
        if (name || photo) {
          userProfileUpdate({
            displayName: name,
            photoURL: photo,
          });
        }
        // setLoading(false);
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  return (
    <div className="flex justify-center my-20">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <h1 className="text-5xl font-bold text-red-500">Sign Up!</h1>
          <form onSubmit={handleSignUp} className="fieldset">
            <label className="label">Name</label>
            <input
              required
              type="text"
              name="name"
              className="input"
              placeholder="name"
            />
            <label className="label">Photo URL</label>
            <input
              required
              type="text"
              name="photo"
              className="input"
              placeholder="Photo URL"
            />
            <label className="label">Email</label>
            <input
              required
              type="email"
              name="email"
              className="input"
              placeholder="Email"
            />
            <label className="label">Password</label>
            <div className="relative">
              <input
                required
                type={showPassoword ? "text" : "password"}
                name="password"
                className="input"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassoword)}
                className="btn btn-xs absolute top-2 right-6"
              >
                {showPassoword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className="btn bg-red-500 hover:bg-red-700 text-white mt-4">
              Sign Up
            </button>
          </form>
          <p>
            Already have an account ?{" "}
            <Link className="text-blue-700 link" to={"/sign-in"}>
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
