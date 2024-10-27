import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStatusOne = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  //   returns a user object
  //   only render if checking status is false

  useEffect(() => {
    const auth = getAuth()
    // console.log(auth)
    // auth retursn the user obj and user is the details
    onAuthStateChanged(auth, (user) => {
      // console.log(user)
      if (user) {
        setLoggedIn(true)
      }
      setCheckingStatus(false)
    })
  })

  // console.log(loggedIn);
  return { loggedIn, checkingStatus }
}
