import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserPublic } from '@hostelite/shared-types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: IUserPublic | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string; user: IUserPublic }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
      
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', state.token);
        if (state.refreshToken) {
            localStorage.setItem('refreshToken', state.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    updateUser: (state, action: PayloadAction<IUserPublic>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setCredentials, updateUser, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
