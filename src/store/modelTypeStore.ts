import { createSlice } from "@reduxjs/toolkit";
const store = createSlice({
  name: "modelTypeStore",
  initialState: {
    modelType: "deepseek/deepseek-chat-v3-0324:free",
  },
  reducers: {
    setModelType: (state, { payload }) => {
      state.modelType = payload;
    },
  },
});
export const { setModelType } = store.actions;
export default store.reducer;
