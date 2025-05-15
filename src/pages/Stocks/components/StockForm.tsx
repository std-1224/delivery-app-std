import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  TextField, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Fab, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText,
  FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import { AddPhotoAlternate } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';

// Import Types
import { IStock } from "../../../types/StockTypes";

// Import Actions
import { createProduct, updateProduct, getProductGroupsByMerchantId } from "../../../actions/productActions";

// Import Utility
import { base64ToArrayBuffer } from "../../../utils/convertBasetoBinary";

interface IProps {
  mode: string,
  open: boolean,
  stock?: IStock
  closeModal: () => void;
}

const StockForm = (props: IProps) => {
  const { id } = useParams();
  const { open, closeModal, stock, mode } = props;
  const dispatch = useAppDispatch();

  const stockFormData: IStock = {
    id: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    image: "",
    logo: "",
    prod_group: "",
    logo_preview_url: "",
    image_preview_url: "",
    merchantid: "",
    carts_quantity: 0,
    published: false,
    featured: false
  };

  const [errors, setErrors] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
    logo: "",
    prod_group: "",
    published: "",
    featured: ""
  });

  const [stockData, setStockData] = useState(stock ? stock : stockFormData);
  const groups = useAppSelector((state) => state.products.productGroups);

  useEffect(() => {
    dispatch(getProductGroupsByMerchantId(id));
  }, [dispatch, id]);

  const handleValidate = (value: any, fieldName: string) => {
    if (mode === 'Create' && fieldName === 'id') {
      return true;
    }

    if (fieldName === 'logo_preview_url' || fieldName === 'image_preview_url' || fieldName === 'carts_quantity' || fieldName === 'merchantid' || fieldName === 'published' || fieldName === 'featured') {
      return true;
    }

    if (!value) {
      setErrors((errors) => ({ ...errors, [fieldName]: `The ${fieldName} should be not empty.` }));
      return false;
    } else {
      setErrors((errors) => ({ ...errors, [fieldName]: "" }));
      return true;
    }
  };

  const handleChange = (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    const { value, files, checked } = event.target as HTMLInputElement;

    const file = !files?.length ? new Blob() : files[0];

    handleValidate((fieldName === 'logo' || fieldName === 'image') ? file : value, fieldName);

    setStockData((stockData) => {
      return {
        ...stockData,
        [fieldName]: (fieldName === 'logo' || fieldName === 'image') ? file : (fieldName === 'published' || fieldName === 'featured') ? checked : value,
        'logo_preview_url': fieldName === 'logo' ? URL.createObjectURL(file) : stockData['logo_preview_url'],
        'image_preview_url': fieldName === 'image' ? URL.createObjectURL(file) : stockData['image_preview_url'],
      }
    });
  };

  const handleSubmit = async () => {
    const result = Object.keys(stockData).map((key) => {
      return handleValidate(stockData[key as keyof IStock], key);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    closeModal();

    if (mode === 'Create') {
      const formData = new FormData();
      formData.append("name", stockData.name);
      formData.append("price", stockData.price.toString());
      formData.append("quantity", stockData.quantity.toString());
      formData.append("prod_group", stockData.prod_group);
      formData.append("description", stockData.description);
      formData.append("logo", stockData.logo);
      formData.append("image", stockData.image);
      formData.append("published", stockData.published.toString());
      formData.append("featured", stockData.featured.toString());
      formData.append("merchantid", id || "");
     await dispatch(createProduct(formData));
    } else {
      const formData = new FormData();
      formData.append("id", stockData.id || "");
      formData.append("name", stockData.name);
      formData.append("price", stockData.price.toString());
      formData.append("quantity", stockData.quantity.toString());
      formData.append("prod_group", stockData.prod_group);
      formData.append("description", stockData.description);
      formData.append("published", stockData.published.toString());
      formData.append("featured", stockData.featured.toString());
      formData.append("logo", base64ToArrayBuffer(stockData.logo));
      formData.append("image", base64ToArrayBuffer(stockData.image));
      formData.append("merchantid", id || "");
      await dispatch(updateProduct(formData, stockData.id || ""));
    }
  }

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>{mode} Product</DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sx={{ marginY: 1 }}>
            <TextField
              id="merchant-name"
              value={stockData?.name}
              label="Name"
              variant="outlined"
              fullWidth
              onChange={(event) => handleChange(event, 'name')}
              error={errors.name !== ""}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={6} sx={{ marginY: 1 }}>
            <TextField
              label="Price"
              variant="outlined"
              type="number"
              fullWidth
              value={stockData?.price}
              onChange={(event) => handleChange(event, 'price')}
              error={errors.price !== ""}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={6} sx={{ marginY: 1 }}>
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              type="number"
              value={stockData?.quantity}
              onChange={(event) => handleChange(event, 'quantity')}
              error={errors.quantity !== ""}
              helperText={errors.quantity}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginY: 1 }}>
            <FormControl fullWidth error={errors.prod_group !== ""}>
              <InputLabel id="product-group">Group</InputLabel>
              <Select
                labelId="product-group"
                id="product-group-select"
                value={stockData?.prod_group}
                label="Product Group"
                onChange={(event) => handleChange(event, 'prod_group')}
              >
                {groups.map((group) => (
                  <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.prod_group}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6} sx={{ marginY: 1 }}>
            <FormGroup>
              <FormControlLabel control={<Checkbox value={stockData.featured} checked={stockData.featured} onChange={(event) => handleChange(event, 'featured')} />} label="Featured" />
            </FormGroup>
          </Grid>
          <Grid item xs={6} sx={{ marginY: 1 }}>
            <FormGroup>
              <FormControlLabel control={<Checkbox value={stockData.published} checked={stockData.published} onChange={(event) => handleChange(event, 'published')} />} label="Published" />
            </FormGroup>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 1 }}>
            <TextField
              id="merchant-description"
              label="Description"
              placeholder="Description"
              multiline
              fullWidth
              value={stockData?.description}
              onChange={(event) => handleChange(event, 'description')}
              error={errors.description !== ""}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginY: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }} >
              <FormControl error={errors.logo !== ""}>
                <label htmlFor="select-logo" style={{ marginBottom: 10 }}>Logo</label>
                <input
                  accept="image/png, image/jpg, image/jpeg"
                  type="file"
                  id="select-logo"
                  style={{ display: 'none' }}
                  onChange={(event) => handleChange(event, 'logo')}
                />
                <label htmlFor="select-logo">
                  {mode === 'Create' && (
                    stockData.logo_preview_url ? (
                      <img src={stockData.logo_preview_url} alt="" style={{ width: "100%" }} />
                    ) : (
                      <Fab component="span">
                        <AddPhotoAlternate />
                      </Fab>
                    )
                  )}
                  {mode === 'Edit' && (
                    <img src={stockData.logo_preview_url ? stockData.logo_preview_url : stockData.logo} alt="" style={{ width: "100%" }} />
                  )}
                </label>
                <FormHelperText>{errors.logo}</FormHelperText>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginY: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }} >
              <FormControl error={errors.image !== ""}>
                <label htmlFor="select-image" style={{ marginBottom: 10 }}>Image</label>
                <input
                  accept="image/png, image/jpg, image/jpeg"
                  type="file"
                  id="select-image"
                  style={{ display: 'none' }}
                  onChange={(event) => handleChange(event, 'image')}
                />
                <label htmlFor="select-image">
                  {mode === 'Create' && (
                    stockData.image_preview_url ? (
                      <img src={stockData.image_preview_url} alt="" style={{ width: "100%" }} />
                    ) : (
                      <Fab component="span">
                        <AddPhotoAlternate />
                      </Fab>
                    )
                  )}
                  {mode === 'Edit' && (
                    <img src={stockData.image_preview_url ? stockData.image_preview_url : stockData.image} alt="" style={{ width: "100%" }} />
                  )}
                </label>
                <FormHelperText>{errors.image}</FormHelperText>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog >
  );
};

export default StockForm;
