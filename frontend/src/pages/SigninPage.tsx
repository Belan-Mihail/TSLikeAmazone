import { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import { useSigninMutation } from '../hooks/userHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function SigninPage() {
  
//   redirect user in home page after login
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

//   get email and password from input box
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

//   get user info from context
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

//   we use useSigninMutation Hook and distract returned data in object mutateAsync. then we rename it to signin
  const { mutateAsync: signin, isPending } = useSigninMutation()

//   handler when user click on login button
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
        // signin from useSigninMutation() => mutateAsync: signin. email and password from useState from input fields
      const data = await signin({
        email,
        password,
      })
    //   next step: we use dispatch with data (data it is that return useSigninMutation() with email and password)
      dispatch({ type: 'USER_SIGNIN', payload: data })
    //   then we add data to localyStorage
      localStorage.setItem('userInfo', JSON.stringify(data))
    //   use redirect to redirect user to the homepage
      navigate(redirect)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  useEffect(() => {
    // we check user login or not and if user login we use redirect from this page. userInfo we take from useContext
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button disabled={isPending} type="submit">
            Sign In
          </Button>
          {isPending && <LoadingBox />}
        </div>
        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  )
}