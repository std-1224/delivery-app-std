import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import {
  TextField,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Import Types
import { IGroup } from "../../../types/GroupType";
import { createProductGroup, updateProductGroup } from "../../../actions/productActions";

interface IProps {
  mode: string,
  open: boolean,
  group?: IGroup
  closeModal: () => void;
}

const ProductGroupForm = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { open, closeModal, group, mode } = props;

  const productGroupFormData: IGroup = {
    id: "",
    name: "",
    merchantid: ""
  };

  const [errors, setErrors] = useState({
    name: "",
  });

  const [productGroupData, setProductGroupData] = useState(group ? group : productGroupFormData);

  const handleValidate = (value: any, fieldName: string) => {
    if (mode === 'Create' && fieldName === 'id') {
      return true;
    }

    if (fieldName === 'merchantid') {
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
    const { value } = event.target as HTMLInputElement;
    handleValidate(value, fieldName);

    setProductGroupData((productGroupData) => {
      return {
        ...productGroupData,
        [fieldName]: value
      }
    });
  };

  const handleSubmit = async () => {
    const result = Object.keys(productGroupData).map((key) => {
      return handleValidate(productGroupData[key as keyof IGroup], key);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    closeModal();

    if (mode === 'Create') {
      const formData = {
        name: productGroupData.name,
        merchantid: id
      };
      await dispatch(createProductGroup(formData));
    } else {
      await dispatch(updateProductGroup(productGroupData));
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>{mode} Product Group</DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sx={{ marginY: 2 }}>
            <TextField
              id="produc-group-name"
              value={productGroupData?.name}
              label="Product Group Name"
              variant="outlined"
              fullWidth
              onChange={(event) => handleChange(event, 'name')}
              error={errors.name !== ""}
              helperText={errors.name}
            />
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

export default ProductGroupForm;
