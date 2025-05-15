import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  isLoading: boolean,
  theme: 'light' | 'dark'
}

const initialState: SettingsState = {
  isLoading: false,
  theme: 'light',
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === 'light') {
        state.theme = 'dark';
      } else {
        state.theme = 'light';
      }
    },
  },
})

export const { toggleTheme } = settingsSlice.actions;

export default settingsSlice.reducer