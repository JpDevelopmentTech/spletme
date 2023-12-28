import Title from "../../../../components/title/title";

export default function Income() {
  return (
    <div id="income" className="col-span-3 p-6 rounded-2xl shadow-lg hover:scale-105 duration-200">
      <div className="flex justify-between items-center">
        <Title title="Ingresos" subtitle="Analisis por distribuidor" />
        <div></div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-center border-b border-dotted py-3">
          <div className="flex flex-col">
            <span className="text-subtitle font-bold">Distribuidor 1</span>
            <span className="text-normal">Dinero generado</span>
            <span className="text-subtitle text-quinary font-bold">$00,00</span>
          </div>
          <span className="text-normal">🟠 Disponible</span>
        </div>
        <div className="flex justify-between items-center border-b border-dotted py-3">
          <div className="flex flex-col">
            <span className="text-subtitle font-bold">Distribuidor 1</span>
            <span className="text-normal">Dinero generado</span>
            <span className="text-subtitle text-quinary font-bold">$00,00</span>
          </div>
          <span className="text-normal">🟠 Disponible</span>
        </div>
        <div className="flex justify-between items-center border-b border-dotted py-3">
          <div className="flex flex-col">
            <span className="text-subtitle font-bold">Distribuidor 1</span>
            <span className="text-normal">Dinero generado</span>
            <span className="text-subtitle text-quinary font-bold">$00,00</span>
          </div>
          <span className="text-normal">🟠 Disponible</span>
        </div>
        <div className="flex justify-between items-center border-b border-dotted py-3">
          <div className="flex flex-col">
            <span className="text-subtitle font-bold">Distribuidor 1</span>
            <span className="text-normal">Dinero generado</span>
            <span className="text-subtitle text-quinary font-bold">$00,00</span>
          </div>
          <span className="text-normal">🟠 Disponible</span>
        </div>
      </div>
    </div>
  );
}
