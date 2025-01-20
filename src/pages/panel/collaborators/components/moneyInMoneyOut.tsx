import { useState } from "react";

const MoneyInMoneyOut = () => {
  const [moneyIn, setMoneyIn] = useState(true);



  return (
    <div className="cursor-pointer font-light relative">
      <button
        onClick={() =>
          moneyIn ? setMoneyIn(false) : setMoneyIn(true)
        }
        className="flex gap-6 bg-gray-200 rounded-full px-6 py-2 w-[16rem]"
      >
        <label htmlFor="" className="w-1/2">
          Money In
        </label>
        <div
          className={
            moneyIn 
              ? "w-[7rem] absolute bg-gray-600 h-6 opacity-20 left-3 rounded-full translate-x-0 duration-500"
              : "w-[7rem] absolute bg-gray-600 h-6 opacity-20 left-2 rounded-full translate-x-[123px] duration-500"
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
