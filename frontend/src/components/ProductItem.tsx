import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Product } from '../types/Product'
import Rating from './Rating'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { convertProductToCartItem } from '../utils'
import { toast } from 'react-toastify'

function ProductItem({ product }: { product: Product }) {
  const {state, dispatch} = useContext(Store)

  // take from state cart
  const {
    cart: {cartItems},
  } = state

  const addToCartHandler = (item: CartItem) => {
    // check exist this product in the cart or not
    const existItem = cartItems.find((x) => x._id === product._id)
    // if it exist we increase quantity by 1 another quantity will be 1
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      // expand all fields and update the quantity
      payload: { ...item, quantity },
    })
    toast.success('Product added to the cart')
  }


  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(convertProductToCartItem(product))}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default ProductItem