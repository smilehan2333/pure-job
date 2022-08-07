import Cookies from "js-cookie";

const TokenKey = "whoru";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(value) {
  Cookies.set(TokenKey, value, { expires: 7, path: "" }); //设置一个7天过期的cookie
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
