export type CollaboratorStatus = "active" | "pending" | "no_wallet";

export interface RecentSong {
  title: string;
  streams: string;
  percentage: number;
}

export interface Collaborator {
  id: string;
  externalId?: string;
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  songs: number;
  songPresencePercentage: number;
  paid: number;
  amountOwed: number;
  amountPending: number;
  status: CollaboratorStatus;
  roles?: string[];
  recentSongs?: RecentSong[];
}

export interface CollaboratorPayment {
  id: string;
  collaboratorName: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  songTitle: string;
  isrc: string;
  relativeDate: string;
  date: string;
  amount: number;
  status: "completed" | "processing" | "failed";
}
