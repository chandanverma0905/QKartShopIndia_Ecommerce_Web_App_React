import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */

//  This function essentially takes the user's cart data, matches it with the product data, and returns an array of complete cart items. Each cart item contains all the information needed to display it in the cart view on your e-commerce website.
export const generateCartItemsFrom = (cartData, productsData) => {
  console.log("Input CartData", cartData);
  console.log("Input productsData", productsData);

  // cartData represents the data of products in the user's cart
  // productsData represents the data of all available products

  //  we initialize an empty array cartItems. This array will store the complete cart items that we generate from the input data.
  const cartItems = []; // create an array to store complete cart items

  // Iterate through the cart data
  for (const cartItem of cartData) { // productData [product,product,..],,,,,  cartData[cartItem,cartItem,...]
    const matchingProduct = productsData.find((product) => {
      return product._id === cartItem.productId; // use return always when using curly braces in Array.find(()=>{})
    });

    if (matchingProduct) {
      const cartItemData = {
        name: matchingProduct.name,
        qty: cartItem.qty,
        category: matchingProduct.category,
        cost: matchingProduct.cost,
        rating: matchingProduct.rating,
        image: matchingProduct.image,
        productId: matchingProduct._id,
      };

      cartItems.push(cartItemData);
    }
  }

  console.log("Output cartItems", cartItems);

  return cartItems;
};

// calling generateCartItemsFrom function by taking test values for cartData and productsData
// const cartData = [
//   { productId: '1', qty: 2 },
//   { productId: '2', qty: 3 },
// ];

// const productsData = [
//   { _id: '1', name: 'Product A', category: 'Category A', cost: 10, rating: 4 },
//   { _id: '2', name: 'Product B', category: 'Category B', cost: 20, rating: 5 },
//   { _id: '3', name: 'Product C', category: 'Category A', cost: 15, rating: 3 },
// ];
// const cartItems = generateCartItemsFrom(cartData, productsData);
// console.log("generated Cart Items", cartItems);

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  // Use the reduce method to sum the cost of all items
  return items.reduce((total, item) => {
    return (total + (item.cost * item.qty));
  }, 0)
};
  

//function for calculating total number of items 
const getTotalItems = (items=[])=>{
    return items.reduce((total, item)=>{
      return(total + item.qty)
    }, 0)
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
 const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  
 
  return (

    <div>
      
       {isReadOnly ?
       (
        <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
       </Box>
       </Stack>
       )
      :(
        <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
      {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
      </Stack>
      )}
    </div>
  );
}

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useHistory();
  const isLoggedIn = localStorage.getItem("token");
  console.log("cart items here", items);

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items.map((item) => {
          // Display each cart item
          console.log(item);

          return (
            <Box
              key={item.productId}
              display="flex"
              alignItems="flex-start"
              padding="1rem"
            >
              <Box className="image-container">
                <img
                  src={item.image} // Add product image
                  alt={item.name} // Add product name as alt text
                  width="100%"
                  height="100%"
                />
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{item.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >

                 {isReadOnly ? (
                   <ItemQuantity value={item.qty} isReadOnly={true} />   
                 ):
                 ( <ItemQuantity
                    value={item.qty}
                    handleAdd={() =>
                      handleQuantity(
                        isLoggedIn,
                        items,
                        products,
                        item.productId,
                        item.qty + 1
                      )
                    }
                    handleDelete={() =>
                      handleQuantity(
                        isLoggedIn,
                        items,
                        products,
                        item.productId,
                        item.qty - 1
                      )
                    }
                  />)}

                  <Box padding="0.5rem" fontWeight="700">
                    ${item.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center" fontWeight="600" fontSize="1.3rem">
            Order Total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          
          {
           isReadOnly ? (null) // Don't display checkout button on Checkout page
           :
          (<Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => {
              history.push("/checkout");
            }}
        >
            Checkout
          </Button>)
         }
        </Box>

      </Box>



     {/* //display Order Details for checkout page  */}
      

      {isReadOnly ? 
      (<Box className="orderDetails" marginTop="1rem" paddingTop="2rem">
        
            <Box className="detailsHeading" color="#3C3C3C" fontWeight="600" fontSize="1.4rem" alignSelf="center" marginX="1.5rem" marginBottom="2rem" >
                Order Details
            </Box>

            <Box className="" display="flex" justifyContent="space-between" alignItems="center" >        
         
                <Box alignSelf="center" marginX="1.5rem" >
                  <Box marginBottom="1rem">Products</Box>
                  <Box marginBottom="1rem">Subtotal</Box>
                  <Box marginBottom="2rem">Shipping Charges</Box>
                  <Box marginBottom="2rem" color="#3C3C3C" fontWeight="600" fontSize="1.3rem">Total</Box>
                </Box>
            
                <Box alignSelf="center" marginRight="2rem" >
                  <Box marginBottom="1rem">{getTotalItems(items)}</Box>
                  <Box marginBottom="1rem">${getTotalCartValue(items)} </Box>
                  <Box marginBottom="2rem">$0</Box>
                  <Box marginBottom="2rem" color="#3C3C3C" fontWeight="600" fontSize="1.3rem">${getTotalCartValue(items)}</Box>
                </Box>
            </Box>
         
      </Box>): (null)}
    </>


  );
};

export default Cart;
