import Title from "../../../../components/title/title";

const Accounts = () => {
    return (
        <div className="p-3 rounded-2xl border flex flex-col items-center justify-between col-span-3">
            <Title title="Cuentas asociadas" subtitle="Mide el comportamiento de tus pagos"/>
            <div className="mt-6 flex flex-col gap-3">
                <div className="p-2 border rounded-2xl flex gap-3">
                    <img src="https://placehold.co/600x400" className="w-24 rounded-lg" alt="" />
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-sm">Paypal</span>
                        <span className="text-xl font-normal">$2.000,45</span>
                    </div>
                </div>
                <div className="p-2 border rounded-2xl flex gap-3">
                    <img src="https://placehold.co/600x400" className="w-24 rounded-lg" alt="" />
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-sm">Paypal</span>
                        <span className="text-xl font-normal">$2.000,45</span>
                    </div>
                </div>
                <div className="p-2 border rounded-2xl flex gap-3">
                    <img src="https://placehold.co/600x400" className="w-24 rounded-lg" alt="" />
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-sm">Paypal</span>
                        <span className="text-xl font-normal">$2.000,45</span>
                    </div>
                </div>
            </div>
            <button className="px-6 py-3 text-white bg-[#FB8500] rounded-full mt-6">Ir a ajustes</button>
        </div>
    );
}

export default Accounts;
