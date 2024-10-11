import { useState } from "react";
import Activity from "../components/activity";
import TableCollaborator from "../components/tableCollaborator";
import InfoCollaborator from "../components/infoCollaborator";
import Trafic from "../components/trafic";
import TotalPay from "../components/totalPay";

const Collaborator = () => {
  const [typeMoney, setTypeMoney] = useState<"in" | "out">("in");
  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-title font-bold">Colaboradores</span>
            <span className="text-subtitle">Organiza tus colaboradores</span>
          </div>
          <div className="bg-[#DEDEDE] rounded-full">
            <button
              onClick={() => setTypeMoney("in")}
              className={
                typeMoney === "in"
                  ? "p-3 rounded-full bg-[#219EBC] text-white"
                  : "p-3 rounded-full bg-[#DEDEDE] text-[#8A8A8A]"
              }
            >
              Money in
            </button>
            <button
              onClick={() => setTypeMoney("out")}
              className={
                typeMoney === "out"
                  ? "p-3 rounded-full bg-[#219EBC] text-white"
                  : "p-3 rounded-full bg-[#DEDEDE] text-[#8A8A8A]"
              }
            >
              Money Out
            </button>
          </div>
        </div>
     
      </div>
      <div className="grid grid-cols-12 gap-6">
        <InfoCollaborator />
        <TableCollaborator />
        <Activity />
        <Trafic />
        <TotalPay />
      </div>
    </div>
  );
};

export default Collaborator;
