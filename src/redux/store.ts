import { configureStore } from '@reduxjs/toolkit';
import merchantsReducer from './reducer/merchantsReducer';
import productsReducer from './reducer/productsReducer';
import categoriesReducer from './reducer/categoriesReducer';
import settingsReducer from './reducer/settingsReducer';
import cartReducer from './reducer/cartReducer';
import authReducer from './reducer/authReducer';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    merchants: merchantsReducer,
    products: productsReducer,
    categories: categoriesReducer,
    settings: settingsReducer,
    cart: cartReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch