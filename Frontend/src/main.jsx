import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Index from './components/Main/Index'
import AddCustomer from './components/Customer/AddCustomer'
import CustomerDetail from './components/Customer/CustomerDetail'
import Customers from './components/Customer/Customers'
import EditCustomer from './components/Customer/EditCustomer'
import AddEntry from './components/Entry/AddEntry'
import EditEntry from './components/Entry/EditEntry'
import Introduction from './components/Introduction/Introduction'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import DeleteUser from './components/User/DeleteUser'
import EditUser from './components/User/EditUser'
import Forgot from './components/User/Forgot'
import Profile from './components/User/Profile'
import ResetPassword from './components/User/ResetPassword'
import VerifyOtpForgot from './components/VerifyOtp/VerifyOtpForgot'
import VerifyOtpRegister from './components/VerifyOtp/VerifyOtpRegister'
import App from './App'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Index />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route path='forgot' element={<Forgot />} />
      <Route path='reset-password' element={<ResetPassword />} />
      <Route path='verify-otp-forgot' element={<VerifyOtpForgot />} />
      <Route path='verify-otp-register' element={<VerifyOtpRegister />} />
      <Route path='profile' element={<Profile />} />
      <Route path='edit-user' element={<EditUser />} />
      <Route path='delete-user' element={<DeleteUser />} />
      <Route path='introduction' element={<Introduction />} />
      <Route path='createcustomer' element={<AddCustomer />} /> 
      <Route path='updatecustomer/:customerId' element={<EditCustomer />} />
      <Route path='getcustomer/:customerId' element={<CustomerDetail />} />
      <Route path='getcustomers' element={<Customers />} />
      <Route path='/createentry/:customerId' element={<AddEntry />} />
      <Route path='/editentry/:entryId' element={<EditEntry />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
