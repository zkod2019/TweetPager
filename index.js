require("isomorphic-fetch");
const polka = require("polka");

polka()
  .get("/:username", async (req, res) => {
    let fetchRes;
    let json;
    const { username } = req.params;

    const API_KEY = "1XnohiMWhJzILBBtAWEZLVoZM";
    const API_KEY_SECRET = "9dND3pRjKlJnYMEYQmL7k4KRixu9NuAELxG1GuuuWOAb3OdWSi";

    fetchRes = await fetch(
      "https://api.twitter.com/oauth2/token?grant_type=client_credentials",
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${API_KEY}:${API_KEY_SECRET}`),
        },
      }
    );
    json = await fetchRes.json();

    const bearerToken = json.access_token;
    console.log("Got bearer token: ", bearerToken);

    fetchRes = await fetch(
      `https://api.twitter.com/2/users/by?usernames=${username}`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );
    json = await fetchRes.json();

    const userId = json.data[0].id;
    console.log("Got user's ID: ", userId);

    fetchRes = await fetch(`https://api.twitter.com/2/users/${userId}/tweets`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    json = await fetchRes.json();

    if (json.data.length === 0 || json.errors) {
      (res.statusCode = 400), res.end("");
    } else {
      (res.statusCode = 200), res.end(json.data[0].text);
    }
  })
  .listen(3000, () => {
    console.log(`> Running on localhost:3000`);
  });
