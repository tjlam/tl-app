const axios = require("axios");
var qs = require("qs");
const { CLIENT_ID, CLIENT_SECRET } = require("../../../apiKeys");
const base64encoded = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
  "base64"
);

async function getAccessToken() {
  const data = qs.stringify({
    grant_type: "client_credentials",
  });
  const config = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${base64encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getSongData(songId) {
  const accessToken = await getAccessToken();
  const config = {
    method: "get",
    url: `https://api.spotify.com/v1/tracks/${songId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getSongData: getSongData,
};
