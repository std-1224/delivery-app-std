import { Dispatch } from "redux";

import ProductApi from "../api/ProductApi";
import {
  getProductsSuccess, getProductsFailure,
  createProductSuccess, createProductFailure,
  updateProductSuccess, updateProductFailure,
  deleteProductSuccess, deleteProductFailure,
  getProductsByMerchantIDSuccess, getProductsByMerchantIDFailure,
  getAllProductGroupsSuccess, getAllProductGroupsFailure,
  createProductGroupSuccess, createProductGroupFailure,
  updateProductGroupSuccess, updateProductGroupFailure,
  deleteProductGroupSuccess, deleteProductGroupFailure,
  updateProductOrderSuccess, updateProductOrderFailure,
  updateProductGroupOrderSuccess, updateProductGroupOrderFailure
} from "../redux/reducer/productsReducer";

export const getAllProducts = () => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .getAllProducts()
      .then(resp => {
        return dispatch(getProductsSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(getProductsFailure(error.response.data))
      });
  };  
};

export const getProductsByMerchantID = (merchantID: string | undefined) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .getProductsByMerchantID(merchantID)
      .then(resp => {
        return dispatch(getProductsByMerchantIDSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(getProductsByMerchantIDFailure(error.response.data))
      });
  };
};

export const createProduct = (data: any) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .createProduct(data)
      .then(resp => {
          return dispatch(createProductSuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(createProductFailure(error.response.data))
      });
  };  
};

export const updateProduct = (data: any, categoryID: string) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .updateProduct(data, categoryID)
      .then(resp => {
          return dispatch(updateProductSuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(updateProductFailure(error.response.data))
      });
  };  
};

export const updateProductOrder = (originalOrder: string, destinationOrder: string) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .updateProductOrder(originalOrder, destinationOrder)
      .then(resp => {
          return dispatch(updateProductOrderSuccess({originalOrder, destinationOrder}))
        })
      .catch(error => {        
        return dispatch(updateProductOrderFailure(error.response.data))
      });
  }; 
};


export const deleteProduct = (productID: string | undefined) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .deleteProduct(productID)
      .then(resp => {
          return dispatch(deleteProductSuccess(productID))
        })
      .catch(error => {        
        return dispatch(deleteProductFailure(error.response.data))
      });
  };  
};

export const getAllProductGroups = () => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .getAllProductGroups()
      .then(resp => {
        return dispatch(getAllProductGroupsSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(getAllProductGroupsFailure(error.response.data))
      });
  };  
};

export const getProductGroupsByMerchantId = (id: string | undefined) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .getProductGroupsByMerchantId(id)
      .then(resp => {
        return dispatch(getAllProductGroupsSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(getAllProductGroupsFailure(error.response.data))
      });
  };  
};

export const createProductGroup = (data: any) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .createProductGroup(data)
      .then(resp => {
          return dispatch(createProductGroupSuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(createProductGroupFailure(error.response.data))
      });
  };  
};

export const updateProductGroup = (data: any) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .updateProductGroup(data)
      .then(resp => {
          return dispatch(updateProductGroupSuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(updateProductGroupFailure(error.response.data))
      });
  };  
};

export const updateProductGroupOrder = (originalOrder: string, destinationOrder: string) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .updateProductGroupOrder(originalOrder, destinationOrder)
      .then(resp => {
          return dispatch(updateProductGroupOrderSuccess({originalOrder, destinationOrder}))
        })
      .catch(error => {        
        return dispatch(updateProductGroupOrderFailure(error.response.data))
      });
  };
}

export const deleteProductGroup = (groupID: string | undefined) => {
  return async (dispatch: Dispatch) => {
    return ProductApi
      .deleteProductGroup(groupID)
      .then(resp => {
          return dispatch(deleteProductGroupSuccess(groupID))
        })
      .catch(error => {        
        return dispatch(deleteProductGroupFailure(error.response.data))
      });
  };  
};