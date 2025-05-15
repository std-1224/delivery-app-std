import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, Dialog, DialogContent, DialogContentText, DialogActions, Button, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IStock } from '../../types/StockTypes';
import OrderForm from "../../components/OrderForm";

interface IProps {
  stock: IStock | undefined
}

const StockCard = (props: IProps) => {
  const { stock } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleOrderFormModal, setVisibleOrderFormModal] = useState(false);
  return (
    <>
      <Card        
        onClick={() => setVisibleConfirmModal(true)}
        sx={{
          boxShadow: 3,
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(37, 34, 34, 0.87) 100%), url(${stock?.image})`,
          minHeight: 194,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          position: 'relative',
          color: 'white',
          cursor: 'pointer'
        }}
      >       
        <CardContent>
          <Box
            sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px', flexDirection: `${matches ? 'column' : 'row'}` }}
          >
            <Box 
              sx={{width: 56, height: 56, padding: '5px', borderRadius: '12px', background: 'white' }}
            >
              <img src={stock?.logo} alt="" style={{ width: "100%"}} />
            </Box>
            <Typography variant="h6" sx={{ marginLeft: '10px' }}>
              {stock?.name}
            </Typography>  
          </Box>          
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2, flexDirection: `${matches ? 'column' : 'row'}` }}
          >
            <Typography variant="h5">
              €{stock?.price}
            </Typography>
            <Typography variant="h6">
              Quantity: {stock?.quantity}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {visibleConfirmModal && (
        <Dialog open={visibleConfirmModal} onClose={() => setVisibleConfirmModal(false)}>          
          <DialogContent>
            <DialogContentText>
              Are you going to order this product?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVisibleConfirmModal(false)}>No</Button>
            <Button 
              onClick={() => {
                setVisibleConfirmModal(false);
                setVisibleOrderFormModal(true);
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {visibleOrderFormModal && (
        <OrderForm 
          open={visibleOrderFormModal}
          stock={stock}
          closeModal={() => setVisibleOrderFormModal(false)}
        />
      )}
    </>
  );
}

export default StockCard;
