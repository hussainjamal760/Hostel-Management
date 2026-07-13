import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../features/authSlice';
import { RootState } from '../store';
import { Mutex } from 'async-mutex';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers: Headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const mutex = new Mutex();

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const currentRefreshToken = state.auth.refreshToken;

        if (!currentRefreshToken) {
          api.dispatch(logout());
          return result;
        }

        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken: currentRefreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { data } = refreshResult.data as any;
          // Rehydrate user from the backend response first (handles page reload scenario)
          const user = data?.user || (api.getState() as RootState).auth.user;
          
          if (user && data?.tokens) {
            api.dispatch(setCredentials({ 
              token: data.tokens.accessToken, 
              refreshToken: data.tokens.refreshToken, 
              user 
            }));
            
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

const createBaseApi = () => createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Hostel', 'Room', 'Student', 'Payment', 'Complaint', 'Notification', 'Manager', 'AdminPayment', 'Expense', 'HostelStats', 'PaymentCard'],
  endpoints: () => ({}),
});

type BaseApiType = ReturnType<typeof createBaseApi>;

let apiInstance: BaseApiType;

if (process.env.NODE_ENV === 'production') {
  apiInstance = createBaseApi();
} else {
  if (!(global as any).baseApiInstance) {
    (global as any).baseApiInstance = createBaseApi();
  }
  apiInstance = (global as any).baseApiInstance;
}

export const baseApi = apiInstance;
