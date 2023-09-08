import { configureStore,getDefaultMiddleware  } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userState } from './userState';
import {professionalState} from './professionalsState'
import {adminState} from './adminState'


const userPersistConfig = { key: 'user', storage, version: 1 };
const professionalPersistConfig = {key: 'professionals', storage,version: 1}
const adminPersistConfig = {key: 'admin', storage,version: 1}


const userPersistReducer = persistReducer(userPersistConfig, userState.reducer);
const professionalPersistReducer = persistReducer(professionalPersistConfig,professionalState.reducer);
const adminPersistReducer = persistReducer(adminPersistConfig, adminState.reducer);


export const Store = configureStore({
  reducer: {
    user: userPersistReducer,
    professional: professionalPersistReducer,
    admin: adminPersistReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false, // Disable serializableCheck
  }),
});

export const persistor = persistStore(Store);
