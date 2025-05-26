import axios from "axios";

class MusicBrainzService {
  private readonly BASE_URL = "https://musicbrainz.org/ws/2";
  private readonly USER_AGENT = "SplitMe/1.0.0 (your-email@example.com)";

  async getRecordingByISRC(isrc: string) {
    try {
      const response = await axios.get(`${this.BASE_URL}/isrc/${isrc}`, {
        headers: {
          "User-Agent": this.USER_AGENT,
        },
        params: {
          fmt: "json",
          inc: "releases+artists+url-rels",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching recording by ISRC:", error);
      return null;
    }
  }

  async getReleaseCoverArt(mbid: string) {
    try {
      const response = await axios.get(`https://coverartarchive.org/release/${mbid}`, {
        headers: {
          "User-Agent": this.USER_AGENT,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cover art:", error);
      return null;
    }
  }
}

export default new MusicBrainzService();