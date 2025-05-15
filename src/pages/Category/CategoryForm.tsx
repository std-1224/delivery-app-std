import React, { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  TextField,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Box,
  FormHelperText,
  FormControl
} from "@mui/material";
import { AddPhotoAlternate } from '@mui/icons-material';

// Import Types
import { ICategory } from "../../types/CategoryTypes";
import { createCategory, updateCategory } from "../../actions/categoryActions";
import { base64ToArrayBuffer } from "../../utils/convertBasetoBinary";

interface IProps {
  mode: string,
  open: boolean,
  category?: ICategory
  closeModal: () => void;
}

const CategoryForm = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { open, closeModal, category, mode } = props;
  const categoryFormData: ICategory = {
    id: "",
    name: "",
    image: "",
    image_preview_url: ""
  };

  const [errors, setErrors] = useState({
    name: "",
    image: "",
  });

  const [categoryData, setCategoryData] = useState(category ? category : categoryFormData);

  const handleValidate = (value: any, fieldName: string) => {
    if (mode === 'Create' && fieldName === 'id') {
      return true;
    }

    if (fieldName === 'image_preview_url') {
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    const { value, files } = event.target as HTMLInputElement;

    const file = !files?.length ? new Blob() : files[0];

    handleValidate(fieldName === 'image' ? file : value, fieldName);

    setCategoryData((categoryData) => {
      return {
        ...categoryData,
        [fieldName]: fieldName === 'image' ? file : value,
        'image_preview_url': fieldName === 'image' ? URL.createObjectURL(file) : categoryData['image_preview_url'],
      }
    });
  };

  const handleSubmit = async () => {
    const result = Object.keys(categoryData).map((key) => {
      return handleValidate(categoryData[key as keyof ICategory], key);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    closeModal();

    if (mode === 'Create') {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("image", categoryData.image);
      await dispatch(createCategory(formData));
    } else {
      const formData = new FormData();
      formData.append("id", categoryData.id || "");
      formData.append("name", categoryData.name);
      formData.append("image", base64ToArrayBuffer(categoryData.image));
      await dispatch(updateCategory(formData, categoryData.id || ""));
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>{mode} Category</DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sx={{ marginY: 2 }}>
            <TextField
              id="merchant-name"
              value={categoryData?.name}
              label="Name"
              variant="outlined"
              fullWidth
              onChange={(event) => handleChange(event, 'name')}
              error={errors.name !== ""}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginY: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }} >
              <FormControl error={errors.image !== ""}>
                <label htmlFor="select-logo" style={{ marginBottom: 10 }}>Logo</label>
                <input
                  accept="image/png, image/jpg, image/jpeg"
                  type="file"
                  id="select-logo"
                  style={{ display: 'none' }}
                  onChange={(event) => handleChange(event, 'image')}
                />
                <label htmlFor="select-logo">
                  {mode === 'Create' && (
                    categoryData.image_preview_url ? (
                      <img src={categoryData.image_preview_url} alt="" style={{ width: "100%" }} />
                    ) : (
                      <Fab component="span">
                        <AddPhotoAlternate />
                      </Fab>
                    )
                  )}
                  {mode === 'Edit' && (
                    <img src={categoryData.image_preview_url ? categoryData.image_preview_url : categoryData.image} alt="" style={{ width: "100%" }} />
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

export default CategoryForm;
