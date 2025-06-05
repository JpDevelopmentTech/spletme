import axios from "axios";

class SongService {
  private readonly URI = import.meta.env.VITE_URL_API + "/api/v1/songs";
  private readonly token = localStorage.getItem("token");

  async getSongs() {
    try {
        const endpoint = this.URI + "/by-user?page=1&limit=10";
        const response = await axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting songs:", error);
        return null;
    }
  }

  async uploadSongs(file: FormData) {
    try {
      console.log(this.token);
      const endpoint = this.URI + "/by-csv";
      const response = await axios.post(endpoint, file, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading songs:", error);
      return null;
    }
  }

  async getSong(id: string) {
    try {
      const endpoint = this.URI + "/" + id;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting song:", error);
      return null;
    }
  }

  async getSongsByFilter(country: string, platform: string, startDate: string, endDate: string) {
    try {
      const endpoint = this.URI + "/by-params?country=" + country + "&platform=" + platform + "&startDate=" + startDate + "&endDate=" + endDate;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting songs by filter:", error);
        return null;
      }
  }
}

export default new SongService();
