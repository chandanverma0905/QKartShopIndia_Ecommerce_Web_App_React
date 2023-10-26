import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {

  // const token= localStorage.getItem("token");
 
  
  return (
    <Card className="card" sx={{ maxWidth: 345 }}>
        <CardMedia
        sx={{ height: 140 }}
        image= {product.image}
        title= {product.name}
        component="img"
        />

      <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          {product.name}
          </Typography>
          <Typography variant="h5" level="h2" gutterBottom>
          ${product.cost}
          </Typography>
          <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>

      <CardActions>
      <Button variant="contained" onClick={handleAddToCart}>
            <AddShoppingCartOutlined/> ADD TO CART
      </Button>
      </CardActions>
      
    </Card>
  );
};

export default ProductCard;
