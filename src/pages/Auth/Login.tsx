import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { Button, TextField, Grid, Typography, Container, Box, Link } from "@mui/material";
import { makeStyles } from '@mui/styles';

// Import Actions
import { login } from "../../actions/authActions";

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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [userData, setUserData] = useState<IUserData>({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: ""
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
    setUserData((userData) => {return {...userData, [fieldName]: event.target.value }});
  };

  const handleLogin = async () => {
    const result = Object.keys(userData).map((key) => {
      return handleValidate(key, userData[key as keyof IUserData]);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    const formData = {
      email: userData.email
    };

    let resp = await dispatch(login(formData));
    if (resp.payload.role) {
      navigate('/');
    }
  }

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Box sx={{ minWidth: 375 }}>
        <Typography component="h1" variant="h5" sx={{ marginBottom: 4 }}>
          Log In
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"            
            sx={{ margin: '15px 0' }}
            onClick={() => handleLogin()}
          >
            Log In
          </Button>
        </Box>
        <Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              If you want to register, please click here. 
            </Link>
          </Grid>
        </Grid>   
      </Box>
    </Container>
  );
};

export default Login
