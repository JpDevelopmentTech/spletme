import { useMemo, useState } from "react";
import { Search, UserPlus, TriangleAlert } from "lucide-react";
import { useCollaboratorsLibrary } from "@/hooks/useCollaboratorsLibrary";
import { CollaboratorsKpis } from "@/components/collaborators/CollaboratorsKpis";
import { AttentionTray } from "@/components/collaborators/AttentionTray";
import { CollaboratorsFilterBar } from "@/components/collaborators/CollaboratorsFilterBar";
import { CollaboratorRow } from "@/components/collaborators/CollaboratorRow";
import { BulkActionBar } from "@/components/collaborators/BulkActionBar";
import {
  FirstCollaboratorState,
  NoResultsState,
} from "@/components/collaborators/CollaboratorsEmptyState";
import { CollaboratorDetailModal } from "@/components/collaborators/CollaboratorDetailModal";
import {
  CollaboratorPaymentModal,
  type PaymentTarget,
} from "@/components/modal/CollaboratorPaymentModal";
import {
  COLLABORATOR_COLUMNS,
  COLLABORATORS_GRID,
} from "@/components/collaborators/collaboratorsColumns";
import { AddCollaboratorSidebar } from "./components/AddCollaboratorSidebar";
import { collaboratorColor, resolveCollaboratorState } from "@/utils/collaborators.utils";
import { formatCurrency } from "@/utils/format.utils";
import LocalStorageService from "@/services/localstorage";
import type { Collaborator } from "@/types";

