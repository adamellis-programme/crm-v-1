import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// to update the database
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../icons/svg/googleIcon.svg';

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  //   sign in with pop up returns a respose
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // rtns a user


      // check if user exists, if not then add it

      // 1 get ref to the documet
      // 2 above we fet the user from the google sign in
      // 3 then passing the id in to check if we have a refrence to that document

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // checking to see if the doument exists = see if user exists
      // data goes in as a third paramiter

      const custID = `${user.displayName.toUpperCase().slice(0, 4)}-${crypto
        .randomUUID()
        .toUpperCase()
        .slice(0, 4)}`;

      // if user doesnot exist then create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          custID,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('Could not authorize with google');
    }
  };

  return (
    <div className="social-login">
      sign {location.pathname === '/sign-up' ? 'up' : 'in'}
      with
      <button className="social-icon" onClick={onGoogleClick}>
        <img className="social-icon-img" src={googleIcon} alt="google" />
      </button>
    </div>
  );
}

export default OAuth;
