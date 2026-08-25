import { apiClient } from "@/infrastructure/http/axiosClient";

/**
 * FUNCIONALIDAD TEMPORAL — perfiles sin cuenta.
 *
 * Perfiles que crea el owner para repartir splits a alguien que todavía no se ha
 * registrado. Del lado del servidor son usuarios de verdad, pero sin acceso: no
 * pueden iniciar sesión ni recibir correo. Ver `docs/PERFILES_TEMPORALES.md`.
 */

export interface PlaceholderProfile {
  _id: string;
  /** Id generado del usuario. Es el que esperan los endpoints de splits. */
  id: string;
  name: string;
  username: string;
  isPlaceholder: true;
  createdAt: string | null;
  convertedTo: string | null;
  /** En cuántas canciones figura. Solo viene en el listado. */
  songCount?: number;
  /** En cuántas está cobrando de verdad. Solo viene en el listado. */
  activeSplitCount?: number;
}

export type PlaceholderRole = "collaborator" | "label";

export interface AttachResult {
  attached: boolean;
  role: PlaceholderRole;
  songIds: string[];
  attachedCount: number;
  /** Canciones pedidas que no entraron por no ser de este owner. */
  skippedCount: number;
}

class PlaceholdersService {
  private readonly BASE = "/placeholder-profiles";

  async list(): Promise<PlaceholderProfile[]> {
    const response = await apiClient.get(this.BASE);
    return response.data?.data ?? response.data ?? [];
  }

  async create(name: string): Promise<PlaceholderProfile> {
    const response = await apiClient.post(this.BASE, { name });
    return response.data?.data ?? response.data;
  }

  async rename(placeholderId: string, name: string): Promise<PlaceholderProfile> {
    const response = await apiClient.patch(`${this.BASE}/${placeholderId}`, { name });
    return response.data?.data ?? response.data;
  }

  async remove(placeholderId: string): Promise<void> {
    await apiClient.delete(`${this.BASE}/${placeholderId}`);
  }

  /** Le da acceso a una canción, como colaborador o como sello. */
  async attachToSong(
    placeholderId: string,
    songId: string,
    role: PlaceholderRole = "collaborator",
  ): Promise<AttachResult> {
    const response = await apiClient.post(`${this.BASE}/${placeholderId}/songs`, {
      songId,
      role,
    });
    return response.data?.data ?? response.data;
  }

  /**
   * Le da acceso a un conjunto entero de una vez: todas las canciones de un
   * álbum o de un sello. Es lo que permite repartirle en bloque sin tener que
   * añadirlo canción a canción.
   */
  async attachToSongs(
    placeholderId: string,
    songIds: string[],
    role: PlaceholderRole = "collaborator",
  ): Promise<AttachResult> {
    const response = await apiClient.post(`${this.BASE}/${placeholderId}/songs`, {
      songIds,
      role,
    });
    return response.data?.data ?? response.data;
  }
}

export const placeholdersService = new PlaceholdersService();

/**
 * Si un colaborador que llega con la canción es un perfil sin cuenta. El backend
 * manda el subdocumento `placeholder` poblado con el usuario.
 */
export const isPlaceholderUser = (user: unknown): boolean =>
  Boolean((user as { placeholder?: unknown } | null)?.placeholder);
