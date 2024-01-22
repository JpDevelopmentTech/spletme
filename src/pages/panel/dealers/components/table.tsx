import ImageProfile from "../../../../components/imageprofile/imageprofile";
import image from '../../../../assets/images/collaborator6.jpeg'

const dealers = [
  {
    id: 1,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  {
    id: 2,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  {
    id: 3,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  {
    id: 4,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  {
    id: 5,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  {
    id: 6,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  {
    id: 7,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  {
    id: 8,
    name: "Nombre de la distribuidora",
    date: "Junio 12, 2021",
    songs: 3,
    performance: "0%",
    collaborators: 4,
    owner: true,
    guest: true,
    lastLogin: "Junio 12, 2021",
  },
  
];

export default function Table() {
  return (
    <div>
      <div className="flex justify-end mt-10 items-center gap-3">
        <div className="flex gap-6">
          <select name="" id="" className="font-bold text-subtitle">
            <option value="">Filtrar por fecha</option>
          </select>
          <button className="text-subtitle font-bold">Descargar</button>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="">
            <th className="text-left p-3 text-normal   bg-[#E9E9E9] ">
              Distribuidor
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Canciones
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Rendimiento
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Colaboradores
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Propietario
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Invitado
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Ultimo ingreso
            </th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer) => (
            <tr className="border-b-2" key={dealer.id}>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 rounded-lg w-10 bg-septenary">
                    <img
                      src={image}
                      className="w-full h-full object-cover rounded-lg"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-subtitle font-bold">
                      {dealer.name}
                    </span>
                    <span className="text-normal">{dealer.date}</span>
                  </div>
                </div>
              </td>

              <td className="p-3 text-subtitle text-center">{dealer.songs}</td>
              <td className="p-3 text-subtitle text-center">{dealer.performance}</td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center">
                  <ImageProfile />
                  <ImageProfile />
                  <ImageProfile />
                  <ImageProfile />
                </div>
              </td>
              <td className="p-3 text-center text-subtitle">✅ | ✖️</td>
              <td className="p-3 text-center text-subtitle">✅ | ✖️</td>
              <td className="p-3 text-center text-subtitle">Junio 12, 2021</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
