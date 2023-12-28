
export default function NavBar() {
  const navigateToId = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <div>
        <div className="grid grid-cols-12 gap-6 mt-6">
        <button className="col-span-3 p-6 border shadow-lg rounded-2xl hover:shadow-lg font-bold hover:scale-105 duration-200" onClick={() => navigateToId('behavior')}>
          Comportamiento
        </button>
        <button className="col-span-3 p-6 border shadow-lg rounded-2xl hover:shadow-lg font-bold hover:scale-105 duration-200" onClick={() => navigateToId('income')}>
          Ingresos
        </button>
        <button className="col-span-3 p-6 border shadow-lg rounded-2xl hover:shadow-lg font-bold hover:scale-105 duration-200 " onClick={() => navigateToId('high_performance')}>
          Mayor rendimiento
        </button>
        <button className="border rounded-2xl col-span-3 flex items-center justify-center gap-3 hover:scale-105 duration-200 shadow-lg">
          <div className="rounded-full w-10 h-10 bg-quinary text-white text-title">
            +
          </div>
          <div className="flex flex-col">
            <span className="text-subtitle font-bold">Agregar</span>
            <span className="text-normal">Distribuidor</span>
          </div>
        </button>
      </div>
    </div>
  )
}
