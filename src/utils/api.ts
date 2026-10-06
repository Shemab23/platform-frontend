// Define explicit types matching your Express backend JSON shapes
export type HealthResponse = {
  ok: boolean;
  env: string;
  status: string;
  database: string;
  timestamp: string;
  error?: string;
};

export type TenantConfigResponse = {
  slug: string;
  hasOrderHistory: boolean;
  hasDeliveryProcessing: boolean;
};

/**
 * A safe, wrapper function around native fetch.
 * Catches network errors and HTML/Parsing errors cleanly.
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, options);

    // Check if the server returned a 404, 500, or HTML page instead of JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await response.text();
      return {
        data: null,
        error: `Expected JSON but received HTML/Text. Server Status: ${response.status}. Preview: ${textError.substring(0, 30)}...`,
      };
    }

    if (!response.ok) {
      const errorJson = await response.json();
      return {
        data: errorJson as T,
        error: `Server error status: ${response.status}`,
      };
    }

    const data = await response.json();
    return { data: data as T, error: null };
  } catch (err: unknown) {
    // Catches complete network drops, offline states, or invalid proxy addresses
    const message =
      err instanceof Error ? err.message : "Network request failed completely";

    return {
      data: null,
      error: message,
    };
  }
}
