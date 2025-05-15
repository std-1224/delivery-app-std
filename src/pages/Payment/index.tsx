import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NumberFormat from 'react-number-format';
import { Container, Typography, Box, TextField, Grid, Button } from "@mui/material";

// Import Components
import FrontSvg from "./components/FrontSvg";
import BackSvg from "./components/BackSvg";

// Import Styles
import "./payment.css";

interface IPaymentData {
  name: string,
  card_number: string,
  expiration_date: string,
  security_code: string
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true)
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    card_number: "",
    expiration_date: "",
    security_code: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    card_number: "",
    expiration_date: "",
    security_code: ""
  });

  useEffect(() => {
    const result = Object.keys(paymentInfo).map((key) => {
      return !paymentInfo[key as keyof IPaymentData] ? false : true;
    });
    const isInvalid = result.filter((r) => !r).length > 0;

    if (!isInvalid) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [paymentInfo]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    handleValidate(fieldName, event.target.value);
    setPaymentInfo((paymentInfo) => {return {...paymentInfo, [fieldName]: event.target.value }});
  };

  const limit = (val: string, max: string) => {
    if (val.length === 1 && val[0] > max[0]) {
      val = '0' + val;
    }
  
    if (val.length === 2) {
      if (Number(val) === 0) {
        val = '01';
  
      } else if (val > max) {
        val = max;
      }
    }
  
    return val;
  };
  
  const cardExpiry = (val: string) => {
    let month = limit(val.substring(0, 2), '12');
    let year = val.substring(2, 4);
  
    return month + (year.length ? '/' + year : '');
  };

  const handleValidate = (fieldName: string, value: string) => {
    if(!value) {
      setErrors((errors) => ({ ...errors, [fieldName]: "This field should be not empty."}));
      return false;
    } else {
      setErrors((errors) => ({ ...errors, [fieldName]: "" }));
      return true;
    }
  };

  const handleCompletePayment = () => {
    const result = Object.keys(paymentInfo).map((key) => {
      return handleValidate(key, paymentInfo[key as keyof IPaymentData]);
    });

    const isInvalid = result.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    navigate('/delivery-info')
  };

  const goToCartPage = () => {
    navigate("/cart");
  };

  const goToQRCodePage = () => {
    navigate("/qr-codes");
  };

  return (
    <Box sx={{ paddingY: 10 }}>      
      <Container>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Payment Method
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <div className="container preload">
              <div className={`creditcard ${ flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                <div className="front">
                  <div id="ccsingle"></div>
                  <FrontSvg paymentInfo={paymentInfo}/>
                </div>
                <div className="back">
                  <BackSvg paymentInfo={paymentInfo}/>
                </div>
              </div>
            </div>
          </Grid>          
          <Grid item xs={12} sx={{ marginY: 1 }}>
            <TextField
              id="payment-name"
              value={paymentInfo.name} 
              label="Name" 
              variant="outlined" 
              fullWidth 
              onChange={(event) => handleChange(event, 'name')}
              inputProps={{ maxLength: 20 }}
              error={errors.name !== ""}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginY: 1 }}>
            <NumberFormat
              id="payment-card-number"
              label="Card Number"
              format="#### #### #### ####"
              customInput={TextField}              
              type="text"
              value={paymentInfo.card_number}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(event, 'card_number')}
              fullWidth
              onClick={() => setFlipped(false)}
              error={errors.card_number !== ""}
              helperText={errors.card_number}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginY: 1 }}>
            <NumberFormat
              id="payment-expiration-date"
              label="Expiration (mm/yy)"
              format={cardExpiry}
              placeholder="MM/YY" 
              mask={['M', 'M', 'Y', 'Y']}
              customInput={TextField}              
              type="text"
              value={paymentInfo.expiration_date}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(event, 'expiration_date')}
              fullWidth
              onClick={() => setFlipped(false)}
              error={errors.expiration_date !== ""}
              helperText={errors.expiration_date}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginY: 1 }}>            
            <NumberFormat
              id="payment-security-code"
              label="Security Code"
              format="###"
              customInput={TextField}              
              type="text"
              value={paymentInfo.security_code}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(event, 'security_code')}
              fullWidth
              onClick={() => setFlipped(true)}
              error={errors.security_code !== ""}
              helperText={errors.security_code}
            />
          </Grid>          
        </Grid>
        <Box sx={{ marginY: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button onClick={() => goToCartPage()} variant="outlined" color="primary" sx={{ marginX: 1 }}>Cancel</Button>
          <Button onClick={() => goToQRCodePage()} variant="contained" color="primary" sx={{ marginX: 1 }} disabled={btnDisabled}>Collect</Button>
          <Button onClick={() => handleCompletePayment()} variant="contained" color="secondary" sx={{ marginX: 1 }} disabled={btnDisabled}>Delivery</Button>
        </Box> 
      </Container>
    </Box>
  );
};

export default PaymentPage;
