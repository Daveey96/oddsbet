import axios from "axios";
import { clientAsync } from "@/helpers/asyncHandler";

const getEvents = (sportId = 1, isLive) => {
  return clientAsync(async () => {
    const { data } = await axios.get(
      `/api/rapid?id=${sportId}${isLive ? "&live=live" : ""}&type=events`
    );
    return data;
  }, false);
};

const getMatches = (sportId = 1, live = false) => {
  return clientAsync(async () => {
    const { data } = await axios.get(
      `/api/rapid?id=${sportId}&live=${live}&type=matches`
    );
    return data;
  }, false);
};

const getMatch = (id) => {
  return clientAsync(async () => {
    const { data } = await axios.get(`/api/rapid?id=${id}&type=match`);
    return data;
  }, false);
};
const getLogo = (team) => {
  return clientAsync(
    async () => (await axios.get(`/api/rapid?team=${team}&type=logo`)).data,
    false
  );
};

const getStats = (team_1, team_2, date) => {
  return clientAsync(async () => {
    const { data } = await axios.get(
      `/api/rapid?team_1=${team_1}&team_2=${team_2}&date=${date}&type=stats`
    );
    return data;
  }, false);
};

export const apiController = {
  getMatches,
  getMatch,
  getEvents,
  getStats,
  getLogo,
};
