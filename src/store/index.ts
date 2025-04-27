import { configureStore } from "@reduxjs/toolkit";
import modelTypeStore from "./modelTypeStore";
const store = configureStore({
  reducer: {
    modelTypeStore,
  },
});
export default store;
