import { configureStore, createSlice } from '@reduxjs/toolkit'

const initialTheme = localStorage.getItem('shop-panel-theme') || 'light'

const appSlice = createSlice({
  name: 'app',
  initialState: { theme: initialTheme, authenticated: sessionStorage.getItem('shop-panel-session') === 'active' },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('shop-panel-theme', state.theme)
    },
    signIn(state) {
      state.authenticated = true
      sessionStorage.setItem('shop-panel-session', 'active')
    },
    signOut(state) {
      state.authenticated = false
      sessionStorage.removeItem('shop-panel-session')
    },
  },
})

export const { toggleTheme, signIn, signOut } = appSlice.actions
export const store = configureStore({ reducer: { app: appSlice.reducer } })
