/*
Megadjuk, hogy milyen címen tudjuk elérni a szerverünket.
*/
export const backend_uri = "http://localhost:1337";
// export const backend_uri = "https://api.airtrk.hu";

export const static_uri = "https://static.airtrk.hu";

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
	} catch ({ response: error }) {
		return error.data;
	}
};

export const fetchForm = async (data, route) => {
	try {
		const response = await axios({
			method: "POST",
			url: `${static_uri}/${route}`,
			data,
		});

		return response.data;
	} catch ({ response: error }) {
		return error.data;
	}
};

export async function logOut() {
	const response = await fetch("", `user/logout?access_token=${Cookies.get("access_token")}`, "GET");

	return response.status === "success" ? true : false;
}
