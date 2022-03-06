import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {persistReducer} from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage'
import hardSet from 'reduxjs-toolkit-persist/lib/stateReconciler/hardSet'
import thunk from 'redux-thunk';
import userSlice  from '../features/featchData/userSlice';
import profileSlice from '../features/featchData/profileSlice';
import postsSlice from '../features/featchData/postsSlice';
import savedSlice from '../features/featchData/savedSlice';
import conversationSlice from '../features/featchData/conversationSlice';
import messengerSlice from '../features/featchData/messengerSlice';
const persistConfig = {
  key: 'root',
  storage: storage,
 stateReconciler: hardSet,
};

const reducers = combineReducers({
  user:userSlice,
  profile:profileSlice,
  posts:postsSlice,
  saved:savedSlice,
  conversation:conversationSlice,
  messenger:messengerSlice
});

const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: [thunk]
});

