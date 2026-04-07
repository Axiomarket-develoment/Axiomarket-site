// utils/apiRequest.ts
import { toast } from "react-hot-toast";

// Update API URL to local host
// export const API_URL = "http://localhost:4000";
export const API_URL = "https://axiomarket-server.onrender.com";

type ApiOptions = {
  method?: string;
  body?: Record<string, any>;
  token?: string;
  showSuccess?: boolean;
  showLoading?: boolean;
};

type ApiResponse<T = any> = {
  success: boolean;
  data: T | null;
};

export const apiRequest = async <T = any>(
  endpoint: string,
  { method = "GET", body, token, showSuccess = false, showLoading = true }: ApiOptions = {}
): Promise<ApiResponse<T>> => {

  const toastId = showLoading ? toast.loading("Please wait...") : null;

  try {
    const authToken =
      token ||
      localStorage.getItem("auth-token") ||
      localStorage.getItem("token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    const data = await response.json();

    if (toastId) toast.dismiss(toastId);

    if (!response.ok) {
      if (showLoading) {
        toast.error(data.msg || data.message || "Something went wrong!");
      }
      return { success: false, data };
    }

    if (showSuccess && (data.msg || data.message)) {
      toast.success(data.msg || data.message);
    }

    return { success: true, data };
  } catch (error) {
    if (toastId) toast.dismiss(toastId);
    if (showLoading) {
      toast.error("Network error! Please try again.");
    }
    console.error("API Error:", error);
    return { success: false, data: null };
  }
};