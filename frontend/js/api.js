/*
Megadjuk, hogy milyen címen tudjuk elérni a szerverünket.
*/
const backend_uri = "http://localhost:1337";
//const backend_uri = "https://api.stagenex.hu";

export default backend_uri;

export const fetch = async (data, route, method) => {
  try {
    const response = await axios({
      method,
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
        Cache: "no-cache",
      },
      url: `${backend_uri}/${route}`,
      data,
      withCredentials: true,
    });

    return response.data;
  } catch ({response: error}) {
    return error.data;
  }
};
