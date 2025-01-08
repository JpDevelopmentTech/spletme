import { Link } from "react-router-dom";

const Step3 = () => {
  return (
    <div>
      <svg
        className="w-12 h-12 mb-4 text-green-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 leding-tight dark:text-white">
        Verified
      </h1>
      <p className="mb-4 font-light text-gray-500 dark:text-gray-400 md:mb-6">
        You have successfully verified your account.
      </p>
      <Link to={'/panel/home'}
        className="block w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 sm:py-3.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Log in to your Account
      </Link>
    </div>
  );
};

export default Step3;
