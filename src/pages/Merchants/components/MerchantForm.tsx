import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import NumberFormat from 'react-number-format';
import {
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Box,
  FormHelperText
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { AddPhotoAlternate } from '@mui/icons-material';

// Import Types
import { IMerchant } from '../../../types/MerchantTypes';

// Import Actions
import { createMerchant, updateMerchant } from "../../../actions/merchantActions";
import { getAllCategories } from "../../../actions/categoryActions";

// Import Utility
import { base64ToArrayBuffer } from "../../../utils/convertBasetoBinary";

interface IProps {
  mode: string,
  open: boolean,
  merchant?: IMerchant
  closeModal: () => void;
}

const MerchantForm = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { open, closeModal, merchant, mode } = props;
  const merchantFormData: IMerchant = {
    id: "",
    name: "",
    description: "",
    category: "",
    address: "",
    email: "",
    phone: "",
    logo: "",
    image: "",
    logo_preview_url: "",
    image_preview_url: ""
  };

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    email: "",
    phone: "",
    logo: "",
    image: "",
  });

  const [merchantData, setMerchantData] = useState(merchant ? merchant : merchantFormData);

  const categories = useAppSelector((state) => state.categories.list);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSubmit = () => {
    const result = Object.keys(merchantData).map((key) => {
      return handleValidate(merchantData[key as keyof IMerchant], key);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    closeModal();
    if (mode === 'Create') {
      const formData = new FormData();
      formData.append("name", merchantData.name);
      formData.append("description", merchantData.description);
      formData.append("category", merchantData.category);
      formData.append("address", merchantData.address);
      formData.append("email", merchantData.email);
      formData.append("phone", merchantData.phone);
      formData.append("logo", merchantData.logo);
      formData.append("image", merchantData.image);
      dispatch(createMerchant(formData));
    } else {
      const formData = new FormData();
      formData.append("id", merchantData.id || "");
      formData.append("name", merchantData.name);
      formData.append("description", merchantData.description);
      formData.append("category", merchantData.category);
      formData.append("address", merchantData.address);
      formData.append("email", merchantData.email);
      formData.append("phone", merchantData.phone);
      formData.append("logo", base64ToArrayBuffer(merchantData.logo));
      formData.append("image", base64ToArrayBuffer(merchantData.image));
      dispatch(updateMerchant(formData, merchantData.id || ""));
    }
  };

  const handleChange = (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    const { value, files } = event.target as HTMLInputElement;

    const file = !files?.length ? new Blob() : files[0];

    handleValidate((fieldName === 'logo' || fieldName === 'image') ? file : value, fieldName);

    setMerchantData((merchantData) => {
      return {
        ...merchantData,
        [fieldName]: (fieldName === 'logo' || fieldName === 'image') ? file : value,
        'logo_preview_url': fieldName === 'logo' ? URL.createObjectURL(file) : merchantData['logo_preview_url'],
        'image_preview_url': fieldName === 'image' ? URL.createObjectURL(file) : merchantData['image_preview_url'],
      }
    });
  };

  const handleValidate = (value: any, fieldName: string) => {
    if (mode === 'Create' && fieldName === 'id') {
      return true;
    }

    if (fieldName === 'logo_preview_url' || fieldName === 'image_preview_url') {
      return true;
    }

    if (!value) {
      setErrors((errors) => ({ ...errors, [fieldName]: `The ${fieldName} should be not empty.` }));
      return false;
    } else {
      if (fieldName === "email") {
        let regex = /\S+@\S+\.\S+/;
        if (!regex.test(value)) {
          setErrors((errors) => ({ ...errors, [fieldName]: "Invalid email format." }));
          return false;
        }
        setErrors((errors) => ({ ...errors, [fieldName]: "" }));
        return true;
      } else {
        setErrors((errors) => ({ ...errors, [fieldName]: "" }));
        return true;
      }
    }
  };

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>{mode} Merchant</DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} sx={{ marginY: 2 }}>
            <TextField
              id="merchant-name"
              value={merchantData?.name}
              label="Name"
              variant="outlined"
              fullWidth
              onChange={(event) => handleChange(event, 'name')}
              error={errors.name !== ""}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={6} sx={{ marginY: 2 }}>
            <FormControl fullWidth error={errors.category !== ""}>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                label="Category"
                value={merchantData.category}
                onChange={(event) => handleChange(event, 'category')}
              >
                {categories.map((category) => (
                  <MenuItem value={category.id} key={category.id} sx={{ textTransform: 'uppercase' }}>{category.name.toUpperCase()}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 2 }}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              value={merchantData.address}
              onChange={(event) => handleChange(event, 'address')}
              error={errors.address !== ""}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={6} sx={{ marginY: 2 }}>
            <TextField
              label="Contact Mail"
              variant="outlined"
              fullWidth
              type="email"
              value={merchantData.email}
              onChange={(event) => handleChange(event, 'email')}
              error={errors.email !== ""}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={6} sx={{ marginY: 2 }}>
            <NumberFormat
              id="merchant-phone-number"
              label="Contact Number"
              format="+# (###) ###-####"
              mask="_"
              customInput={TextField}
              type="text"
              value={merchantData.phone}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(event, 'phone')}
              fullWidth
              error={errors.phone !== ""}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="merchant-description"
              label="Description"
              placeholder="Description"
              multiline
              fullWidth
              value={merchantData.description}
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
                    merchantData.logo_preview_url ? (
                      <img src={merchantData.logo_preview_url} alt="" style={{ width: "100%" }} />
                    ) : (
                      <Fab component="span">
                        <AddPhotoAlternate />
                      </Fab>
                    )
                  )}
                  {mode === 'Edit' && (
                    <img src={merchantData.logo_preview_url ? merchantData.logo_preview_url : merchantData.logo} alt="" style={{ width: "100%" }} />
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
                    merchantData.image_preview_url ? (
                      <img src={merchantData.image_preview_url} alt="" style={{ width: "100%" }} />
                    ) : (
                      <Fab component="span">
                        <AddPhotoAlternate />
                      </Fab>
                    )
                  )}
                  {mode === 'Edit' && (
                    <img src={merchantData.image_preview_url ? merchantData.image_preview_url : merchantData.image} alt="" style={{ width: "100%" }} />
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
    </Dialog>
  );
};

export default MerchantForm;
