import { CreditCard, ArrowUpRight, ArrowDownLeft, Wallet, DollarSign, Clock, Zap, AlertTriangle, RefreshCw } from "lucide-react";
import PaymentHistory from "@/components/PaymentHistory/PaymentHistory";
import PaymentHistoryReceived from "@/components/PaymentHistory/PaymentHistoryReceived";
import stripe from "@/services/stripe";
import { useValidateOnboardingStripe } from "@/hooks/useValidateOnboardingStripe";
import { useCheckStatusStripeAccount } from "@/hooks/useCheckStatusStripeAccount";
import { useGetBalance } from "@/hooks/usegetBalance";

const Payments = () => {
  useValidateOnboardingStripe()
  const { status } = useCheckStatusStripeAccount()
  const { balance, isLoading, error, refetch } = useGetBalance()
  
  const connectStripeAccount = async () => {
    const response = await stripe.connectStripeAccount()
    window.location.href = response.data.onboardingUrl
  }

  // Format balance to currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100); // Stripe amounts are in cents
  };

  // Component for balance card
  const BalanceCard = ({ 
    title, 
    amount, 
    currency, 
    icon: Icon, 
    iconColor, 
    bgColor, 
    description 
  }: {
    title: string;
    amount: number;
    currency: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    bgColor: string;
    description: string;
  }) => (
    <div className={`${bgColor} rounded-xl p-4 border shadow-sm`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {formatCurrency(amount, currency)}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        {!status.data.isReady && (
          <div className="flex justify-between items-center">
          <div className="mb-4">
            <button onClick={connectStripeAccount} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
              <CreditCard className="w-4 h-4 mr-2" />
              Conectar Cuenta Stripe
            </button>
          </div>
        </div>
        )}

        {/* Balance Section */}
        {status.data.isReady && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Balance de Stripe
                    </h3>
                    <p className="text-sm text-gray-600">
                      Estado completo de tu cuenta
                    </p>
                  </div>
                </div>
                <button
                  onClick={refetch}
                  className="inline-flex items-center px-3 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">Cargando balance...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12 text-red-600">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  <span>Error al cargar el balance: {error}</span>
                </div>
              ) : balance ? (
                <div className="space-y-6">
                  {/* Main Balance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {balance.available.map((item, index) => (
                      <BalanceCard
                        key={`available-${index}`}
                        title="Disponible"
                        amount={item.amount}
                        currency={item.currency}
                        icon={DollarSign}
                        iconColor="bg-gradient-to-br from-green-500 to-emerald-600"
                        bgColor="bg-white border-green-200"
                        description="Listo para retirar"
                      />
                    ))}
                    
                    {balance.instant_available.map((item, index) => (
                      <BalanceCard
                        key={`instant-${index}`}
                        title="Disponible Instantáneo"
                        amount={item.amount}
                        currency={item.currency}
                        icon={Zap}
                        iconColor="bg-gradient-to-br from-yellow-500 to-orange-600"
                        bgColor="bg-white border-yellow-200"
                        description="Acceso inmediato"
                      />
                    ))}
                    
                    {balance.pending.map((item, index) => (
                      <BalanceCard
                        key={`pending-${index}`}
                        title="Pendiente"
                        amount={item.amount}
                        currency={item.currency}
                        icon={Clock}
                        iconColor="bg-gradient-to-br from-blue-500 to-indigo-600"
                        bgColor="bg-white border-blue-200"
                        description="En proceso"
                      />
                    ))}
                  </div>

                  {/* Refund and Dispute Section */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Reembolsos y Disputas
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Available for Refunds */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700">Disponible para Reembolsos</h5>
                        {balance.refund_and_dispute_prefunding.available.map((item, index) => (
                          <div key={`refund-available-${index}`} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{item.currency.toUpperCase()}</span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(item.amount, item.currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pending Refunds */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700">Reembolsos Pendientes</h5>
                        {balance.refund_and_dispute_prefunding.pending.map((item, index) => (
                          <div key={`refund-pending-${index}`} className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{item.currency.toUpperCase()}</span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(item.amount, item.currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${balance.livemode ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-gray-600">
                          Modo: {balance.livemode ? 'Producción' : 'Pruebas'}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        Última actualización: {new Date().toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
        
        {/* Stripe Integration Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Historial de Pagos
                </h3>
                <p className="text-sm text-gray-600">
                  Gestiona tus pagos enviados y recibidos
                </p>
              </div>
            </div>

            {/* Payment History Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pagos Realizados */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-lg font-medium text-gray-900">
                    Pagos Enviados
                  </h4>
                </div>
                <PaymentHistory showTitle={false} maxHeight="400px" />
              </div>

              {/* Pagos Recibidos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  <h4 className="text-lg font-medium text-gray-900">
                    Pagos Recibidos
                  </h4>
                </div>
                <PaymentHistoryReceived showTitle={false} maxHeight="400px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
