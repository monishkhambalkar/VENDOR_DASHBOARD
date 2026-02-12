import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import config from "../../config/config"; // Assuming config has VENDOR_BASE_URL: string

// Define the structure of the User object stored in localStorage
interface User {
  accessToken: string;
  refreshToken: string;
  // Add other user properties if they exist, e.g.:
  // id: number;
  // username: string;
}

// Define the structure of the expected response from the token refresh endpoint
interface TokenRefreshResponse {
  accessToken: string;
  // potentially other fields like expiresIn?
}

// --- getCurrentUser ---
// Returns the parsed user object or null if not found or invalid
export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem("user");
  if (!userString) {
    // Item doesn't exist or is empty string
    return null;
  }
  try {
    // Parse the string, assuming it matches the User interface
    const user: User = JSON.parse(userString);
    // Optional: Add validation here if needed to ensure properties exist
    if (user && user.accessToken && user.refreshToken) {
      return user;
    }
    console.error("Stored user object is missing required properties.");
    localStorage.removeItem("user"); // Clean up invalid data
    return null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    // Clean up potentially corrupted data
    localStorage.removeItem("user");
    return null;
  }
};

// --- refreshToken ---
// Attempts to refresh the token and returns the new access token or null
const refreshToken = async (): Promise<string | null> => {
  const user = getCurrentUser(); // Now correctly typed as User | null

  if (user?.refreshToken) {
    // Use optional chaining for cleaner check
    try {
      const response = await axios.post<TokenRefreshResponse>( // Specify expected response type
        `${config.VENDOR_BASE_URL}/user/token`,
        {
          token: user.refreshToken,
        }
      );

      const newAccessToken = response.data?.accessToken; // Use optional chaining

      if (newAccessToken) {
        // Create updated user object
        const updatedUser: User = {
          ...user,
          accessToken: newAccessToken,
        };
        // Store updated user object back in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return newAccessToken; // Return the new token
      } else {
        console.error("Refresh token response did not contain accessToken.");
        // Optional: handle logout if refresh fails definitively
        // localStorage.removeItem("user");
        // window.location.href = '/login'; // Example redirect
        return null;
      }
    } catch (error) {
      console.error("Error during token refresh request:", error);
      // Optional: handle logout if refresh fails definitively (e.g., refresh token expired/invalid)
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        console.log("Refresh token invalid or expired. Logging out.");
        localStorage.removeItem("user");
        // window.location.href = '/login'; // Example redirect
      }
      return null;
    }
  }

  // No user or no refresh token found
  console.log("No user or refresh token available for refresh attempt.");
  return null;
};

// --- Axios Interceptors ---

// Define a type extending AxiosRequestConfig to include our custom _retry flag
interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Request Interceptor: Adds Authorization header if user token exists
axios.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const user = getCurrentUser();
    if (user?.accessToken) {
      // Use optional chaining
      // Ensure headers object exists (TypeScript needs this check)
      reqConfig.headers = reqConfig.headers || {};
      reqConfig.headers["Authorization"] = `Bearer ${user.accessToken}`;
    }
    return reqConfig;
  },
  (error: AxiosError) => {
    // Errors during request setup
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles 401 errors by attempting token refresh
axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Any status code within the range of 2xx cause this function to trigger
    return response;
  },
  async (error: AxiosError) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined; // Cast config, check if undefined

    // Check for 401, ensure config exists, and ensure it's not already a retry attempt
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      console.log("Received 401, attempting token refresh...");
      originalRequest._retry = true; // Mark this request as having attempted a retry

      try {
        const newAccessToken = await refreshToken(); // Attempt refresh

        if (newAccessToken) {
          console.log(
            "Token refreshed successfully. Retrying original request."
          );
          // Update the authorization header *on the original request config* for the retry
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
          }
          // Retry the original request with the updated config
          return axios(originalRequest);
        } else {
          // Refresh token failed or didn't return a new token
          console.error(
            "Token refresh failed or no new token received. Cannot retry request."
          );
          // Handle logout or redirect the user as appropriate
          // localStorage.removeItem("user");
          // window.location.href = '/login';
        }
      } catch (refreshError) {
        // Catch errors specifically from the refreshToken() call itself (already logged inside refreshToken)
        console.error(
          "Caught error during refreshToken call in interceptor:",
          refreshError
        );
        // Handle logout or redirect the user as appropriate
        // localStorage.removeItem("user");
        // window.location.href = '/login';
      }
    }

    // For errors other than 401, or if config is missing, or if retry failed, reject the promise
    return Promise.reject(error);
  }
);

// Export refreshToken if it needs to be used elsewhere, otherwise it could be kept private
export default refreshToken;
