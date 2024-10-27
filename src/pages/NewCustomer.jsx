import { useState, useEffect } from 'react'
import { useAuthStatusTwo } from '../hooks/useAuthStatusTwo'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Navigate, useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { db } from '../firebase.config'
import NewSignupForm from '../components/forms/NewSignupForm'

function NewCustomer() {
  const [searchParams, setSetSearchParams] = useSearchParams()
  console.log(searchParams.get('agentName'))
  const { loggedIn, checkingStatus, claims } = useAuthStatusTwo()
  console.log(claims)
  const auth = getAuth()
  // no params but search params
  const params = useParams()
  const navigate = useNavigate()

  // console.log(auth.currentUser.displayName);

  const onMutate = (e) => {}

  if (checkingStatus) {
    return <h1>Loading...</h1>
  }

  if (!loggedIn) {
    return <Navigate to="/sign-in" />
  }
  return (
    <div className=" new-sign-up-container">
      <p className="signup-head-p">sign up a new customer</p>
      <div className="new-sign-up-page-container">
        <div className="new-sign-up-div"></div>
        <div className="new-sign-up-div">
          <NewSignupForm />
        </div>
        <div className="new-sign-up-div"></div>
      </div>
    </div>
  )
}

export default NewCustomer
