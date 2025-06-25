import Highcost from "./components/highcost";
import Pay from "./components/pay";
import Accounts from "./components/accounts";
import Historyofpays from "./components/historyofpays";
import PayoneerDashboard from "../../../components/payoneer/PayoneerDashboard";

const Payments = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        

        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pagos entre Usuarios
            </h2>
            <p className="text-gray-600">
              Envía y recibe pagos directamente con otros usuarios de Payoneer de forma gratuita e instantánea
            </p>
          </div>
          
          <PayoneerDashboard />
        </div>

        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="col-span-6">
            <Highcost />
          </div>
          <div className="col-span-6">
            <Pay />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-6">
            <Accounts />
          </div>
          <div className="col-span-6">
            <Historyofpays />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
