import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const companyApi = createApi({
  reducerPath: 'companyApi',
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
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    getCompanySettings: builder.query({
      query: () => 'company',
      providesTags: ['Company'],
    }),
    updateCompanySettings: builder.mutation({
      query: (data) => ({
        url: 'company',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Company'],
    }),
  }),
});

export const {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
} = companyApi;

