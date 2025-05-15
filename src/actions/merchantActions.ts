import { Dispatch } from "redux";

import MerchantApi from "../api/MerchantApi";
import {
  getMerchantsSuccess, getMerchantsFailure,
  getMerchantByIDSuccess, getMerchantByIDFailure,
  createMerchantSuccess, createMerchantFailure,
  updateMerchantSuccess, updateMerchantFailure,
  updateMerchantOrderSuccess, updateMerchantOrderFailure,
  deleteMerchantSuccess, deleteMerchantFailure  
} from "../redux/reducer/merchantsReducer";

export const getAllMerchants = () => {
  return async (dispatch: Dispatch) => {
    return MerchantApi
      .getAllMerchants()
      .then(resp => {
          return dispatch(getMerchantsSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(getMerchantsFailure(error.response.data))
      });
  };  
};

export const getMerchantById = (id: string | undefined) => {
  return async (dispatch: Dispatch) => {
    return MerchantApi
      .getMerchantById(id)
      .then(resp => {
          return dispatch(getMerchantByIDSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(getMerchantByIDFailure(error.response.data))
      });
  };  
};

export const createMerchant = (data: any) => {
  return async (dispatch: Dispatch) => {
    return MerchantApi
      .createMerchant(data)
      .then(resp => {
          return dispatch(createMerchantSuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(createMerchantFailure(error.response.data))
      });
  };  
};

export const updateMerchant = (data: any, merchantID: string) => {
  return async (dispatch: Dispatch) => {
    return MerchantApi
      .updateMerchant(data, merchantID)
      .then(resp => {
          return dispatch(updateMerchantSuccess(resp.data.data))
        })
      .catch(error => {        
        return dispatch(updateMerchantFailure(error.response.data))
      });
  };  
};

export const updateMerchantOrder = (originalOrder: string, destinationOrder: string) => {
  return async (dispatch: Dispatch) => {
    return MerchantApi
      .updateMerchantOrder(originalOrder, destinationOrder)
      .then(resp => {
          return dispatch(updateMerchantOrderSuccess({originalOrder, destinationOrder}))
        })
      .catch(error => {        
        return dispatch(updateMerchantOrderFailure(error.response.data))
      });
  }; 
}


export const deleteMerchant = (merchantID: string | undefined) => {
  return async (dispatch: Dispatch) => {
    return MerchantApi
      .deleteMerchant(merchantID)
      .then(resp => {
          return dispatch(deleteMerchantSuccess(merchantID))
        })
      .catch(error => {        
        return dispatch(deleteMerchantFailure(error.response.data))
      });
  };  
};