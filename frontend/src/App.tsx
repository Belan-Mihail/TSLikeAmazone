

import { Link, Outlet } from 'react-router-dom'
import { Badge, Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useContext, useEffect } from 'react'
import { Store } from './Store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LinkContainer } from 'react-router-bootstrap'


function App() {
  const {state: {mode, cart, userInfo }, dispatch} = useContext(Store)

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const switchModeHandler = () => {
    
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signoutHandler = () => {
    // call dispatch with type USER_SIGNOUT
    dispatch({ type: 'USER_SIGNOUT' })
    // remove all data from localStorage
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    // redirect user to ...
    window.location.href = '/signin'
  }

  return (
    <div className='d-flex flex-column vh-100'>
      <ToastContainer position='bottom-center' limit={1} />
      <header>
        <Navbar expand="lg">
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>tsamazona</Navbar.Brand>
            </LinkContainer>
            
          </Container>
          <Nav>
          <Button variant={mode} onClick={switchModeHandler}>
              <i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}></i>
            </Button>
            <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {/* summe all cart quyntity together */}
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            )}
          </Nav>
        </Navbar>
      </header>
      <main>
      <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer className='text-center'>All right reserved</footer>
    </div>
  )
}

export default App
