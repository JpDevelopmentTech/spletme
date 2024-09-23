import { Link } from "react-router-dom";
import ImageProfile from "../../../../components/imageprofile/imageprofile";
import image from "../../.././../assets/images/collaborator6.jpeg";

export default function Table() {
  return (
    <div className="col-span-12">
      <table className="w-full">
        <thead>
          <tr className="">
            <th className="text-left p-3 text-normal   bg-[#E9E9E9] ">
              Colaborador
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Canciones
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Rendimiento
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Distribuidores
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Propietario
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Invitado
            </th>
            <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
              Ultimo pago
            </th>
          </tr>
        </thead>
        <tbody>
       
          <tr className="border-b-2">
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 rounded-lg w-10 ">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <Link to={'/panel/collaborators/' + '12345'} className="text-subtitle font-bold">
                    Nombre del colaborador
                  </Link>
                  <span className="text-normal">Nombre del colaborador</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-subtitle text-center">5</td>
            <td className="p-3 text-subtitle text-center">20%</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
              </div>
            </td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">🚫</div>
            </td>
            <td className="p-3 text-center text-subtitle">$00,00</td>
          </tr>
          <tr className="border-b-2">
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 rounded-lg w-10 ">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <Link to={'/panel/collaborators/' + '12345'} className="text-subtitle font-bold">
                    Nombre del colaborador
                  </Link>
                  <span className="text-normal">Nombre del colaborador</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-subtitle text-center">5</td>
            <td className="p-3 text-subtitle text-center">20%</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
              </div>
            </td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">🚫</div>
            </td>
            <td className="p-3 text-center text-subtitle">$00,00</td>
          </tr>
          <tr className="border-b-2">
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 rounded-lg w-10 ">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <Link to={'/panel/collaborators/' + '12345'} className="text-subtitle font-bold">
                    Nombre del colaborador
                  </Link>
                  <span className="text-normal">Nombre del colaborador</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-subtitle text-center">5</td>
            <td className="p-3 text-subtitle text-center">20%</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
              </div>
            </td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">🚫</div>
            </td>
            <td className="p-3 text-center text-subtitle">$00,00</td>
          </tr>
          <tr className="border-b-2">
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 rounded-lg w-10 ">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <Link to={'/panel/collaborators/' + '12345'} className="text-subtitle font-bold">
                    Nombre del colaborador
                  </Link>
                  <span className="text-normal">Nombre del colaborador</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-subtitle text-center">5</td>
            <td className="p-3 text-subtitle text-center">20%</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
              </div>
            </td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">🚫</div>
            </td>
            <td className="p-3 text-center text-subtitle">$00,00</td>
          </tr>
          <tr className="border-b-2">
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 rounded-lg w-10 ">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <Link to={'/panel/collaborators/' + '12345'} className="text-subtitle font-bold">
                    Nombre del colaborador
                  </Link>
                  <span className="text-normal">Nombre del colaborador</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-subtitle text-center">5</td>
            <td className="p-3 text-subtitle text-center">20%</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
              </div>
            </td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">🚫</div>
            </td>
            <td className="p-3 text-center text-subtitle">$00,00</td>
          </tr>
          <tr className="border-b-2">
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 rounded-lg w-10 ">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <Link to={'/panel/collaborators/' + '12345'} className="text-subtitle font-bold">
                    Nombre del colaborador
                  </Link>
                  <span className="text-normal">Nombre del colaborador</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-subtitle text-center">5</td>
            <td className="p-3 text-subtitle text-center">20%</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
              </div>
            </td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">🚫</div>
            </td>
            <td className="p-3 text-center text-subtitle">$00,00</td>
          </tr>
          <tr className="border-b-2">
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 rounded-lg w-10 ">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <Link to={'/panel/collaborators/' + '12345'} className="text-subtitle font-bold">
                    Nombre del colaborador
                  </Link>
                  <span className="text-normal">Nombre del colaborador</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-subtitle text-center">5</td>
            <td className="p-3 text-subtitle text-center">20%</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
                <ImageProfile />
              </div>
            </td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center">🚫</div>
            </td>
            <td className="p-3 text-center text-subtitle">$00,00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
