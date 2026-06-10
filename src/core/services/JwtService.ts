const ACCESS_TOKEN_KEY = "id_token" as string;
const REFRESH_TOKEN_KEY = "refresh_token" as string;

/**
 * @description get access token from localStorage
 */
export const getToken = (): string | null => {
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

/**
 * @description save access token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (e) {
    /* empty */
  }
};

/**
 * @description remove access token from localStorage
 */
export const destroyToken = (): void => {
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (e) {
    /* empty */
  }
};

/**
 * @description save access token (alias)
 */
export const saveAccessToken = (token: string): void => saveToken(token);

/**
 * @description save refresh token into localStorage
 */
export const saveRefreshToken = (token: string): void => {
  try {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (e) {
    /* empty */
  }
};

/**
 * @description get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

/**
 * @description remove refresh token from localStorage
 */
export const destroyRefreshToken = (): void => {
  try {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    /* empty */
  }
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
