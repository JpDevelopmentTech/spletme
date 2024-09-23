import Title from "../../../../components/title/title";

const Accounts = () => {
    return (
        <div className="p-12 w-[500px] rounded-2xl border flex flex-col items-center justify-between">
            <Title title="Cuentas asociadas" subtitle="Mide el comportamiento de tus pagos"/>
            <div className="mt-6 flex flex-col gap-3">
                <div className="p-2 border rounded-2xl flex gap-3">
                    <img src="https://placehold.co/600x400" className="w-24 rounded-lg" alt="" />
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-xl">Paypal</span>
                        <span className="text-3xl font-normal">$2.000,45</span>
                    </div>
                </div>
                <div className="p-2 border rounded-2xl flex gap-3">
                    <img src="https://placehold.co/600x400" className="w-24 rounded-lg" alt="" />
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-xl">Paypal</span>
                        <span className="text-3xl font-normal">$2.000,45</span>
                    </div>
                </div>
                <div className="p-2 border rounded-2xl flex gap-3">
                    <img src="https://placehold.co/600x400" className="w-24 rounded-lg" alt="" />
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-xl">Paypal</span>
                        <span className="text-3xl font-normal">$2.000,45</span>
                    </div>
                </div>
            </div>
            <button className="px-6 py-3 text-white bg-[#FB8500] rounded-full mt-6">Ir a ajustes</button>
        </div>
    );
}

export default Accounts;
