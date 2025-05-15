import axios from 'axios';
import BaseApi from './BaseApi';

class ProductApi extends BaseApi {  
  getAllProducts() {
    return axios.get(
      this.REACT_APP_SERVER_URL + 'products',      
      {        
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  getProductsByMerchantID(merchantID: string | undefined) {
    return axios.get(
      this.REACT_APP_SERVER_URL + 'products/' + merchantID,      
      {        
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }

  createProduct(data: any) {
    return axios.post(
      this.REACT_APP_SERVER_URL + 'products/create',
      data,
      {      
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }

  updateProduct(data: any, productID: string) {
    return axios.put(
      this.REACT_APP_SERVER_URL + "products/" + productID,
      data,
      {      
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }

  updateProductOrder(originalOrder: string, destinationOrder: string) {
    return axios.post(
      this.REACT_APP_SERVER_URL + "products/order",
      {
        original_order: originalOrder,
        destination_order: destinationOrder
      },
      {      
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }

  deleteProduct(id: string | undefined) {
    return axios.delete(
      this.REACT_APP_SERVER_URL + "products/" + id,
      {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }

  getAllProductGroups() {
    return axios.get(
      this.REACT_APP_SERVER_URL + 'productgroups',
      {        
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  getProductGroupsByMerchantId(id: string | undefined) {
    return axios.get(
      this.REACT_APP_SERVER_URL + 'productgroups/' + id,
      {        
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  createProductGroup(data: any) {
    return axios.post(
      this.REACT_APP_SERVER_URL + 'productgroups/create',
      data,
      {      
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }

  updateProductGroup(data: any) {
    return axios.put(
      this.REACT_APP_SERVER_URL + 'productgroups/' + data.id,
      data,
      {      
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }

  updateProductGroupOrder(originalOrder: string, destinationOrder: string) {
    return axios.post(
      this.REACT_APP_SERVER_URL + 'productgroups/order',
      {
        original_order: originalOrder,
        destination_order: destinationOrder
      },
      {      
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }

  deleteProductGroup(id: string | undefined) {
    return axios.delete(
      this.REACT_APP_SERVER_URL + "productgroups/" + id,
      {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      }
    );
  }  
}
const productApi = new ProductApi();
export default productApi;