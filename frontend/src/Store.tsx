/* eslint-disable no-case-declarations */
import React from "react";
import { Cart, CartItem } from "./types/Cart";
import { UserInfo } from "./types/UserInfo";

type AppState = {
  mode: string;
  cart: Cart;
  userInfo?: UserInfo
};

const initialState: AppState = {
  // we check localStorage. if userInfo exist we will be use it, other userInfo=null
  userInfo: localStorage.getItem("userInfo")
      ? 
        JSON.parse(localStorage.getItem("userInfo")!)
      : null,
  mode: localStorage.getItem("mode")
    ? localStorage.getItem("mode")!
    : window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? // JSON.parse used for created JS object from data in localstorage
        JSON.parse(localStorage.getItem("cartItems")!)
      : [],
    shippingAddress: localStorage.getItem("shippingAddress")
      ? // JSON.parse used for created JS object from data in localstorage
        JSON.parse(localStorage.getItem("shippingAddress")!)
      : {},

    // we dont use here JSON.parsw because data simple string
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")!
      : "Paypal",
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
  },
};

type Action =
  | { type: "SWITCH_MODE" }
  | { type: "CART_ADD_ITEM"; payload: CartItem }
  | { type: "CART_REMOVE_ITEM"; payload: CartItem }
  // payload: UserInfo data with type of userInfo to update userInfo as state 
  | { type: 'USER_SIGNIN'; payload: UserInfo }
  | { type: 'USER_SIGNOUT' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SWITCH_MODE":
      // prev state check. if prev.state === dark => light another (prev state was ligth) => dark
      return { ...state, mode: state.mode === "dark" ? "light" : "dark" };
    case "CART_ADD_ITEM":
      //add new item to cart
      const newItem = action.payload;
      //check if in cart already exist that item by comparing the ID of a new product and the products in the Cart
      const existItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      );
      //if it exist we add new quantity of products another way we add new Product as itself (55)
      const cartItems = existItem
        ? state.cart.cartItems.map((item: CartItem) =>
          // whan we found item with existItem._id we replace item with newItem (has new quantity) another we return item itself
            item._id === existItem._id ? newItem : item
          )
          // if newItem doesent exist in state.cart.cartItems we need to add it
        : [...state.cart.cartItems, newItem];

      //saving item in localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      //we dont update all values in cart (use fo this ...state.cart) only cartItems)
      return { ...state, cart: { ...state.cart, cartItems } }
      case 'CART_REMOVE_ITEM': {
        const cartItems = state.cart.cartItems.filter(
          (item: CartItem) => item._id !== action.payload._id
        )
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        return { ...state, cart: { ...state.cart, cartItems } }
      }
      case 'USER_SIGNIN':
        // if user is signin we need to update user info
      return { ...state, userInfo: action.payload }
      case 'USER_SIGNOUT':
        // we clear all data. because we dont put in return state userInfo it will be null
      return {
        mode:
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
        cart: {
          cartItems: [],
          paymentMethod: 'PayPal',
          shippingAddress: {
            fullName: '',
            address: '',
            postalCode: '',
            city: '',
            country: '',
          },
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      }
    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

// eslint-disable-next-line @typescript-eslint/ban-types
function StoreProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  );
  return <Store.Provider value={{ state, dispatch }} {...props} />;
}

export { Store, StoreProvider };
