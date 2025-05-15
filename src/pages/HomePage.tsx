import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Container, Typography, Grid, Box, Button } from "@mui/material";

// Import Components
import CategorySlides from "../components/Slides/CategorySlides";
import MerchantCard from "../components/Card/Merchant";

// Import Types
import { IMerchant } from "../types/MerchantTypes";
import { ICategory } from "../types/CategoryTypes";

// Import Actions
import { getAllCategories } from "../actions/categoryActions";
import { getAllMerchants } from "../actions/merchantActions";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [selectedMerchants, setSelectedMerchants] = useState<IMerchant[]>([]);

  const merchants = useAppSelector((state) => state.merchants.list);
  const categories = useAppSelector((state) => state.categories.list);
  const userRole = useAppSelector((state) => state.auth.role);

  const handleSelectCategory = (category: ICategory | undefined) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if(selectedCategory) {

      setSelectedMerchants(merchants.filter((merchant) => merchant.category === selectedCategory?.id));
    } else {
      setSelectedMerchants(merchants);
    }
  }, [merchants, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllMerchants());
    };
  
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllCategories());
    };
  
    fetchData();
  }, [dispatch]);

  const goToCategoryPage = () => {
    navigate('/categories');
  };

  const goToMerchantPage = () => {
    navigate('/merchants');
  }

  return (
    <Container sx={{ paddingY: 8 }}>
      {categories.length > 0 && <CategorySlides selectedCategory={selectedCategory} handleSelectCategory={handleSelectCategory}/>}      
      {categories.length === 0 && userRole === "admin" && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" gutterBottom component="div" sx={{ marginY: 5 }}>
            Please add the categories
          </Typography>
          <Button variant="contained" sx={{ marginRight: 2 }} onClick={() => goToCategoryPage()}>Create</Button>
        </Box>        
      )}
      <Typography variant="h3" gutterBottom component="div" sx={{ marginY: 5 }}>
        All Stores
      </Typography>
      {selectedMerchants.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" gutterBottom component="div" sx={{ marginY: 5 }}>
            There is no merchants.
          </Typography>
          {userRole === "admin" && (
            <Button variant="contained" sx={{ marginRight: 2 }} onClick={() => goToMerchantPage()}>Create</Button>
          )}          
        </Box>        
      )}
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 8, md: 12 }}>        
        {selectedMerchants.map((merchant: IMerchant) => (
          <Grid item xs={6} sm={4} md={2} key={merchant.id}>
            <MerchantCard merchant={merchant} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
