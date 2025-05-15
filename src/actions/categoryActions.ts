import { Dispatch } from "redux";

import CategoryApi from "../api/CategoryApi";
import {
  getCategoriesSuccess, getCategoriesFailure,
  createCategorySuccess, createCategoryFailure,
  updateCategorySuccess, updateCategoryFailure,
  deleteCategorySuccess, deleteCategoryFailure,
  updateCategoryOrderSuccess, updateCategoryOrderFailure
} from "../redux/reducer/categoriesReducer";

export const getAllCategories = () => {
  return async (dispatch: Dispatch) => {
    return CategoryApi
      .getAllCategories()
      .then(resp => {
        return dispatch(getCategoriesSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(getCategoriesFailure(error.response.data))
      });
  };  
};

export const createCategory = (data: any) => {
  return async (dispatch: Dispatch) => {
    return CategoryApi
      .createCategory(data)
      .then(resp => {
          return dispatch(createCategorySuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(createCategoryFailure(error.response.data))
      });
  };  
};

export const updateCategory = (data: any, categoryID: string) => {
  return async (dispatch: Dispatch) => {
    return CategoryApi
      .updateCategory(data, categoryID)
      .then(resp => {
          return dispatch(updateCategorySuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(updateCategoryFailure(error.response.data))
      });
  };  
};

export const updateCategoryOrder = (originalOrder: string, destinationOrder: string) => {
  return async (dispatch: Dispatch) => {
    return CategoryApi
      .updateCategoryOrder(originalOrder, destinationOrder)
      .then(resp => {
          return dispatch(updateCategoryOrderSuccess({originalOrder, destinationOrder}))
        })
      .catch(error => {        
        return dispatch(updateCategoryOrderFailure(error.response.data))
      });
  };
}


export const deleteCategory = (categoryID: string | undefined) => {
  return async (dispatch: Dispatch) => {
    return CategoryApi
      .deleteCategory(categoryID)
      .then(resp => {
          return dispatch(deleteCategorySuccess(categoryID))
        })
      .catch(error => {        
        return dispatch(deleteCategoryFailure(error.response.data))
      });
  };  
};