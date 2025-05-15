import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Typography, Box, IconButton, Card, Dialog, DialogContent, DialogContentText, DialogActions, Button, Alert } from "@mui/material";
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';

import { IStock } from "../../types/StockTypes";

import { addProductToCart, removeAllProductFromCart, removeProductFromCart } from "../../redux/reducer/cartReducer";

interface IProps {
  stock: IStock | undefined
}

const UserStockItem = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { stock } = props;

  const cartProducts = useAppSelector((state) => state.cart.list);
  const currentCartMerchant = useAppSelector((state) => state.cart.currentMerchant);

  const [currentProduct, setCurrentProduct] = useState<IStock>();
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);

  const handleAddProductToCart = async () => {
    if (currentCartMerchant !== stock?.merchantid && cartProducts.length >= 0) {
      await dispatch(removeAllProductFromCart({ product: [] }));
      await dispatch(addProductToCart({ product: stock }));
      setVisibleConfirmModal(false);
    }
  };

  const handleRemoveProductFromCart = () => {
    dispatch(removeProductFromCart({ product: stock }));
  };

  useEffect(() => {
    const cartProductIDs = cartProducts.map((product) => product.id);
    if (cartProductIDs.includes(stock?.id)) {
      setCurrentProduct(cartProducts.find((product) => product.id === stock?.id));
    } else {
      setCurrentProduct(stock);
    }
  }, [cartProducts, stock]);

  const handleConfirm = async () => {
    if (currentCartMerchant) {
      if (currentCartMerchant === stock?.merchantid) {
        await dispatch(addProductToCart({ product: stock }));
      } else {
        setVisibleConfirmModal(true)
      }
    }
    else {
      await dispatch(addProductToCart({ product: stock }));
    }
  }

  return (
    <Card
      sx={{ padding: 2, borderRadius: 7, boxShadow: 10 }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">
              {currentProduct?.name}
            </Typography>
            <Typography variant="body2">
              {currentProduct?.description}
            </Typography>
            {currentProduct?.quantity === 0 ? <p style={{ margin: '0px', color: "#ddd" }}>(Sold out)</p> : ""}
          </Box>
          <Box sx={{
            width: 130,
            marginLeft: 3
          }}>
            <img src={currentProduct?.image} alt="" width="100%" height="100px" style={{ objectFit: 'contain', borderRadius: 8 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">
              €{currentProduct?.price}              
            </Typography>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            {!!currentProduct?.carts_quantity && currentProduct?.carts_quantity > 0 && (
              <>
                <IconButton onClick={() => handleRemoveProductFromCart()}>
                  <RemoveCircleSharpIcon />
                </IconButton>
                <Typography variant="h6">
                  {currentProduct?.carts_quantity}
                </Typography>
              </>
            )}

            <IconButton disabled={currentProduct?.quantity === 0} onClick={() => { handleConfirm() }}>
              <AddCircleSharpIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>      
      {visibleConfirmModal && (
        <Dialog open={visibleConfirmModal} onClose={() => setVisibleConfirmModal(false)}>
          <DialogContent>
            <DialogContentText>
              <Alert severity="warning">Warning. Your current cart will be lost, and a new cart will be created.</Alert>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVisibleConfirmModal(false)} variant="outlined">Cancel</Button>
            <Button onClick={() => { handleAddProductToCart() }} variant="contained">Continue</Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default UserStockItem;
