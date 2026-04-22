import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    initializeTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
