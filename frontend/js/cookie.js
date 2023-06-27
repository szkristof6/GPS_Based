export function set(name, value) {
	Cookies.set(name, value, { expires: 30, path: ".", secure: true});
}
