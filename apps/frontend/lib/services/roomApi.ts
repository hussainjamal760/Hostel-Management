import { baseApi } from './api';
import { IRoom } from '@hostelite/shared-types';
import { ApiResponse } from './authApi';

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<ApiResponse<IRoom[]>, { hostelId?: string; floor?: number; roomType?: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: '/rooms',
        method: 'GET',
        params,
      }),
      providesTags: ['Room'],
    }),
    bulkCreateRooms: builder.mutation<ApiResponse<IRoom[]>, { hostelId?: string; rooms: any[] }>({
       query: ({ hostelId, rooms }) => ({
        url: '/rooms/bulk',
        method: 'POST',
        body: { rooms, hostelId },
      }),
      invalidatesTags: ['Room', 'Hostel'],
    }),
    deleteRoom: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room', 'Hostel'],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useBulkCreateRoomsMutation,
  useDeleteRoomMutation,
} = roomApi;
