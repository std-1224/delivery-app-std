import { createSlice } from '@reduxjs/toolkit'
import { IGroup } from '../../types/GroupType';
import { IStock } from "../../types/StockTypes";

interface ProductsState {
  isLoading: boolean,
  error: string,
  list: IStock[],
  merchantProducts: IStock[],
  productGroups: IGroup[]
}

const initialState: ProductsState = {
  isLoading: false,
  error: "",
  list: [],
  merchantProducts: [],
  productGroups: []
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProductsRequest: () => {},
    getProductsSuccess: (state, action) => {
      const { payload } = action;
      state.list = payload;
    },
    getProductsFailure: (state, action) => {
      
    },
    getProductsByMerchantIDRequest: () => {},
    getProductsByMerchantIDSuccess: (state, action) => {
      const { payload } = action;
      state.merchantProducts = payload;
    },
    getProductsByMerchantIDFailure: (state, action) => {
      
    },
    createProductRequest: () => {},
    createProductSuccess: (state, action) => {
      const { payload } = action;
      state.list = [ ...state.list, payload];
    },
    createProductFailure: (state, action) => {},
    updateProductRequest: () => {},
    updateProductSuccess: (state, action) => {
      const { payload } = action;
      const index = state.list.findIndex((item) => item.id === payload.id);
      state.list[index] = payload;
    },
    updateProductFailure: (state, action) => {},
    updateProductOrderRequest: (state, action) => {},
    updateProductOrderSuccess: (state, action) => {},
    updateProductOrderFailure: (state, action) => {},
    deleteProductRequest: () => {},
    deleteProductSuccess: (state, action) => {
      const { payload } = action;
      state.list = state.list.filter((item) => item.id !== payload);
    },
    deleteProductFailure: (state, action) => {},
    getAllProductGroupsRequest: () => {},
    getAllProductGroupsSuccess: (state, action) => {
      const { payload } = action;
      const sortList = payload?.sort((a: any, b: any) => {
        return parseInt(a.order) > parseInt(b.order) ? 1 : -1;
      }); 
      state.productGroups = sortList;
    },
    getAllProductGroupsFailure: (state, action) => {
      
    },
    createProductGroupRequest: () => {},
    createProductGroupSuccess: (state, action) => {
      const { payload } = action;
      state.productGroups = [ ...state.productGroups, payload];
    },
    createProductGroupFailure: (state, action) => {},
    updateProductGroupRequest: () => {},
    updateProductGroupSuccess: (state, action) => {
      const { payload } = action;
      const index = state.productGroups.findIndex((item) => item.id === payload.id);
      state.productGroups[index] = payload;
    },
    updateProductGroupFailure: (state, action) => {},
    updateProductGroupOrderRequest: () => {},
    updateProductGroupOrderSuccess: (state, action) => {},
    updateProductGroupOrderFailure: (state, action) => {},
    deleteProductGroupRequest: (state, action) => {},
    deleteProductGroupSuccess: (state, action) => {
      const { payload } = action;
      state.productGroups = state.productGroups.filter((item) => item.id !== payload);
    },
    deleteProductGroupFailure: (state, action) => {}    
  },
})

export const { 
  getProductsRequest, getProductsSuccess, getProductsFailure,
  createProductRequest, createProductSuccess, createProductFailure,
  updateProductRequest, updateProductSuccess, updateProductFailure,
  updateProductOrderRequest, updateProductOrderSuccess, updateProductOrderFailure,
  deleteProductRequest, deleteProductSuccess, deleteProductFailure,
  getProductsByMerchantIDRequest, getProductsByMerchantIDSuccess, getProductsByMerchantIDFailure,
  getAllProductGroupsRequest, getAllProductGroupsSuccess, getAllProductGroupsFailure,
  createProductGroupRequest, createProductGroupSuccess, createProductGroupFailure,
  updateProductGroupRequest, updateProductGroupSuccess, updateProductGroupFailure,
  deleteProductGroupRequest, deleteProductGroupSuccess, deleteProductGroupFailure,
  updateProductGroupOrderRequest, updateProductGroupOrderSuccess, updateProductGroupOrderFailure
} = productsSlice.actions;

export default productsSlice.reducer