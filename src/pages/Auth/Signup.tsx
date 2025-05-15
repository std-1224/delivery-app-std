import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Button, TextField, Link, Grid, Typography, Container, Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { makeStyles } from '@mui/styles';

// Import Actions
import { signup } from "../../actions/authActions";

const useStyles = makeStyles({
  container: {
    minHeight: "100vh",
    display: "flex !important",
    alignItems: "center",
    justifyContent: "center"
  }
});

interface IUserData {
  email: string
}

const Signup = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [userData, setUserData] = useState<IUserData>({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: ""
  });

  const [merchantRole, setMerchantRole] = useState(false);

  const handleMerchantRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMerchantRole(event.target.checked);
  };

  const systemError = useAppSelector((state) => state.auth.error);
  const signupSuccessed = useAppSelector((state) => state.auth.signupSuccessed);

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
    setUserData((userData) => {return {...userData, [fieldName]: event.target.value }});
  };

  const handleSignup = async () => {
    const result = Object.keys(userData).map((key) => {
      return handleValidate(key, userData[key as keyof IUserData]);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    const formData = {
      email: userData.email,
      role: merchantRole ? "merchant" : "user"
    };

    dispatch(signup(formData));
  }

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Box sx={{ minWidth: 375 }}>
        <Typography component="h1" variant="h5" sx={{ marginBottom: 4 }}>
          Sign Up
        </Typography>
        <Box>
          <Grid container spacing={2}>            
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={userData.email}
                onChange={(event) => handleChange(event, 'email')}
                error={errors.email !== ""}
                helperText={errors.email}
              />
            </Grid>
          </Grid>
          <Grid sx={{ marginY: 2 }}>
            <FormGroup>
              <FormControlLabel control={<Checkbox value={merchantRole} onChange={handleMerchantRole}/>} label="If you want be a Merchant, please click this." />
            </FormGroup>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"            
            sx={{ margin: '15px 0' }}
            onClick={() => handleSignup()}
          >
            Sign up
          </Button>
        </Box>
        <Typography variant="body2" sx={{ marginY: 3 }} color="red">
          {systemError}
        </Typography>
        {signupSuccessed && (
          <Typography variant="body2" sx={{ marginY: 3 }} color="green">
            Sign up Success. &nbsp;
            <Link href="/login" variant="body2">
              Please login with your email.
            </Link>
          </Typography>
        )}
        <Grid>
          <Grid item>
            
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Signup
