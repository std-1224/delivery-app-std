import React, { useState } from "react";
import QRCode from "react-qr-code";
import { TextField, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Divider } from "@mui/material";
import { IStock } from "../types/StockTypes";

interface IProps {
  stock: IStock | undefined
  open: boolean,
  closeModal: () => void;
}

interface IUserData {
  firstname: string,
  lastname: string,
  email: string,
  address1: string,
  address2: string,
  city: string,
  state: string,
  zip_code: string
}


const OrderForm = (props: IProps) => {
  const { open, closeModal, stock } = props;
  const [step, setStep] = useState("first");

  const [orderInfo, setOrderInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const handleValidate = (fieldName: string, value: string) => {
    if(!value) {
      setErrors((errors) => ({ ...errors, [fieldName]: "This field should be not empty."}));
      return false;
    } else {
      if (fieldName === "email") {
        let regex = /\S+@\S+\.\S+/;        
        if (!regex.test(value)) {
          setErrors((errors) => ({ ...errors, [fieldName]: "Invalid email format."}));
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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, fieldName: string) => {
    handleValidate(fieldName, event.target.value);
    setOrderInfo((orderInfo) => {return {...orderInfo, [fieldName]: event.target.value }});
  };

  const handleSubmitOrder = () => {    
    const result = Object.keys(orderInfo).map((key) => {
      return handleValidate(key, orderInfo[key as keyof IUserData]);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    setStep("second");
  };

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="md">
      {step === 'first' && (
        <>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>      
            <Typography variant="h3">
              Order
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 8, md: 12 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {stock?.name}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  {stock?.description}
                </Typography>
                <Typography variant="h4">
                  €{stock?.price}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img src={stock?.image} alt="" style={{ width: "100%" }} />
              </Grid>
            </Grid>
            <Divider sx={{ marginY: 5 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} sx={{ marginBottom: 1 }}>
                <TextField
                  autoComplete="off"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={orderInfo.firstname}
                  onChange={(event) => handleChange(event, 'firstname')}
                  error={errors.firstname !== ""}
                  helperText={errors.firstname}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginBottom: 1 }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="off"
                  value={orderInfo.lastname}
                  onChange={(event) => handleChange(event, 'lastname')}
                  error={errors.lastname !== ""}
                  helperText={errors.lastname}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="off"
                  value={orderInfo.email}
                  onChange={(event) => handleChange(event, 'email')}
                  error={errors.email !== ""}
                  helperText={errors.email}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="address1"
                  label="Street Address"
                  value={orderInfo.address1}
                  onChange={(event) => handleChange(event, 'address1')}
                  error={errors.address1 !== ""}
                  helperText={errors.address1}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="address2"
                  label="Street Address Line 2"
                  value={orderInfo.address2}
                  onChange={(event) => handleChange(event, 'address2')}
                  error={errors.address2 !== ""}
                  helperText={errors.address2}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginBottom: 1 }}>
                <TextField
                  autoComplete="off"
                  name="city"
                  variant="outlined"
                  required
                  fullWidth              
                  label="City"
                  autoFocus
                  value={orderInfo.city}
                  onChange={(event) => handleChange(event, 'city')}
                  error={errors.city !== ""}
                  helperText={errors.city}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginBottom: 1 }}>
                <TextField
                  autoComplete="off"
                  name="state"
                  variant="outlined"
                  required
                  fullWidth              
                  label="State / Province"
                  autoFocus
                  value={orderInfo.state}
                  onChange={(event) => handleChange(event, 'state')}
                  error={errors.state !== ""}
                  helperText={errors.state}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <TextField
                  autoComplete="off"
                  name="zip_code"
                  variant="outlined"
                  required
                  fullWidth              
                  label="Postal / Zip Code"
                  autoFocus
                  value={orderInfo.zip_code}
                  onChange={(event) => handleChange(event, 'zip_code')}
                  error={errors.zip_code !== ""}
                  helperText={errors.zip_code}
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmitOrder} variant="contained">Submit</Button>
          </DialogActions>
        </>
      )}
      {step === 'second' && (
        <Box sx={{ backgroundColor: 'white', padding: '30px' }}>
          <QRCode value="hey" />
        </Box>
      )}
    </Dialog>
  );
};

export default OrderForm;
