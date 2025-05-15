import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Card, CardContent, Avatar, Typography, useTheme } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import "./styles.css";

import { ICategory } from "../../types/CategoryTypes";
import { getAllCategories } from "../../actions/categoryActions";

interface IProps {
  selectedCategory: ICategory | undefined,
  handleSelectCategory: (category: ICategory | undefined) => void
};

const CategorySlides = (props: IProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { selectedCategory, handleSelectCategory } = props;
  const [viewportRef] = useEmblaCarousel({
    dragFree: true,
    loop: true
  });

  const categories = useAppSelector((state) => state.categories.list);

  const showStoresForCategory = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, category: ICategory) => {
    localStorage.setItem("category", category.id);
    handleSelectCategory(category);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllCategories());
    };
  
    fetchData();
  }, [dispatch]);


  return (
    <div className="embla">
      <div className="embla__viewport" ref={viewportRef}>
        <div className="embla__container">        
          {categories.map((category: ICategory) => (
            <div className="embla__slide" key={category.id} onClick={(event) => showStoresForCategory(event, category)}>
              <div className="embla__slide__inner">
                <Card 
                  sx={{ 
                    boxShadow: 3,
                    backgroundColor: `${category.id === selectedCategory?.id ? theme.palette.secondary.dark : 'white' }`,
                    color: `${category.id === selectedCategory?.id ? '#fff' : '#000' }`,
                    borderRadius: 8
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar aria-label="recipe" sx={{ width: 70, height: 70, margin: '0 auto' }}>
                      <img src={category.image} alt="" />
                    </Avatar>
                    <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: 3, textTransform: 'capitalize' }}>
                      {category.name}
                    </Typography>                    
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySlides;
