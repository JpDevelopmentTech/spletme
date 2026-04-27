import { useEffect, useState } from "react";
import {
  Wallet,
  Download,
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Loader2,
} from "lucide-react";
import WalletService from "@/services/wallet";
import DepositModal from "./DepositModal";

interface WalletAccount {
  balance: number;
  currency: string;
  received_balance?: number;
  on_hold_balance?: number;
}

interface WalletData {
  id: string;
  status: string;
  accounts?: WalletAccount[];
  first_name?: string;
  last_name?: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  subtype?: string;
  balance_type?: string;
  balance?: number;
  created_at: number;
  source_ewallet_id?: string;
  destination_ewallet_id?: string;
  metadata?: Record<string, unknown>;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Download }> = {
  payment:      { label: "Deposit",  color: "#1D4ED8", bg: "#EFF6FF", icon: Download },
  transfer:     { label: "Transfer", color: "#6D28D9", bg: "#F5F3FF", icon: ArrowRightLeft },
  payout:       { label: "Withdraw", color: "#DC2626", bg: "#FFF1F2", icon: Upload },
  refund:       { label: "Refund",   color: "#0369A1", bg: "#E0F2FE", icon: Download },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? { label: type, color: "#374151", bg: "#F3F4F6", icon: Download };
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatAmount(amount: number, currency: string, type: string) {
  const sign = ["payment", "refund"].includes(type) ? "+" : "-";
  const color = sign === "+" ? "#16A34A" : "#EF4444";
  return { text: `${sign}${currency} ${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color };
}

const PAGE_SIZE = 10;

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showDeposit, setShowDeposit] = useState(false);

  useEffect(() => {
    WalletService.getWallet().then((res) => {
      if (!res.error && res.data) {
        setWallet(res.data as WalletData);
      } else {
        setWalletError(res.message ?? "Could not load wallet");
      }
      setLoadingWallet(false);
    });
    WalletService.getTransactions(1, 100).then((res) => {
      if (!res.error && res.data) setTransactions(res.data as Transaction[]);
      setLoadingTx(false);
    });
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesSearch =
      !search ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase()) ||
      tx.currency.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const accounts = wallet?.accounts ?? [];

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-10 flex flex-col gap-6">
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-sm text-gray-500">Your Rapyd wallet balances and transaction history</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Withdraw
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <ArrowRightLeft className="w-4 h-4" />
            Transfer
          </button>
          <button
            onClick={() => setShowDeposit(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Deposit
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loadingWallet ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-24 animate-pulse" />
          ))
        ) : walletError ? (
          <div className="col-span-4 bg-white rounded-xl border border-red-100 p-6 flex items-center gap-3 text-red-400">
            <Wallet className="w-5 h-5" />
            <span className="text-sm">{walletError}</span>
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">USD</span>
              <Wallet className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-xl font-bold text-gray-900">0.00</span>
            <span className="text-xs text-gray-400">No funds deposited yet</span>
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.currency} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{acc.currency}</span>
                <Wallet className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              {acc.on_hold_balance !== undefined && acc.on_hold_balance > 0 && (
                <span className="text-xs text-gray-400">{acc.on_hold_balance.toLocaleString()} on hold</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-[15px] font-bold text-gray-900">Transaction History</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F7F8FA] border border-gray-200 w-48">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                className="bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-[#F7F8FA] border border-gray-200 text-xs text-gray-700 outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="payment">Deposit</option>
              <option value="transfer">Transfer</option>
              <option value="payout">Withdraw</option>
              <option value="refund">Refund</option>
            </select>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[120px_1fr_130px_130px_140px_100px] gap-0 px-5 py-2.5 bg-[#F7F8FA] border-b border-gray-100">
          {["Date", "Transaction ID", "Wallet", "Type", "Amount", "Currency"].map((h) => (
            <span key={h} className="text-xs font-semibold text-gray-500">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loadingTx ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading transactions...</span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            No transactions found.
          </div>
        ) : (
          paginated.map((tx, idx) => {
            const cfg = getTypeConfig(tx.type);
            const { text: amtText, color: amtColor } = formatAmount(tx.amount, tx.currency, tx.type);
            const Icon = cfg.icon;
            return (
              <div
                key={tx.id}
                className={`grid grid-cols-[120px_1fr_130px_130px_140px_100px] gap-0 px-5 py-3.5 items-center ${
                  idx < paginated.length - 1 ? "border-b border-gray-50" : ""
                } hover:bg-gray-50 transition-colors`}
              >
                <span className="text-xs text-gray-500">{formatDate(tx.created_at)}</span>
                <span className="text-xs text-gray-700 font-medium truncate pr-4" title={tx.id}>
                  {tx.id}
                </span>
                <span className="text-xs text-gray-500 truncate pr-4">
                  {tx.source_ewallet_id ?? "—"}
                </span>
                <div className="flex items-center">
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    {cfg.label}
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: amtColor }}>{amtText}</span>
                <span className="text-xs text-gray-500 font-medium">{tx.currency}</span>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {!loadingTx && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md bg-[#F7F8FA] border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <>
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span key={`ellipsis-${p}`} className="text-xs text-gray-400 px-1">…</span>
                    )}
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[28px] h-7 rounded-md text-xs font-semibold transition-colors ${
                        p === page
                          ? "bg-orange-500 text-white"
                          : "bg-[#F7F8FA] border border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  </>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md bg-[#F7F8FA] border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
