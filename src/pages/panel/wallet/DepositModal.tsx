import { useState } from "react";
import { X, Download, Loader2, ExternalLink } from "lucide-react";
import WalletService from "@/services/wallet";

const CURRENCIES = ["USD", "EUR", "GBP", "COP", "MXN", "ARS", "BRL", "CLP"];
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CO", name: "Colombia" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AR", name: "Argentina" },
  { code: "BR", name: "Brazil" },
  { code: "CL", name: "Chile" },
];

interface Props {
  onClose: () => void;
}

export default function DepositModal({ onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("CO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await WalletService.createDeposit({
      amount: parsedAmount,
      currency,
      country,
    });

    setLoading(false);

    if (!res.error && res.data?.redirect_url) {
      window.open(res.data.redirect_url, "_blank");
      onClose();
    } else {
      setError(res.message ?? "Could not create checkout. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 flex w-full max-w-md flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <Download className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Deposit Funds
              </h2>
              <p className="text-xs text-gray-400">
                You'll be redirected to Rapyd to complete the payment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Amount
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#F7F8FA] px-3 py-2.5 transition-colors focus-within:border-orange-400 focus-within:bg-white">
              <span className="text-sm font-semibold text-gray-400">
                {currency}
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-300 outline-none"
              />
            </div>
          </div>

          {/* Currency + Country row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-[#F7F8FA] px-3 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-orange-400 focus:bg-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-[#F7F8FA] px-3 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-orange-400 focus:bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
            <p className="text-xs leading-relaxed text-blue-600">
              A Rapyd checkout page will open in a new tab. Complete the payment
              there and the balance will update automatically.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-500">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" /> Go to Checkout
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
