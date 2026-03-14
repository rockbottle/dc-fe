import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* * The baseQuery handles the global configuration for all API calls.
 * prepareHeaders is a middleware that automatically injects the Bearer 
 * token into every request if it exists in localStorage.
 */
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  prepareHeaders: (headers) => {
    // Attempt to retrieve the token from local storage
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  baseQuery,
  reducerPath: "api",
  tagTypes: ["Inventory", "User"],
  endpoints: (build) => ({
    /**
     * LOGIN MUTATION
     * FastAPI's OAuth2PasswordRequestForm expects "application/x-www-form-urlencoded"
     * We use URLSearchParams to format the credentials correctly.
     */
    login: build.mutation({
      query: (credentials) => {
        const formData = new URLSearchParams();
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);
        
        return {
          url: "/token",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),

    /**
     * INVENTORY QUERY
     * This is a protected endpoint. Because of the prepareHeaders logic above,
     * it will automatically include the 'Authorization: Bearer <token>' header.
     */
    getInventory: build.query<any[], void>({
      query: () => "/inventory",
      providesTags: ["Inventory"],
    }),

    /**
     * USER DETAILS QUERY (Optional)
     * Fetch the current user profile based on the token
     */
    getCurrentUser: build.query<any, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
  }),
});

// Export hooks for use in components
export const { 
  useLoginMutation, 
  useGetInventoryQuery,
  useGetCurrentUserQuery 
} = api;