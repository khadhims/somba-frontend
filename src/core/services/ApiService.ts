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
  private static refreshSubscribers: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
  }> = []; // track consecutive refresh failures to avoid hammering the refresh endpoint
  private static refreshFailCount = 0;
  private static lastRefreshFailAt: number | null = null;
  private static MAX_REFRESH_RETRIES = 2;
  private static REFRESH_FAIL_COOLDOWN_MS = 60_000; // reset fail count after 60s
  // default endpoint for token refresh — change if your backend uses a different path
  private static refreshEndpoint = "auth/refresh";
  // active request counting to avoid loader getting stuck
  private static activeRequests = 0;
  private static watchdogTimer: any = null;
  private static WATCHDOG_MS = 5000; // 5s fallback

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
    ApiService.vueInstance.axios.defaults.timeout = 5000; // 5s timeout

    // attach interceptors
    ApiService.setupInterceptors();
  }

  private static subscribeTokenRefresh(
    resolve: (token: string) => void,
    reject: (err: any) => void
  ) {
    ApiService.refreshSubscribers.push({ resolve, reject });
  }

  // CHANGE: fix name + handle success
  private static onRefreshed(token: string) {
    ApiService.refreshSubscribers.forEach((s) => s.resolve(token));
    ApiService.refreshSubscribers = [];
  }

  // NEW: handle failure for queued requests
  private static onRefreshFailed(err: any) {
    ApiService.refreshSubscribers.forEach((s) => s.reject(err));
    ApiService.refreshSubscribers = [];
  }

  private static async refreshTokenRequest() {
    const refreshToken = JwtService.getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(new Error("No refresh token"));
    }

    // If we've failed refresh many times recently, avoid another immediate attempt
    if (ApiService.refreshFailCount >= ApiService.MAX_REFRESH_RETRIES) {
      if (
        ApiService.lastRefreshFailAt &&
        Date.now() - ApiService.lastRefreshFailAt >
          ApiService.REFRESH_FAIL_COOLDOWN_MS
      ) {
        // cooldown expired — reset counters and allow retry
        ApiService.refreshFailCount = 0;
        ApiService.lastRefreshFailAt = null;
      } else {
        return ApiService.vueInstance.axios.post(
          ApiService.refreshEndpoint,
          { refresh_token: refreshToken },
          { _skipAuthRefresh: true } as any
        );
      }
    }

    // call refresh endpoint — backend contract assumed to return { access_token, refresh_token }
    return ApiService.vueInstance.axios.post(ApiService.refreshEndpoint, {
      refresh_token: refreshToken,
    });
  }

  private static setupInterceptors() {
    // show/hide global loading overlay via window events with active-request counting
    ApiService.vueInstance.axios.interceptors.request.use(
      (config: any) => {
        try {
          const suppress = !!(config && (config as any)._suppressGlobalLoading);
          if (!suppress) {
            ApiService.activeRequests =
              Math.max(0, ApiService.activeRequests) + 1;
            // dispatch start only when first request begins
            if (ApiService.activeRequests === 1) {
              window.dispatchEvent(new CustomEvent("loading:start"));
            }

            // reset watchdog each time a request starts
            if (ApiService.watchdogTimer)
              clearTimeout(ApiService.watchdogTimer);
            ApiService.watchdogTimer = setTimeout(() => {
              ApiService.activeRequests = 0;
              try {
                window.dispatchEvent(new CustomEvent("loading:stop"));
              } catch (e) {
                /* empty */
              }
            }, ApiService.WATCHDOG_MS);
          }
        } catch (e) {
          /* empty */
        }

        return config;
      },
      (error: any) => {
        try {
          const cfg =
            (error && (error as any).config) ||
            {
              /* empty */
            };
          const suppress = !!(cfg && (cfg as any)._suppressGlobalLoading);
          if (!suppress) {
            ApiService.activeRequests = Math.max(
              0,
              ApiService.activeRequests - 1
            );
            if (ApiService.activeRequests === 0) {
              window.dispatchEvent(new CustomEvent("loading:stop"));
            }
            if (ApiService.watchdogTimer) {
              clearTimeout(ApiService.watchdogTimer);
              ApiService.watchdogTimer = null;
            }
          }
        } catch (e) {
          /* empty */
        }

        return Promise.reject(error);
      }
    );

    // response interceptor to handle 401 and attempt refresh
    ApiService.vueInstance.axios.interceptors.response.use(
      (response: any) => {
        try {
          const cfg =
            (response && (response as any).config) ||
            {
              /* empty */
            };
          const suppress = !!(cfg && (cfg as any)._suppressGlobalLoading);
          if (!suppress) {
            ApiService.activeRequests = Math.max(
              0,
              ApiService.activeRequests - 1
            );
            if (ApiService.activeRequests === 0) {
              window.dispatchEvent(new CustomEvent("loading:stop"));
            }
            if (ApiService.watchdogTimer) {
              clearTimeout(ApiService.watchdogTimer);
              ApiService.watchdogTimer = null;
            }
          }
        } catch (e) {
          /* empty */
        }

        return response;
      },
      async (error: any) => {
        try {
          const cfg =
            (error && (error as any).config) ||
            {
              /* empty */
            };
          const suppress = !!(cfg && (cfg as any)._suppressGlobalLoading);
          if (!suppress) {
            ApiService.activeRequests = Math.max(
              0,
              ApiService.activeRequests - 1
            );
            if (ApiService.activeRequests === 0) {
              window.dispatchEvent(new CustomEvent("loading:stop"));
            }
            if (ApiService.watchdogTimer) {
              clearTimeout(ApiService.watchdogTimer);
              ApiService.watchdogTimer = null;
            }
          }
        } catch (e) {
          /* empty */
        }

        const response = error?.response;
        const originalRequest = error?.config;

        // NEW: if this request is marked to skip refresh handling, just reject
        if (originalRequest?._skipAuthRefresh) {
          return Promise.reject(error);
        }

        const requestUrl: string = originalRequest?.url ?? "";
        const isRefreshCall =
          requestUrl.includes(ApiService.refreshEndpoint) ||
          requestUrl.endsWith(`/${ApiService.refreshEndpoint}`);

        if (response && response.status === 401 && isRefreshCall) {
          // cleanup + notify
          JwtService.destroyToken();
          JwtService.destroyRefreshToken();
          try {
            window.dispatchEvent(new CustomEvent("auth:refresh_failed"));
          } catch {
            /* empty */
          }
          return Promise.reject(error);
        }

        if (response && response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (ApiService.isRefreshing) {
            // queue the request until token is refreshed OR failed
            return new Promise((resolve, reject) => {
              ApiService.subscribeTokenRefresh(
                (token: string) => {
                  originalRequest.headers =
                    originalRequest.headers ||
                    {
                      /* empty */
                    };
                  originalRequest.headers["Authorization"] = `Bearer ${token}`;
                  resolve(ApiService.vueInstance.axios(originalRequest));
                },
                (err: any) => {
                  reject(err);
                }
              );
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

              // reset failure tracking on success
              ApiService.refreshFailCount = 0;
              ApiService.lastRefreshFailAt = null;

              // set header for future requests
              ApiService.setHeader();
              ApiService.onRefreshed(newToken);

              // retry original request with new token
              originalRequest.headers =
                originalRequest.headers ||
                {
                  /* empty */
                };
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return ApiService.vueInstance.axios(originalRequest);
            }

            // if refresh didn't return a token, purge stored tokens and count as failure
            JwtService.destroyToken();
            JwtService.destroyRefreshToken();
            // NEW: fail queued requests too
            ApiService.onRefreshFailed(error);
            ApiService.refreshFailCount += 1;
            ApiService.lastRefreshFailAt = Date.now();
            return Promise.reject(error);
          } catch (e) {
            // refresh failed — cleanup
            JwtService.destroyToken();
            JwtService.destroyRefreshToken();
            // NEW: fail queued requests too
            ApiService.onRefreshFailed(e);
            // mark a failed attempt
            ApiService.refreshFailCount += 1;
            ApiService.lastRefreshFailAt = Date.now();
            // notify app that refresh failed so it can logout/redirect
            try {
              console.debug(
                "[ApiService] refresh token request failed, dispatching auth:refresh_failed (failCount=" +
                  ApiService.refreshFailCount +
                  ")"
              );
              // clear axios auth header to avoid further requests with stale token
              try {
                if (
                  ApiService.vueInstance &&
                  (ApiService.vueInstance as any).axios
                ) {
                  (ApiService.vueInstance as any).axios.defaults.headers.common[
                    "Authorization"
                  ] = "";
                }
              } catch (hh) {
                /* empty */
              }

              window.dispatchEvent(new CustomEvent("auth:refresh_failed"));

              // If we've exceeded the retry limit, perform a hard redirect fallback immediately
              if (
                ApiService.refreshFailCount >= ApiService.MAX_REFRESH_RETRIES
              ) {
                try {
                  if (typeof window !== "undefined") {
                    window.location.href = "/sign-in";
                  }
                } catch (redirErr) {
                  console.debug("[ApiService] hard redirect failed", redirErr);
                }
              } else {
                // otherwise keep a short fallback redirect to ensure app moves to sign-in
                setTimeout(() => {
                  try {
                    if (typeof window !== "undefined") {
                      window.location.href = "/sign-in";
                    }
                  } catch (redirErr) {
                    console.debug(
                      "[ApiService] hard redirect failed",
                      redirErr
                    );
                  }
                }, 250);
              }
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
    slug = "" as string,
    config?: any
  ): Promise<AxiosResponse> {
    const url = slug ? `${resource}/${slug}` : resource;
    return ApiService.vueInstance.axios.get(url, config);
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
    const url = slug ? `${resource}/${slug}` : resource;
    return ApiService.vueInstance.axios.put(url, params);
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
