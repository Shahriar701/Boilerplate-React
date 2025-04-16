import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Create a temporary dummy reducer
const temporaryReducer = (state = {}, action: any) => state;

// Create the store with a temporary reducer
export const store = configureStore({
  reducer: {
    products: temporaryReducer,
  },
  // You can add middleware here if needed
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: [],
      // Ignore these field paths in all actions
      ignoredActionPaths: [],
      // Ignore these paths in the state
      ignoredPaths: [],
    },
  }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Later we'll replace the reducer with the real one
// import { productReducer } from './slices/product.slice';
// store.replaceReducer({ products: productReducer });

// Define RootState based on the store's state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks to use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 