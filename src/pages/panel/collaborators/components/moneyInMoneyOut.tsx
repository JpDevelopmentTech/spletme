import { useState } from "react";

const MoneyInMoneyOut = () => {
  const [moneyIn, setMoneyIn] = useState(true);

  return (
    <div className="relative cursor-pointer font-light">
      <button
        onClick={() => (moneyIn ? setMoneyIn(false) : setMoneyIn(true))}
        className="flex w-[16rem] gap-6 rounded-full bg-gray-200 px-6 py-2"
      >
        <label htmlFor="" className="w-1/2">
          Money In
        </label>
        <div
          className={
            moneyIn
              ? "absolute left-3 h-6 w-[7rem] translate-x-0 rounded-full bg-gray-600 opacity-20 duration-500"
              : "absolute left-2 h-6 w-[7rem] translate-x-[123px] rounded-full bg-gray-600 opacity-20 duration-500"
          }
        ></div>
        <label htmlFor="" className="w-1/2">
          Money Out
        </label>
      </button>
    </div>
  );
};

export default MoneyInMoneyOut;
