import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Index from './components/Main/Index.jsx'
import AddCustomer from './components/Customer/AddCustomer.jsx'
import CustomerDetail from './components/Customer/CustomerDetail.jsx'
import Customers from './components/Customer/Customers.jsx'
import EditCustomer from './components/Customer/EditCustomer.jsx'
import AddEntry from './components/Entry/AddEntry.jsx'
import EditEntry from './components/Entry/EditEntry.jsx'
import Introduction from './components/Introduction/Introduction.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Forgot from './components/User/Forgot.jsx'
import Profile from './components/User/Profile.jsx'
import ResetPassword from './components/User/ResetPassword.jsx'
import VerifyOtpRegister from './components/VerifyOtp/VerifyOtpRegister.jsx'
import SplitRooms from './components/SplitRoom/SplitRooms'
import CreateSplitRoom from './components/SplitRoom/CreateSplitRoom'
import JoinSplitRoom from './components/SplitRoom/JoinSplitRoom'
import SplitRoomDetail from './components/SplitRoom/SplitRoomDetail'
import AddSplitExpense from './components/SplitRoom/AddSplitExpense'
import App from './App'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Index />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route path='forgot' element={<Forgot />} />
      <Route path='resetpassword' element={<ResetPassword />} />
      <Route path='verifyotpregister' element={<VerifyOtpRegister />} />
      <Route path='profile' element={<Profile />} />
      <Route path='introduction' element={<Introduction />} />
      <Route path='createcustomer' element={<AddCustomer />} /> 
      <Route path='updatecustomer/:customerId' element={<EditCustomer />} />
      <Route path='getcustomer/:customerId' element={<CustomerDetail />} />
      <Route path='getcustomers' element={<Customers />} />
      <Route path='/createentry/:customerId' element={<AddEntry />} />
      <Route path='/editentry/:entryId' element={<EditEntry />} />
      
      <Route path='splitrooms' element={<SplitRooms />} />
      <Route path='createsplitroom' element={<CreateSplitRoom />} />
      <Route path='joinsplitroom' element={<JoinSplitRoom />} />
      <Route path='splitroom/:roomId' element={<SplitRoomDetail />} />
      <Route path='addsplitexpense/:roomId' element={<AddSplitExpense />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router}/>
  // </StrictMode>,
)
