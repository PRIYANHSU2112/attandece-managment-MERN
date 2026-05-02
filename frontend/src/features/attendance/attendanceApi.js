import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
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
  tagTypes: ['Attendance'],
  endpoints: (builder) => ({
    punchIn: builder.mutation({
      query: (data) => ({
        url: 'attendance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    punchOut: builder.mutation({
      query: (data) => ({
        url: 'attendance/punch-out',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    getMyAttendance: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `attendance/my?page=${page}&limit=${limit}`,
      providesTags: ['Attendance'],
    }),
    getTodayAttendance: builder.query({
      query: () => 'attendance/today',
      providesTags: ['Attendance'],
    }),
    getTeamAttendance: builder.query({
      query: ({ date, page = 1, limit = 10 } = {}) => 
        `attendance/team?${date ? `date=${date}&` : ''}page=${page}&limit=${limit}`,
      providesTags: ['Attendance'],
    }),
    getAllAttendance: builder.query({
      query: ({ date, page = 1, limit = 10 } = {}) => 
        `attendance/all?${date ? `date=${date}&` : ''}page=${page}&limit=${limit}`,
      providesTags: ['Attendance'],
    }),
    validateAttendance: builder.mutation({
      query: ({ id, data }) => ({
        url: `attendance/${id}/validate`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    getDailyReport: builder.query({
      query: (date) => `attendance/report/daily?date=${date}`,
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  usePunchInMutation,
  usePunchOutMutation,
  useGetMyAttendanceQuery,
  useGetTodayAttendanceQuery,
  useGetTeamAttendanceQuery,
  useGetAllAttendanceQuery,
  useValidateAttendanceMutation,
  useGetDailyReportQuery,
} = attendanceApi;

