import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import user from "./user";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: user.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
