import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const overtimeApi = createApi({
  reducerPath: 'overtimeApi',
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
  tagTypes: ['Overtime'],
  endpoints: (builder) => ({
    requestOvertime: builder.mutation({
      query: (data) => ({
        url: 'overtime',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Overtime'],
    }),
    getPendingOvertime: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => 
        `overtime/pending?page=${page}&limit=${limit}&search=${search}${status ? `&status=${status}` : ''}`,
      providesTags: ['Overtime'],
    }),
    updateOvertimeStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `overtime/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Overtime'],
    }),
    getAllOvertime: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => 
        `overtime/all?page=${page}&limit=${limit}&search=${search}${status ? `&status=${status}` : ''}`,
      providesTags: ['Overtime'],
    }),
    getMyOvertime: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `overtime/my?page=${page}&limit=${limit}`,
      providesTags: ['Overtime'],
    }),
  }),
});

export const {
  useRequestOvertimeMutation,
  useGetPendingOvertimeQuery,
  useGetAllOvertimeQuery,
  useUpdateOvertimeStatusMutation,
  useGetMyOvertimeQuery,
} = overtimeApi;

