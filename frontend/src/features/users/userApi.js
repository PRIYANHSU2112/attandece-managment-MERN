import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://attandece-managment-mern.onrender.com/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `users?page=${page}&limit=${limit}`,
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `users/profile/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    getManagers: builder.query({
      query: () => 'users/managers',
      providesTags: ['User'],
    }),
    getUserProfile: builder.query({
      query: () => 'users/profile',
      providesTags: ['User'],
    }),
    getTeam: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `users/team?page=${page}&limit=${limit}`,
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role, managerId }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: { role, managerId },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetUserByIdQuery, 
  useGetManagersQuery, 
  useGetUserProfileQuery,
  useGetTeamQuery,
  useUpdateUserRoleMutation 
} = userApi;

