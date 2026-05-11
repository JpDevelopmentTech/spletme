export interface TopSong {
  _id: string;
  trackTitle: string;
  artistName: string;
  totalStreams: number;
  totalNetIncome: number;
  spotifyData?: {
    album?: {
      images?: { url: string; width: number; height: number }[];
    };
  };
}
