import React from "react";
import QRCode from "react-qr-code";
import { Box, Container } from "@mui/material";

const QRCodePage = () => {
  return (
    <Container sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Box sx={{ backgroundColor: 'white', padding: '30px' }}>
        <QRCode value="hey" />
      </Box>
    </Container>    
  );
};

export default QRCodePage;
