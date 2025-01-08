const Step1 = ({ nextStep }: { nextStep: () => void }) => {
  const professions = [
    "singer",
    "producer",
    "writer",
    "actor",
  ];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:mb-6 dark:text-white">
        Cuentanos sobre ti
      </h1>
      <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
        Cual es tu profesion?
      </p>
      <ul className="mb-6 space-y-4 sm:space-y-6">
        {professions.map((profession) => (
          <li key={profession}>
            <input
              type="radio"
              id={profession}
              name="profession"
              value={profession}
              className="hidden peer"
              required
            />
            <label
              htmlFor={profession}
              className="inline-flex items-center justify-center w-full p-5 text-gray-500 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary peer-checked:text-primary bg-gray-50 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="w-full">I'm a {profession}</span>
              <svg
                className="w-6 h-6 ml-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={nextStep}
        className="w-full px-5 py-2.5 sm:py-3.5 text-sm font-medium text-center text-white rounded-lg bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Next: Account Info
      </button>
    </div>
  );
};

export default Step1;
