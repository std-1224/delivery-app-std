import { createSlice } from '@reduxjs/toolkit';
import { ICategory } from '../../types/CategoryTypes';

interface CategoriesState {
  isLoading: boolean,
  error: string,
  list: ICategory[]
}

const initialState: CategoriesState = {
  isLoading: false,
  error: "",
  list: [],
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    getCategoriesRequest: () => {},
    getCategoriesSuccess: (state, action) => {
      const { payload } = action;
      const sortList = payload?.sort((a: any, b: any) => {
        return parseInt(a.order) > parseInt(b.order) ? 1 : -1;
      });      
      state.list = sortList;
    },
    getCategoriesFailure: (state, action) => {
      const { payload } = action;
      state.error = payload;
    },
    createCategoryRequest: () => {},
    createCategorySuccess: (state, action) => {
      const { payload } = action;
      state.list = state.list.concat(payload);
    },
    createCategoryFailure: (state, action) => {
      const { payload } = action;
      state.error = payload;
    },
    updateCategoryRequest: () => {},
    updateCategorySuccess: (state, action) => {
      const { payload } = action;
      const index = state.list.findIndex((item) => item.id === payload.id);
      state.list[index] = payload;
    },
    updateCategoryFailure: (state, action) => {
      const { payload } = action;
      state.error = payload;
    },
    updateCategoryOrderRequest: () => {},
    updateCategoryOrderSuccess: (state, action) => {},
    updateCategoryOrderFailure: (state, action) => {},
    deleteCategoryRequest: () => {},
    deleteCategorySuccess: (state, action) => {
      const { payload } = action;
      state.list = state.list.filter((category) => category.id !== payload );
    },
    deleteCategoryFailure: (state, action) => {
      const { payload } = action;
      state.error = payload;
    }
  },
})

export const {
  getCategoriesRequest, getCategoriesSuccess, getCategoriesFailure,
  createCategoryRequest, createCategorySuccess, createCategoryFailure,
  updateCategoryRequest, updateCategorySuccess, updateCategoryFailure,
  updateCategoryOrderRequest, updateCategoryOrderSuccess, updateCategoryOrderFailure,
  deleteCategoryRequest, deleteCategorySuccess, deleteCategoryFailure,
} = categoriesSlice.actions;

export default categoriesSlice.reducer