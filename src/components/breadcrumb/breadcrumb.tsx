import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
    const [sections, setSections] = useState<string[]>();
    useEffect(() => {
        getSectionsOnUrl()
    }, [])

    const getSectionsOnUrl = () => {
        const url = window.location.href;
        const sections = url.split('/');
        //agregar desde la posicion 3 porque las primeras 3 posiciones son el protocolo, el dominio y el puerto
        setSections(sections.slice(4))
    }
  return (
    <div className="flex gap-2 items-center">
      <Link to={'/panel/home'}><svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="stroke-[#6f6f6f] w-6"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M10 12h4v4h-4z" />
      </svg></Link>
      {sections?.map((section) => (
        <Link className="text-gray-400 capitalize" to={'/panel/' + section}>{section} /</Link>
      ))}
    </div>
  );
};

export default Breadcrumb;
