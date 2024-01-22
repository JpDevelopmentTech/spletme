import { useState } from "react";
import collaborator1 from '../../../assets/images/collaborator1.webp'
import collaborator2 from '../../../assets/images/collaborator2.jpg'
import collaborator3 from '../../../assets/images/collaborator3.jpg'
import collaborator4 from '../../../assets/images/collaborator4.webp'
import collaborator5 from '../../../assets/images/collaborator5.jpeg'
import collaborator6 from '../../../assets/images/collaborator6.jpeg'

import ImgCollaborator from "./components/imgCollaborator";
import AddCollaborator from "./components/addCollaborator";
import ImgTop from "./components/imgTop";
import Table from "./components/table";
export default function Collaborators() {
  const [typeMoney, setTypeMoney] = useState<"in" | "out">("in");
  const [collaboratorActive, setCollaboratorActive] = useState(0);
  const collaborators = [
    {
      img: collaborator1,
    },
    {
      img: collaborator2,
    },
    {
      img: collaborator3,
    },
    {
      img: collaborator4,
    },
    {
      img: collaborator5,
    },
    {
      img: collaborator6,
    },
  ];

  return (
    <div className="flex flex-col w-full animate-fade-left">
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

      <div className="grid grid-cols-12 gap-6 w-full mt-6">
        <div className="flex overflow-x-auto col-span-9 gap-3 w-full items-center">
          <button onClick={() => setCollaboratorActive(collaboratorActive - 1)}>
            👈
          </button>
          {collaborators.map((collaborator, index) => (
            <ImgCollaborator
              key={index}
              changeActive={() => setCollaboratorActive(index)}
              img={collaborator.img}
              active={collaboratorActive}
              index={index}
            />
          ))}
          <button onClick={() => setCollaboratorActive(collaboratorActive + 1)}>
            👉
          </button>
        </div>
        <AddCollaborator />
        <div className="col-span-3 flex flex-col items-center">
          <img
            src={collaborators[collaboratorActive]?.img}
            alt=""
            className="w-full h-36 object-cover rounded-lg z-20"
            id="activeImg"
          />
          <img
            src={
              collaborators[collaboratorActive + 1]?.img === undefined
                ? collaborators[0]?.img
                : collaborators[collaboratorActive + 1]?.img
            }
            alt=""
            className="w-[90%] h-36 object-cover rounded-lg -mt-28 z-10"
          />
          <img
            src={
              collaborators[collaboratorActive + 2]?.img === undefined
                ? collaborators[1]?.img
                : collaborators[collaboratorActive + 2]?.img
            }
            alt=""
            className="w-[80%] h-36 object-cover rounded-lg -mt-28"
          />
        </div>
        <ImgTop activeImg={collaborators[collaboratorActive]?.img} />
        <Table />
      </div>
    </div>
  );
}
