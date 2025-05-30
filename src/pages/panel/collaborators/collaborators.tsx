import { useState } from "react";
import collaborator1 from "../../../assets/images/collaborator1.webp";
import collaborator2 from "../../../assets/images/collaborator2.jpg";
import collaborator3 from "../../../assets/images/collaborator3.jpg";
import collaborator4 from "../../../assets/images/collaborator4.webp";
import collaborator5 from "../../../assets/images/collaborator5.jpeg";
import collaborator6 from "../../../assets/images/collaborator6.jpeg";

import ImgCollaborator from "./components/imgCollaborator";
import AddCollaborator from "./components/addCollaborator";
import ImgTop from "./components/imgTop";
import Table from "./components/table";
import MoneyInMoneyOut from "./components/moneyInMoneyOut";

export default function Collaborators() {
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
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-title font-bold">Colaboradores</span>
            <span className="text-subtitle">Organiza tus colaboradores</span>
          </div>
          <MoneyInMoneyOut />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 w-full mt-6">
        <div className="flex overflow-x-auto col-span-9 gap-3 w-full items-center">
          <button
            className="bg-senary rounded-full p-1"
            onClick={() => setCollaboratorActive(collaboratorActive - 1)}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 19-7-7 7-7"
              />
            </svg>
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
          <button
            className="bg-senary rounded-full p-1"
            onClick={() => setCollaboratorActive(collaboratorActive + 1)}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m9 5 7 7-7 7"
              />
            </svg>
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
