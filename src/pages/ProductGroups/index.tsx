import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { Container, Typography, Box, Button } from "@mui/material";

// Import Components
import ProductGroupForm from "./components/ProductGroupForm";
import TableView from "./components/Table";

const ProductGroups = () => {
  const { id } = useParams();
  const [visibleForm, setVisibleForm] = useState(false);

  const userId = useAppSelector((state) => state.auth.user_id);
  const userRole = useAppSelector((state) => state.auth.role);

  const handleCloseFormModal = () => {
    setVisibleForm(false);
  };

  return (
    <>
      <Box sx={{ paddingY: 8 }}>
        <Container>          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h3" sx={{ marginY: 5 }} className="productgroup-title">
              Product Groups
            </Typography>
            {((userRole === "merchant" && id === userId) || userRole === "admin") && (        
              <Button variant="contained" sx={{ marginRight: 2 }} onClick={() => setVisibleForm(true)}>Create</Button>
            )}
          </Box>
          <Box>
            <TableView />
          </Box>
        </Container>
      </Box>
      {visibleForm && (
        <ProductGroupForm
          open={visibleForm}
          mode="Create"
          closeModal={() => handleCloseFormModal()}          
        />
      )}
    </>
  );
};

export default ProductGroups;