export default function Collaborators() {
  const library = useCollaboratorsLibrary();
  const {
    loading,
    error,
    reload,
    refresh,
    collaborators,
    visible,
    payable,
    blocked,
    totals,
    catalogSize,
    search,
    setSearch,
    hasFilters,
    clearFilters,
    selected,
    selectedIds,
    selectedTotal,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  } = library;

  const [profileOf, setProfileOf] = useState<Collaborator | null>(null);
  const [payTargets, setPayTargets] = useState<PaymentTarget[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = LocalStorageService.getItem("user");
  const userRole = String(currentUser?.role ?? "").toLowerCase();
  const canAddCollaborator = !currentUser?.parentUserId || userRole === "label";

  /** El color de cada persona es estable: se deriva de su sitio en el catálogo. */
  const colorOf = useMemo(() => {
    const map = new Map<string, string>();
    collaborators.forEach((c, index) => map.set(c.id, collaboratorColor(index)));
    return map;
  }, [collaborators]);

  const toTarget = (c: Collaborator): PaymentTarget => ({
    id: c.id,
    name: c.name,
    email: c.email,
    pending: c.amountPending,
  });

  const visiblePayable = visible.filter((c) => resolveCollaboratorState(c) === "can_pay");
  const allSelected =
    visiblePayable.length > 0 && visiblePayable.every((c) => selectedIds.has(c.id));

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-display text-2xl font-semibold text-[#1C1D22]">Colaboradores</h1>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-[#71757E]">
              <span>
                {collaborators.length}{" "}
                {collaborators.length === 1 ? "persona" : "personas"}
              </span>
              <span className="text-[#A6AAB2]">·</span>
              <span>{totals.activeSplits} splits activos</span>
              {totals.totalPending > 0 && (
                <>
                  <span className="text-[#A6AAB2]">·</span>
                  <button
                    onClick={() => library.setStateFilter("can_pay")}
                    className="font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
                  >
                    {formatCurrency(totals.totalPending)} por pagar
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[280px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6AAB2]"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar por nombre o correo…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[22px] border border-[#E8E8EC] bg-white py-2.5 pl-11 pr-4 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
              />
            </div>
            {canAddCollaborator && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex flex-shrink-0 items-center gap-2 rounded-[22px] bg-[#FF5C00] px-[18px] py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors hover:bg-[#EA580C]"
              >
                <UserPlus className="h-[15px] w-[15px]" />
                Invitar a una canción
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#F5C2C4] bg-[#FDECEC] px-4 py-3">
            <TriangleAlert className="h-4 w-4 flex-shrink-0 text-[#E5484D]" />
            <span className="flex-1 text-[12.5px] text-[#E5484D]">{error}</span>
            <button
              onClick={reload}
              className="rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-semibold text-[#E5484D]"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <TableSkeleton />
        ) : collaborators.length === 0 ? (
          <FirstCollaboratorState onInvite={() => setSidebarOpen(true)} />
        ) : (
          <>
            <CollaboratorsKpis
              totalCollaborators={totals.totalCollaborators}
              people={totals.people}
              labels={totals.labels}
              activeSplits={totals.activeSplits}
              songsWithSplits={catalogSize}
              totalPaid={totals.totalPaid}
              totalPending={totals.totalPending}
              waitingCount={payable.length + blocked.length}
              onShowPending={
                totals.totalPending > 0 ? () => library.setStateFilter("can_pay") : undefined
              }
            />

            <AttentionTray
              payable={payable}
              onPayAll={() => setPayTargets(payable.map(toTarget))}
            />

            <CollaboratorsFilterBar
              stateFilter={library.stateFilter}
              onStateFilterChange={library.setStateFilter}
              roleFilter={library.roleFilter}
              onRoleFilterChange={library.setRoleFilter}
              roles={library.roles}
              sortBy={library.sortBy}
              onSortChange={library.setSortBy}
              hasFilters={hasFilters}
              onClearAll={clearFilters}
            />

            {visible.length === 0 ? (
              <NoResultsState
                search={search}
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
                onClearSearch={() => setSearch("")}
                onInvite={() => setSidebarOpen(true)}
              />
            ) : (
              <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
                <div className={`${COLLABORATORS_GRID} px-5 py-3`}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      disabled={visiblePayable.length === 0}
                      aria-label="Seleccionar todos los que pueden cobrar"
                      className="h-[15px] w-[15px] cursor-pointer rounded-[5px] border-[1.5px] border-[#A6AAB2] accent-[#FF5C00] focus:ring-[3px] focus:ring-[#FF5C00]/15 disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </div>
                  <ColumnLabel>COLABORADOR</ColumnLabel>
                  {COLLABORATOR_COLUMNS.map((column) => (
                    <div key={column.key} className={column.visibility}>
                      <ColumnLabel>{column.label}</ColumnLabel>
                    </div>
                  ))}
                  <div />
                </div>
                <div className="h-px bg-[#E8E8EC]" />
                <div className="flex flex-col divide-y divide-[#E8E8EC]">
                  {visible.map((collaborator) => (
                    <CollaboratorRow
                      key={collaborator.id}
                      collaborator={collaborator}
                      color={colorOf.get(collaborator.id) ?? "#FF5C00"}
                      catalogSize={catalogSize}
                      selected={selectedIds.has(collaborator.id)}
                      onToggleSelect={toggleSelect}
                      onOpen={setProfileOf}
                      onPay={(c) => setPayTargets([toTarget(c)])}
                    />
                  ))}
                </div>
                <div className="h-px bg-[#E8E8EC]" />
                <div className="px-5 py-3.5">
                  <span className="text-[12px] text-[#71757E]">
                    {visible.length}
                    {visible.length === collaborators.length ? "" : ` de ${collaborators.length}`}{" "}
                    {visible.length === 1 ? "colaborador" : "colaboradores"} · {catalogSize}{" "}
                    canciones con split
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BulkActionBar
        count={selected.length}
        total={selectedTotal}
        onClear={clearSelection}
        onPay={() => setPayTargets(selected.map(toTarget))}
      />

      {profileOf && (
        <CollaboratorDetailModal
          collaborator={profileOf}
          onClose={() => setProfileOf(null)}
          onPay={(c) => {
            setProfileOf(null);
            setPayTargets([toTarget(c)]);
          }}
          isOwner
        />
      )}

      <CollaboratorPaymentModal
        isOpen={payTargets.length > 0}
        targets={payTargets}
        onClose={() => setPayTargets([])}
        onPaymentSuccess={refresh}
      />

      <AddCollaboratorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="truncate font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
      {children}
    </span>
  );
}

/** Tabla fantasma: conserva las columnas mientras llegan los datos. */
function TableSkeleton() {
  const widths = ["w-[148px]", "w-[112px]", "w-[168px]", "w-[130px]"];
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white">
      <div className={`${COLLABORATORS_GRID} px-5 py-3`}>
        <div />
        <ColumnLabel>COLABORADOR</ColumnLabel>
        {COLLABORATOR_COLUMNS.map((column) => (
          <div key={column.key} className={column.visibility}>
            <ColumnLabel>{column.label}</ColumnLabel>
          </div>
        ))}
        <div />
      </div>
      <div className="h-px bg-[#E8E8EC]" />
      <div className="flex flex-col divide-y divide-[#E8E8EC]">
        {widths.map((width, index) => (
          <div key={width} className={`${COLLABORATORS_GRID} px-5 py-3.5`}>
            <div className="h-[15px] w-[15px] animate-pulse rounded-[5px] bg-[#F4F5F7]" />
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-[#F4F5F7]" />
              <div className="flex flex-1 flex-col gap-2">
                <div className={`h-2.5 animate-pulse rounded-full bg-[#F4F5F7] ${width}`} />
                <div
                  className={`h-2 animate-pulse rounded-full bg-[#F4F5F7]/70 ${
                    index % 2 ? "w-[130px]" : "w-[164px]"
                  }`}
                />
              </div>
            </div>
            {COLLABORATOR_COLUMNS.map((column) => (
              <div key={column.key} className={column.visibility}>
                <div className="h-2.5 w-[70%] animate-pulse rounded-full bg-[#F4F5F7]" />
              </div>
            ))}
            <div className="flex justify-end">
              <div className="h-7 w-[52px] animate-pulse rounded-[15px] bg-[#F4F5F7]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
