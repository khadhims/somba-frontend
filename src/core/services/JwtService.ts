const ACCESS_TOKEN_KEY = "id_token" as string;
const REFRESH_TOKEN_KEY = "refresh_token" as string;

/**
 * @description get access token from localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * @description save access token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * @description remove access token from localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

/**
 * @description save access token (alias)
 */
export const saveAccessToken = (token: string): void => saveToken(token);

/**
 * @description save refresh token into localStorage
 */
export const saveRefreshToken = (token: string): void => {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * @description get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * @description remove refresh token from localStorage
 */
export const destroyRefreshToken = (): void => {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  saveAccessToken,
  saveRefreshToken,
  getRefreshToken,
  destroyRefreshToken,
};
