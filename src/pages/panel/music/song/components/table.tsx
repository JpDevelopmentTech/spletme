import img from '../../../../../assets/images/collaborator3.jpg'
export default function Table() {
  return (
    <table className="col-span-12">
      <thead>
        <tr>
          <th>Colaborador</th>
          <th>Generado total</th>
          <th>Porcentaje</th>
          <th>Rol</th>
          <th>Metodo de pago</th>
          <th>Pendiente por pagar</th>
        </tr>
      </thead>
      <tbody>
        <tr className="shadow-lg rounded-full w-full">
          <td className="p-3">
            <div className='flex items-center gap-3'>
                <img src={img} alt=""  className='w-12 h-12 rounded-full'/>
                <span className='font-bold text-subtitle'>JK Escorcia</span>
            </div>
          </td>
          <td className="p-6 text-center border-l font-bold">$1.000,00</td>
          <td className="p-6 text-center border-l font-bold">50%</td>
          <td className="p-6 text-center border-l font-bold">Artista</td>
          <td className="p-6 text-center border-l font-bold">Believe</td>
          <td className="p-6 text-center border-l">
            <button className="bg-secondary text-white p-2 rounded-full w-full font-bold">$350,00</button>
          </td>
        </tr>
        <tr className="shadow-lg rounded-full w-full">
          <td className="p-3">
            <div className='flex items-center gap-3'>
                <img src={img} alt=""  className='w-12 h-12 rounded-full'/>
                <span className='font-bold text-subtitle'>JK Escorcia</span>
            </div>
          </td>
          <td className="p-6 text-center border-l font-bold">$1.000,00</td>
          <td className="p-6 text-center border-l font-bold">50%</td>
          <td className="p-6 text-center border-l font-bold">Artista</td>
          <td className="p-6 text-center border-l font-bold">Believe</td>
          <td className="p-6 text-center border-l">
            <button className="bg-quinary text-white p-2 rounded-full w-full font-bold">$350,00</button>
          </td>
        </tr>
        <tr className="shadow-lg rounded-full w-full">
          <td className="p-3">
            <div className='flex items-center gap-3'>
                <img src={img} alt=""  className='w-12 h-12 rounded-full'/>
                <span className='font-bold text-subtitle'>JK Escorcia</span>
            </div>
          </td>
          <td className="p-6 text-center border-l font-bold">$1.000,00</td>
          <td className="p-6 text-center border-l font-bold">50%</td>
          <td className="p-6 text-center border-l font-bold">Artista</td>
          <td className="p-6 text-center border-l font-bold">Believe</td>
          <td className="p-6 text-center border-l">
            <button className="bg-quinary text-white p-2 rounded-full w-full font-bold">$350,00</button>
          </td>
        </tr>
        <tr className="shadow-lg rounded-full w-full">
          <td className="p-3">
            <div className='flex items-center gap-3'>
                <img src={img} alt=""  className='w-12 h-12 rounded-full'/>
                <span className='font-bold text-subtitle'>JK Escorcia</span>
            </div>
          </td>
          <td className="p-6 text-center border-l font-bold">$1.000,00</td>
          <td className="p-6 text-center border-l font-bold">50%</td>
          <td className="p-6 text-center border-l font-bold">Artista</td>
          <td className="p-6 text-center border-l font-bold">Believe</td>
          <td className="p-6 text-center border-l">
            <button className="bg-senary text-black p-2 rounded-full w-full font-bold">$00,00</button>
          </td>
        </tr>
        
      </tbody>
    </table>
  );
}
