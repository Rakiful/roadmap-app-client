import React, { useContext, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

export const SignIn = () => {
  const [showPassoword, setShowPassword] = useState(false);
  const { signInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSignin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const passwordRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (passwordRegExp.test(password) === false) {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "Wrong Password",
      });
      return;
    }

    signInUser(email, password)
      .then((result) => {
        console.log(result);
        Swal.fire({
          title: "User Logged in Successfully",
          icon: "success",
          draggable: true,
          showConfirmButton: false,
          timer: 2000,
        });
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
          <h1 className="text-5xl font-bold text-red-500">Sign In!</h1>
          <form onSubmit={handleSignin} className="fieldset">
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
              Sign In
            </button>
          </form>
          <p>
            don't have an account ?
            <Link className="text-blue-700 link" to={"/sign-up"}>
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
