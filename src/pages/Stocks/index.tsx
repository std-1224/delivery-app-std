import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Container, Typography, Grid, Box, ToggleButtonGroup,ToggleButton, Button } from "@mui/material";
import { List, GridView } from '@mui/icons-material';

// Import Components
import TableView from "./components/Table";
import StockForm from "./components/StockForm";
import StockCard from "../../components/Card/Stock";

// Import Types
import { IStock } from "../../types/StockTypes";

// Import Actions
import { getAllProducts } from "../../actions/productActions";

const StockListPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState("list");
  const [createStockModal, setCreateStockModal] = useState(false);

  const products = useAppSelector((state) => state.products.list).filter((item) => item.merchantid?.toString() === id);
  const userRole = useAppSelector((state) => state.auth.role);

  const handleCloseModal = () => {
    setCreateStockModal(false);
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <>
      <Box>
        <Container sx={{ marginY: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h3" sx={{ marginY: 5 }}>
              Our Store's Products
            </Typography>
            {userRole === "admin" && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button variant="contained" sx={{ marginRight: 2 }} onClick={() => setCreateStockModal(true)}>Create</Button>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(event, viewMode) => setViewMode(viewMode)}
                  aria-label="view mode"
                >
                  <ToggleButton value="tile" aria-label="tile view">
                    <List />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list view">
                    <GridView />
                  </ToggleButton>            
                </ToggleButtonGroup>
              </Box>
            )}   
          </Box>
          {viewMode === 'list' ? (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {products.map((stock: IStock) => (
                <Grid item xs={4} sm={4} md={4} key={stock.id}>
                  <StockCard stock={stock} />
                </Grid>
              ))}
            </Grid>            
          ) : (
            <TableView />
          )}        
        </Container>
      </Box>
      {createStockModal &&
        <StockForm
          open={createStockModal}
          mode="Create"
          closeModal={() => handleCloseModal()}
        />
      }
    </>
  );
};

export default StockListPage;
