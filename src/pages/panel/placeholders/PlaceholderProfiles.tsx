import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Plus,
  Loader,
  Pencil,
  Trash2,
  TriangleAlert,
  Check,
  X,
  Music,
} from "lucide-react";
import { placeholdersService, type PlaceholderProfile } from "@/services/placeholders";
import { PlaceholderAvatar } from "@/components/collaborators/PlaceholderAvatar";
import Loading from "@/components/loading/loading";

/**
 * FUNCIONALIDAD TEMPORAL — perfiles sin cuenta.
 *
 * El sitio donde viven todos, para poder crearlos de antemano y reutilizarlos
 * después en una canción, en un álbum entero o en un sello. Antes solo se podían
 * crear desde una canción concreta, que es justo el caso que menos se repite.
 *
 * Cada fila dice en cuántas canciones figura y en cuántas está cobrando: sin ese
 * dato, borrar es a ciegas y el servidor rechaza el borrado sin que se entienda
 * por qué.
 */
export default function PlaceholderProfiles() {
  const [profiles, setProfiles] = useState<PlaceholderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const messageFrom = (err: unknown, fallback: string): string => {
    const response = (err as { response?: { data?: { message?: string; error?: string } } })
      ?.response;
    return response?.data?.message ?? response?.data?.error ?? fallback;
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProfiles(await placeholdersService.list());
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const trimmed = name.trim();

  const create = async () => {
    if (!trimmed || creating) return;
    setCreating(true);
    setError("");
    try {
      await placeholdersService.create(trimmed);
      setName("");
      await load();
    } catch (err) {
      setError(messageFrom(err, "No se pudo crear el perfil."));
    } finally {
      setCreating(false);
    }
  };

  const rename = async (profile: PlaceholderProfile) => {
    const next = draftName.trim();
    if (!next || next === profile.name) {
      setEditingId(null);
      return;
    }
    setBusyId(profile._id);
    setError("");
    try {
      await placeholdersService.rename(profile._id, next);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(messageFrom(err, "No se pudo cambiar el nombre."));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (profile: PlaceholderProfile) => {
    setBusyId(profile._id);
    setError("");
    try {
      await placeholdersService.remove(profile._id);
      await load();
    } catch (err) {
      setError(messageFrom(err, "No se pudo borrar el perfil."));
    } finally {
      setBusyId(null);
    }
  };

  const totals = useMemo(
    () => ({
      people: profiles.length,
      cobrando: profiles.filter((p) => (p.activeSplitCount ?? 0) > 0).length,
    }),
    [profiles],
  );

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="mx-auto flex max-w-[860px] flex-col gap-5 px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold text-[#1C1D22]">Personas sin cuenta</h1>
          <p className="max-w-[62ch] text-[13px] leading-relaxed text-[#71757E]">
            Créalas aquí y repártelas después donde haga falta: en una canción, en un álbum entero o
            en todas las canciones de un sello. No reciben correos ni pueden entrar en Splitme; su
            parte se acumula a su nombre hasta que se registren.
          </p>
        </header>

        <section className="flex flex-col gap-3 rounded-[26px] border border-[#E8E8EC] bg-white p-[22px]">
          <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
            NOMBRE DE LA PERSONA
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && create()}
              placeholder="Como quieras verla en el reparto"
              maxLength={80}
              className="min-w-[220px] flex-1 rounded-[16px] border border-[#E8E8EC] bg-white px-4 py-3 text-[13px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
            />
            <button
              type="button"
              onClick={create}
              disabled={!trimmed || creating}
              className="flex items-center gap-2 rounded-[16px] bg-[#FF5C00] px-4 py-3 text-[12.5px] font-semibold text-white transition-colors enabled:hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:bg-[#F4F5F7] disabled:text-[#A6AAB2]"
            >
              {creating ? (
                <Loader className="h-[15px] w-[15px] animate-spin" />
              ) : (
                <Plus className="h-[15px] w-[15px]" />
              )}
              {creating ? "Creando…" : "Crear"}
            </button>
          </div>
        </section>

        {error && (
          <p className="flex items-start gap-2.5 rounded-[18px] bg-[#FDECEC] px-4 py-3.5 text-[12.5px] text-[#E5484D]">
            <TriangleAlert className="mt-px h-4 w-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {loading ? (
          <Loading />
        ) : profiles.length === 0 ? (
          <section className="flex flex-col items-center gap-2.5 rounded-[26px] border border-[#E8E8EC] bg-white py-16 text-center">
            <span className="grid h-[58px] w-[58px] place-items-center rounded-[20px] border-[1.5px] border-dashed border-[#C9CCD2] bg-[#F4F5F7]">
              <UserPlus className="h-6 w-6 text-[#71757E]" />
            </span>
            <p className="text-[15px] font-semibold text-[#1C1D22]">Todavía no hay ninguna</p>
            <p className="max-w-[420px] text-[13px] text-[#71757E]">
              Crea la primera arriba. Después podrás asignarle su parte sin esperar a que se
              registre.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white">
            <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-[18px]">
              <h2 className="font-display text-[17px] font-semibold text-[#1C1D22]">
                {totals.people} {totals.people === 1 ? "persona" : "personas"}
              </h2>
              {totals.cobrando > 0 && (
                <span className="text-[12px] text-[#71757E]">
                  {totals.cobrando} {totals.cobrando === 1 ? "está cobrando" : "están cobrando"}
                </span>
              )}
            </header>

            <div className="h-px bg-[#E8E8EC]" />

            <ul className="divide-y divide-[#E8E8EC]">
              {profiles.map((profile) => {
                const editing = editingId === profile._id;
                const busy = busyId === profile._id;
                const songs = profile.songCount ?? 0;
                const splits = profile.activeSplitCount ?? 0;

                return (
                  <li key={profile._id} className="flex flex-wrap items-center gap-3.5 px-5 py-3.5">
                    <PlaceholderAvatar name={profile.name} />

                    <div className="flex min-w-[180px] flex-1 flex-col gap-0.5">
                      {editing ? (
                        <input
                          autoFocus
                          value={draftName}
                          maxLength={80}
                          onChange={(event) => setDraftName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") rename(profile);
                            if (event.key === "Escape") setEditingId(null);
                          }}
                          className="w-full rounded-[12px] border border-[#FF5C00] bg-white px-2.5 py-1.5 text-[13px] font-semibold text-[#1C1D22] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
                        />
                      ) : (
                        <span className="truncate text-[13px] font-semibold text-[#1C1D22]">
                          {profile.name}
                        </span>
                      )}
                      <span className="text-[11px] text-[#A6AAB2]">
                        {songs === 0
                          ? "Todavía no está en ninguna canción"
                          : `En ${songs} ${songs === 1 ? "canción" : "canciones"}${
                              splits > 0 ? ` · cobra en ${splits}` : " · sin split aún"
                            }`}
                      </span>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      {editing ? (
                        <>
                          <IconButton
                            label="Guardar"
                            onClick={() => rename(profile)}
                            disabled={busy}
                          >
                            {busy ? (
                              <Loader className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                          </IconButton>
                          <IconButton label="Cancelar" onClick={() => setEditingId(null)}>
                            <X className="h-3.5 w-3.5" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            label="Cambiar el nombre"
                            onClick={() => {
                              setEditingId(profile._id);
                              setDraftName(profile.name);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </IconButton>
                          <IconButton
                            label={
                              splits > 0
                                ? `Está cobrando en ${splits}: quítale antes esos splits`
                                : "Borrar este perfil"
                            }
                            danger
                            disabled={busy || splits > 0}
                            onClick={() => remove(profile)}
                          >
                            {busy ? (
                              <Loader className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </IconButton>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <p className="flex flex-wrap items-center gap-2 px-1 text-[11.5px] text-[#A6AAB2]">
          <Music className="h-3.5 w-3.5" />
          Para darles su parte, entra en una
          <Link to="/panel/music" className="font-semibold text-[#FF5C00] hover:text-[#EA580C]">
            canción, álbum o sello
          </Link>
          y reparte allí los splits.
        </p>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-[34px] w-[34px] place-items-center rounded-full border border-[#E8E8EC] bg-white transition-colors disabled:cursor-not-allowed disabled:text-[#D4D6DB] ${
        danger
          ? "text-[#71757E] enabled:hover:border-[#E5484D] enabled:hover:text-[#E5484D]"
          : "text-[#71757E] enabled:hover:text-[#1C1D22]"
      }`}
    >
      {children}
    </button>
  );
}
