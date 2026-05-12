let cachedToken = null;
let expiresAt = null;


export async function getToken() {
  const now = new Date();
  if (cachedToken && expiresAt && now < expiresAt) {
    console.log("Token gültig bis:", expiresAt.toLocaleString());
    return cachedToken;
  }

  const response = await fetch("https://www.arcgis.com/sharing/rest/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: esriConfig.env.client_id,
      client_secret: esriConfig.env.client_secret,
      grant_type: "client_credentials",
      expiration: 4320  // 72h
    })
  });

  const data = await response.json();
  expiresAt = new Date(now.getTime() + (data.expires_in * 1000));

  console.log("Token expires at:", expiresAt.toLocaleString());
  return data.access_token;
}