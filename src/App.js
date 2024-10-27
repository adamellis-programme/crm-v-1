import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './layout/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Profiler, useState } from 'react'
import Data from './pages/Data'
import Footer from './layout/Footer'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signout from './pages/Signout'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import Signup from './pages/Signup'
import Stats from './pages/Stats'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import NewCustomer from './pages/NewCustomer'
import SingleCustomer from './pages/SingleCustomer'
import { CrmDataContextProvider } from './crm context/CrmContext'
import AdminPage from './pages/admin/AdminPage'
import AgentSignIn from './pages/AgentSignIn'
import { useEffect } from 'react'
import DataAll from './pages/DataAll'

function App() {
  const [toggleNav, setToggleNav] = useState(false)
  return (
    <CrmDataContextProvider>
      <div className="main-wrap">
        <Router>
          <Navbar setToggleNav={setToggleNav} toggleNav={toggleNav} />
          <div className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/data/:uid" element={<Data />} />
              <Route path="/all-data/:uid" element={<DataAll />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/admin/:uid" element={<AdminPage />} />
              <Route path="/agent-sign-in" element={<AgentSignIn />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/sign-out" element={<Signout />} />
              <Route path="/stats/:uid" element={<Stats />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-customer" element={<NewCustomer />} />
              <Route
                path="/single-customer/:agentUid/:uid/:name"
                element={<SingleCustomer />}
              />

              <Route path="/profile/:uid" element={<PrivateRoute />}>
                <Route path="/profile/:uid" element={<Profile />} />
              </Route>

              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* todo not found page */}
            </Routes>
            {/* todo make sure all routes are proteced where needed */}
          </div>
        </Router>
        <Footer />
        <ToastContainer />
      </div>
    </CrmDataContextProvider>
  )
}

export default App
