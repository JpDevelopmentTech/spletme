import ImageProfile from "../../../../components/imageprofile/imageprofile";
import image from '../../.././../assets/images/collaborator6.jpeg'

export default function Table() {
  return (
    <div className='col-span-12'>
        <table className="w-full">
            <thead>
              <tr className="">
                <th className="text-left p-3 text-normal   bg-[#E9E9E9] ">
                  Cancion
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Porcentaje
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Colaboradores
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Propietario
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Distribuidor
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Fecha de lanzamiento
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 ">
                      <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />

                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    
                    <ImageProfile />
                    
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">
                  ✅ | 🚫 | 🕓
                </td>
              </tr>
              
            </tbody>
          </table>
    </div>
  )
}
