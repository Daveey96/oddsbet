import axios from "axios";
import { clientAsync } from "@/helpers/asyncHandler";

const getMatches = (sportId = 1, live = false) => {
  return clientAsync(async () => {
    const { data } = await axios.get(
      `/api/rapid?id=${sportId}&&live=${live}&&type=matches`
    );
    return data;
  }, false);
};

const getMatch = (event_id) => {
  marketoptions.params = {
    sport_id: sportId.toString(),
    is_have_odds: "true",
    event_type: live ? "live" : "prematch",
  };

  return clientAsync(async () => {
    const { data } = await axios.request(marketoptions);
    return data;
  });
};

export const apiController = {
  getMatches,
  getMatch,
};
