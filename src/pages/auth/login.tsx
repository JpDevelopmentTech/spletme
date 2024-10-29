import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../../assets/images/2 - BLANCO.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/panel/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    await loginWithRedirect();
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center items-center">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-20 lg:py-16 lg:grid-cols-12 h-screnn">
        <div className="w-full place-self-center lg:col-span-6">
          <div className="p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
            <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm font-light text-gray-500 dark:text-gray-300">
              Start your website in seconds. Don’t have an account?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </a>
              .
            </p>
            <div className="mt-3">
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in to your account
              </button>
            </div>
          </div>
        </div>
        <div className="mr-auto place-self-center lg:col-span-6">
          <img
            className="hidden mx-auto lg:flex"
            src={logo}
            alt="illustration"
          />
        </div>
      </div>
    </section>
  );
}
