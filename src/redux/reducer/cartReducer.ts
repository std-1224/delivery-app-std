import { createSlice, current } from '@reduxjs/toolkit';
import { IStock } from '../../types/StockTypes';

interface CartState {
  isLoading: boolean,
  list: IStock[],
  currentMerchant: string
}

const initialState: CartState = {
  isLoading: false,
  list: [],
  currentMerchant: ''
}

export const categoriesSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    getCartProducts: (state) => {

    },
    addProductToCart: (state, action) => {
      const { product } = action.payload;
      state.currentMerchant = product.merchantid;
      const productIDs = current(state.list).map((product) => product.id);
      if (productIDs.includes(product.id)) {
        const index = state.list.findIndex((item) => item.id === product.id);
        state.list[index] = { ...state.list[index], carts_quantity: state.list[index].carts_quantity + 1 };
      } else {
        const updatedProduct = { ...product, carts_quantity: 1 };
        state.list = state.list.concat(updatedProduct);
      }
    },
    removeProductFromCart: (state, action) => {
      const { product } = action.payload;
      const index = state.list.findIndex((item) => item.id === product.id);
      
      if (state.list[index].carts_quantity > 1) {
        state.list[index] = { ...state.list[index], carts_quantity: state.list[index].carts_quantity - 1 };
      } else {
        state.list = state.list.filter((item, i) => i !== index);
      }
    },
    removeAllProductFromCart: (state, action) => {
      const { product } = action.payload;
      state.list = product;
    }
  },
})

export const { getCartProducts, addProductToCart, removeProductFromCart, removeAllProductFromCart } = categoriesSlice.actions;

export default categoriesSlice.reducer