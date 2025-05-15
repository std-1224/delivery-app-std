import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Box, Button, TextField, Typography } from "@mui/material";

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

const DeliveryInfoPage = () => {
  const navigate = useNavigate();

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

    navigate("/payment-methods")

  };

  return (
    <Box sx={{ paddingY: 10 }}>
      <Container sx={{ maxWidth: '900px !imoportant;' }}>    
        <Typography variant="h5" sx={{ marginY: 5 }}>
          Please add these informations.
        </Typography>  
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
              autoComplete="off"
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
              autoComplete="off"
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
          <Grid item xs={12} sm={4} sx={{ marginBottom: 1 }}>
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
          <Grid item xs={12} sm={4} sx={{ marginBottom: 1 }}>
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
          <Grid item xs={12} sm={4} sx={{ marginBottom: 1 }}>
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
        <Box sx={{ textAlign: 'center', marginY: 4 }}>          
          <Button onClick={() => handleSubmitOrder()} variant="contained">Continue</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DeliveryInfoPage;
