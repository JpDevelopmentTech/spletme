import { useState } from "react";

const MoneyInMoneyOut = () => {
  const [moneyIn, setMoneyIn] = useState(true);

  const toogleSwitch = () => {
    setMoneyIn(!moneyIn);
    const toggleButton = document.getElementById("toggleButton");
    if (toggleButton) {
      toggleButton.style.transition = "transform 0.3s ease";
      if (moneyIn) {
        toggleButton.style.transform = "translateX(50%)";
        toggleButton.innerText = "Money out";
      } else {
        toggleButton.style.transform = "translateX(0)";
        toggleButton.innerText = "Money in";
      }
    }
  };

  return (
    <div
      className="flex bg-gray-300 gap-3 rounded-full relative w-48 cursor-pointer"
      onClick={toogleSwitch}
    >
      <div className="flex justify-between w-full">
        <span className={`p-2 ${moneyIn ? "text-black font-medium" : "text-black font-medium"}`}>
          Money in
        </span>
        <span className={`p-2 ${!moneyIn ? "text-black font-medium" : "text-black font-medium"}`}>
          Money out
        </span>
      </div>
      <div
        className="bg-secondary rounded-full p-2 absolute font-medium text-white"
        id="toggleButton"
        style={{ transform: moneyIn ? "translateX(0)" : "translateX(93%)" }}
      >
        {moneyIn ? "Money in" : "Money out"}
      </div>
    </div>
  );
};

export default MoneyInMoneyOut;
