import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { Grid, Box, Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Import Components
import UserStockItem from "../../../components/Card/UserStockItem";

// Import Types
import { IStock } from "../../../types/StockTypes";

// Import Actions
import { getProductGroupsByMerchantId } from "../../../actions/productActions";

const ProductsGridView = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const groups = useAppSelector((state) => state.products.productGroups);
  const userRole = useAppSelector((state) => state.auth.role);
  const userId = useAppSelector((state) => state.auth.user_id);
  const [expanded, setExpanded] = useState<string | false>(groups[0]?.name);  

  useEffect(() => {
    dispatch(getProductGroupsByMerchantId(id));
  }, [dispatch, id]);

  const handleChangePanel =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const products = useAppSelector((state) => state.products.list).filter((item) => item.merchantid?.toString() === id);

  return (
    <Box sx={{ width: '100%' }}>
      {groups.map((group) => (
        <Accordion expanded={expanded === group.name} onChange={handleChangePanel(group.name)} sx={{ marginBottom: 2 }} key={group.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ flexShrink: 0 }}>
            {group.name}
            </Typography>                  
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 8, md: 12 }}>
              {((userRole === "merchant" && id === userId) || userRole === 'admin') ? (
                products.filter((stock) => stock.prod_group === group.id).map((stock: IStock) => (
                  <Grid item xs={12} sm={4} md={4} key={stock.id}>
                    <UserStockItem stock={stock} />
                  </Grid>
                ))
              ) : (                
                products.filter((stock) => stock.prod_group === group.id).filter((stock) => stock.published).map((stock: IStock) => (
                  <Grid item xs={12} sm={4} md={4} key={stock.id}>
                    <UserStockItem stock={stock} />
                  </Grid>
                ))
              )}              
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>    
  );
};

export default ProductsGridView;
