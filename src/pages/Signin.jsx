import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import visibilityIcon from '../icons/svg/visibilityIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../icons/svg/keyboardArrowRightIcon.svg';
import { toast } from 'react-toastify';
// HOME PAGE LOGIN -- DESIGN TODAY  - LEAVE SPACE FOR THE SLIDER
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';
// component level state
function Signin() {
  const [showPassword, setshowPassword] = useState(false);
  const [formData, setformData] = useState({
    email: '',
    password: '',
  });



  const { password, email } = formData;
  // USE COMPONENT STATE FIRST THEN SWITCH IF NEEDED
  const navigate = useNavigate();

  const onChange = (e) => {
    // id has to be the same as what it is called in the formData function above
    // onChange is used globley
    setformData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // signInWithEmailAndPassword returns a promise and pluges into userCredentials
      const auth = getAuth();

      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        navigate('/profile');
      }
    } catch (error) {
      console.log(error);
      console.log('user not found')
      toast.error('Bad user credentials');
    }
  };

  return (
    <>
      <div className="page-container">
        <header>
          <p className="page-header">Welcome back</p>
        </header>

        <main>
          <form onSubmit={onSubmit} className="signup-form">
            <input
              className="email-input"
              type="email"
              id="email"
              placeholder="Emamil"
              value={email}
              onChange={onChange}
            />

            <div className="password-input-div">
              <input
                className="password-input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />

              <img
                src={visibilityIcon}
                alt="show password"
                onClick={() => setshowPassword((prevState) => !prevState)}
                className="show-password"
              />
            </div>

            <Link className="forgot-password" to="/forgot-password">
              Forgot Password
            </Link>
            {/* redirect in form  */}
            <div className="sign-in-bar">
              <p className="sign-in-text">Sign in</p>
              <button className="sign-in-button">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/sign-up" className="register-link">
            Sign Up Insted
          </Link>
        </main>
      </div>
    </>
  );
}

export default Signin;
