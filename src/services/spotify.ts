import axios from "axios";

const isTokenValid = () => {
  const expire = JSON.parse(localStorage.getItem("expire") || "0");
  console.log(expire, Date.now());
  return Date.now() < expire;
};

export const SpotifyService = {
  getAccessToken: async () => {
    try {
      if (!isTokenValid()) {
        const uri = "https://accounts.spotify.com/api/token";
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };
        const data = {
          grant_type: "client_credentials",
          client_id: import.meta.env.VITE_CLIENT_ID_SPOTIFY,
          client_secret: import.meta.env.VITE_SECRET_SPOTIFY,
        };
        const response = await axios.post(uri, data, { headers });

        localStorage.setItem(
          "access_token_spotify",
          response.data.access_token
        );
        localStorage.setItem(
          "expire",
          JSON.stringify(Date.now() + response.data.expires_in * 1000)
        );
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  getTopTracks: async (id = "4vofRTVBI4bh7P0HQGddgm") => {
    try {
      await SpotifyService.getAccessToken();
      const uri =
        "https://api.spotify.com/v1/artists/" + id + "/top-tracks?market=US";
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token_spotify")}`,
      };
      const response = await axios.get(uri, { headers });
      return response.data;
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  getTrack: async (id: string) => {
    try {
      await SpotifyService.getAccessToken();
      const uri = "https://api.spotify.com/v1/tracks/" + id;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token_spotify")}`,
      };
      const response = await axios.get(uri, { headers });
      return response.data;
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  getArtist: async (id: string) => {
    try {
      await SpotifyService.getAccessToken();
      const uri = "https://api.spotify.com/v1/artists/" + id;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token_spotify")}`,
      };
      const response = await axios.get(uri, { headers });
      return response.data;
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  getAlbum: async (id: string) => {
    try {
      await SpotifyService.getAccessToken();
      const uri = "https://api.spotify.com/v1/albums/" + id;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token_spotify")}`,
      };
      const response = await axios.get(uri, { headers });
      return response.data;
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  getTopAlbums: async (id = "4vofRTVBI4bh7P0HQGddgm") => {
    try {
      await SpotifyService.getAccessToken();
      const uri =
        "https://api.spotify.com/v1/artists/" + id + "/albums?market=US";
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token_spotify")}`,
      };
      const response = await axios.get(uri, { headers });
      return response.data;
    } catch (error) {
      console.error("Error: ", error);
    }
  },
};
