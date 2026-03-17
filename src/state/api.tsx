import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* --- INTERFACES (Aligned with schemas.py) --- */

export interface Device {
  id: number;
  device_type: string;
  device_hostname: string;
  device_model: string;
  device_serial: string;
  rack_name: string;
  rack_unit: string;
  rack_uspace: number;
  device_power: number;
  device_nports: number;
  device_sports: number;
  power_status: boolean;
  device_status: boolean;
}

export interface NewDevice extends Omit<Device, 'id'> {}

// Matches DcBase & DcUpdate schemas
export interface DcPurchase {
  id?: number;
  dcpower: number;
  uspace: number;
  nport: number;
  sport: number;
}

// Matches UserDisplay & UserBase schemas
export interface User {
  id?: number;
  username: string;
  email: string;
  company_name: string;
  password?: string;
}

/* --- BASE API CONFIG --- */

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  prepareHeaders: (headers) => {
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
  tagTypes: ["Inventory", "User", "Usage"],
  endpoints: (build) => ({
    
    /* --- AUTHENTICATION --- */
    
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

    /* --- INVENTORY CRUD OPERATIONS (db_inventory.py) --- */

    getInventory: build.query<Device[], void>({
      query: () => "/inventory/my_details",
      providesTags: ["Inventory"],
    }),

    createInventory: build.mutation<Device, NewDevice>({
      query: (newDevice) => ({
        url: "/inventory/create",
        method: "POST",
        body: newDevice,
      }),
      invalidatesTags: ["Inventory"],
    }),

    updateInventory: build.mutation<{ message: string }, { id: number; data: Partial<Device> }>({
      query: ({ id, data }) => ({
        url: `/inventory/update/?id=${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    deleteInventory: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/inventory/delete?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),

    /* --- USAGE OPERATIONS (db_usage.py) --- */

    // Get purchased limits for dashboard gauges
    getMyDetails: build.query<DcPurchase, void>({
      query: () => "/usage/my_details",
      providesTags: ["Usage"],
    }),

    // Get live usage/calculated totals
    getMyCurrentUsage: build.query<any, void>({
      query: () => "/usage/my_current_usage",
      providesTags: ["Usage"],
    }),

    // Get available headroom
    getAvailableUsage: build.query<any, void>({
      query: () => "/usage/my_availble_usage",
      providesTags: ["Usage"],
    }),

    createUsage: build.mutation<DcPurchase, DcPurchase>({
      query: (newUsage) => ({
        url: "/usage/create",
        method: "POST",
        body: newUsage,
      }),
      invalidatesTags: ["Usage"],
    }),

    updateUsage: build.mutation<DcPurchase, Partial<DcPurchase>>({
      query: (data) => ({
        url: "/usage/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Usage"],
    }),

    deleteUsage: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "/usage/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["Usage"],
    }),

    /* --- USER OPERATIONS (db_user.py) --- */

    // Get current logged-in user profile
    getCurrentUser: build.query<User[], void>({
      query: () => "/user/my_details",
      providesTags: ["User"],
    }),

    // Get all users in the same company
    getMyTeam: build.query<User[], void>({
      query: () => "/user/my_team",
      providesTags: ["User"],
    }),

    createUser: build.mutation<User, User>({
      query: (newUser) => ({
        url: "/user/create",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: build.mutation<{ message: string }, Partial<User>>({
      query: (data) => ({
        url: "/user/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: build.mutation<string, void>({
      query: () => ({
        url: "/user/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useGetMyDetailsQuery,
  useGetMyCurrentUsageQuery,
  useGetAvailableUsageQuery,
  useCreateUsageMutation,
  useUpdateUsageMutation,
  useDeleteUsageMutation,
  useGetCurrentUserQuery,
  useGetMyTeamQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = api;