import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  // refresh token handling
  private static isRefreshing = false;
  private static refreshSubscribers: Array<(token: string) => void> = [];
  // default endpoint for token refresh — change if your backend uses a different path
  private static refreshEndpoint = "auth/refresh";

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;

    // attach interceptors
    ApiService.setupInterceptors();
  }

  private static subscribeTokenRefresh(cb: (token: string) => void) {
    ApiService.refreshSubscribers.push(cb);
  }

  private static onRrefreshed(token: string) {
    ApiService.refreshSubscribers.forEach((cb) => cb(token));
    ApiService.refreshSubscribers = [];
  }

  private static async refreshTokenRequest() {
    const refreshToken = JwtService.getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(new Error("No refresh token"));
    }

    // call refresh endpoint — backend contract assumed to return { access_token, refresh_token }
    return ApiService.vueInstance.axios.post(ApiService.refreshEndpoint, {
      refresh_token: refreshToken,
    });
  }

  private static setupInterceptors() {
    // response interceptor to handle 401 and attempt refresh
    ApiService.vueInstance.axios.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response && response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (ApiService.isRefreshing) {
            // queue the request until token is refreshed
            return new Promise((resolve, reject) => {
              ApiService.subscribeTokenRefresh((token: string) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(ApiService.vueInstance.axios(originalRequest));
              });
            });
          }

          ApiService.isRefreshing = true;

          try {
            const refreshResp = await ApiService.refreshTokenRequest();
            const data = refreshResp.data;
            const newToken = data.access_token ?? data.token ?? null;

            if (newToken) {
              JwtService.saveToken(newToken);
              if (data.refresh_token) {
                JwtService.saveRefreshToken(data.refresh_token);
              }

              // set header for future requests
              ApiService.setHeader();
              ApiService.onRrefreshed(newToken);

              // retry original request with new token
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return ApiService.vueInstance.axios(originalRequest);
            }

            // if refresh didn't return a token, purge stored tokens
            JwtService.destroyToken();
            JwtService.destroyRefreshToken();
            return Promise.reject(error);
          } catch (e) {
            // refresh failed — cleanup
            JwtService.destroyToken();
            JwtService.destroyRefreshToken();
            // notify app that refresh failed so it can logout/redirect
            try {
              window.dispatchEvent(new CustomEvent("auth:refresh_failed"));
            } catch (evErr) {
              // ignore
            }
            return Promise.reject(e);
          } finally {
            ApiService.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the PATCH HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static patch(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.patch(resource, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;
