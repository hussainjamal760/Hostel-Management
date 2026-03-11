import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserPublic } from '@hostelite/shared-types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: IUserPublic | null;
  isAuthenticated: boolean;
}

const getInitialUser = (): IUserPublic | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as IUserPublic;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
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
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    updateUser: (state, action: PayloadAction<IUserPublic>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
