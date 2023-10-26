import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Cart from "./Cart.js";
import { generateCartItemsFrom } from "./Cart.js";
import { getTotalCartValue } from "./Cart.js";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const isLoggedIn = localStorage.getItem("token"); // get token from loaclStorage of logged in user

  const [productsArrive, setProducts] = useState([]);

  const [loading, setLoading] = useState([false]);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setLoading(true);
    try {
      let url = `${config.endpoint}/products`;
      const resp = await axios.get(url);
      console.log("delhi", resp);

      const listOfProducts = resp.data;
      setProducts(listOfProducts);
      setLoading(false);
      return listOfProducts;
    } catch (err) {
      enqueueSnackbar("Error fetching products. Please try again later.", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    console.log(text);
    try {
      const url = `${config.endpoint}/products/search?value=${text}`;

      // if (text !== "") {
      // url = `${config.endpoint}/products/search?value=${text}`;
      // }

      const resp = await axios.get(url);
      console.log(resp);

      const listOfProducts = resp.data;
      setProducts(listOfProducts);
    } catch (err) {
      // 404 means no products found

      setProducts([]); // no products found
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  // const debounceTimeout = 2000;

  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }

    const newTimerId = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);

    setDebounceTimeout(newTimerId);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) {
      return;
    }

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

      const url = `${config.endpoint}/cart`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const resp = await axios.get(url, { headers });
      console.log("fetch Cart", resp);
      const updatedCartItems = generateCartItemsFrom(resp.data, productsArrive);
      setCartItems(updatedCartItems);

      return resp.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiCall = await performAPICall(); // [list of products]  productsArrive = [list of Prod ]
        console.log("Products list here", apiCall);
        const cartData = await fetchCart(isLoggedIn); //
        console.log("Cart data:", cartData);
        const cartItemsData = await generateCartItemsFrom(cartData, apiCall);
        console.log("Generated cart items:", cartItems);
        setCartItems(cartItemsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    console.log(
      "Check Items array with products present in Cart or not",
      items
    );

    const foundItem = items.find((itemElement) => {
      return itemElement.productId === productId;
    });

    return foundItem !== undefined; // If Found item is defined, it means the item is in the cart
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    // 1st check user logged in or not to add items in cart
    if (!isLoggedIn) {
      // show a warning message for users not logged in
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in Cart. Use the Cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }

    // if that product is not present then call the API and post the request to cart
    try {
      const payload = { productId: productId, qty: qty };
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // console.log("asdnakl");

      const resp = await axios.post(`${config.endpoint}/cart`, payload, {
        headers,
      });

      console.log("add to cart post response", resp);

      const updatedCartItems = generateCartItemsFrom(resp.data, products);
      console.log("These are updated Cart Items", updatedCartItems);
      setCartItems(updatedCartItems);
    } catch (error) {
      enqueueSnackbar("Error adding item to Cart. Please try again later.", {
        variant: "error",
      });
    }

    // localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };
  // const products = {
  //     name: "Tan Leatherette Weekender Duffle",
  //     category: "Fashion",
  //     cost: 150,
  //     rating: 4,
  //     image: "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //     _id: "PmInA797xJhMIPti",
  //   };
  // Add more product objects here

  return (
    <div>
      <Header fullWidth>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

        <TextField
          sx={{ width: '30%' }}
          className="search-desktop"
          size="large"
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        fullWidth
        // size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        // variant="oulined"
        placeholder="Search for items/categories"
        name="search"
        // fullWidth
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />

      <Grid container rowSpacing={3} columnSpacing={{ xs: 1 }}>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {/* </Grid> */}
       <Grid container marginX="0.2rem" spacing={2}>  
        <Grid container item md xs rowSpacing={3} columnSpacing={1}>
          {loading ? (
              <Box
                sx={{ display: "flex" }}
                align="center"
                justifyContent="center"
              >
                <CircularProgress />
                <p>Loading products…</p>
              </Box>
          ) : 
          
          productsArrive.length ? productsArrive.map((productElement) => {
                    // const { name, category, cost, rating, image, _id } = productElement; //object destructuring
                    // { console.log("new york", name, category, image, cost) };
                    return (
                      // key should be present for each grid thats why we put key in grid tag

                      <Grid item xs={6} md={4} lg={3} marginY="1rem" paddingX="1rem" key={productElement._id}>
                        
                        <ProductCard
                          product={productElement}
                          handleAddToCart={() => {
                            addToCart(
                              isLoggedIn,
                              cartItems,
                              productsArrive,
                              productElement._id,
                              1,
                              { preventDuplicate: true }
                            )
                          }}
                        />
                      </Grid>
                    )
                    // );
                  })
                
              
          : (
            // <Grid item xs={12} lg={12} md={12}>
              <div className="notFound">
                <SentimentDissatisfied />{" "}
                <p>
                  <b>No Products Found</b>
                </p>
              </div>
            // </Grid>
          )}

          {/* </Grid> */}
        </Grid>
        {isLoggedIn ? (
          <Grid item marginX="0.01rem" marginRight="1rem" marginY="1rem" className="cartComp" xs={12} md={3} lg={3}>
            <div className="cartBackground">
              <Cart
                products={productsArrive}
                items={cartItems}
                handleQuantity={addToCart}
              />
            </div>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
      <Footer />
    </div>
  )
}

export default Products;
