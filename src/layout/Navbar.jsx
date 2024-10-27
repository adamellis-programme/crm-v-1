import { useEffect, useState, useContext } from 'react'
import { ReactComponent as Profile } from '../icons/profile.svg'
import { ReactComponent as Logo } from '../icons/logo.svg'
import NavItem from './NavItem'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
function Navbar({ setToggleNav, toggleNav }) {
  const [userUid, setUserUid] = useState('')
  const [userObj, setUserObj] = useState({
    loggedInUser: '',
    loggedInUserId: '',
  })
  const navigate = useNavigate()
  const { loggedInUser, loggedInUserId } = userObj

  // console.log(window); *************************************************
  const auth = getAuth()
  const params = useParams()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // console.log(user)
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          // console.log(idTokenResult)
        })
        setUserUid(user.uid)
        setUserObj((prevState) => ({
          ...prevState,
          loggedInUser: user.displayName,
          loggedInUserId: user.uid,
        }))
      } else {
        setUserObj((prevState) => ({
          ...prevState,
          loggedInUser: '',
        }))
      }
    })
  }, []) /// if button does not changen then use auth here?

  // prettier-ignore
  const handleOutsideClick = (event) => {  
  const isDropdownOpen = toggleNav;
  const clickedElement = event.target;
  const isDropdownElement = clickedElement.closest('.dropdown') || clickedElement.closest('.nav-caret-container');
  // const isDropdownLink = clickedElement.closest('.dropdown-text');

  if (isDropdownOpen && !isDropdownElement) {
    setToggleNav(false);
  }
};
  // prettier-ignore-end

  useEffect(() => {
    if (toggleNav) {
      document.addEventListener('click', handleOutsideClick)
    } else {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [toggleNav])

  const navButtons = [
    { id: 1, text: 'home', url: '/' },
    { id: 2, text: 'my data', url: `/data/${userUid}` },
    { id: 3, text: 'team data', url: `/all-data/${userUid}` },
    { id: 7, text: 'stats', url: `/stats/${userUid}` }, // insert user id to grab specific stats and have options to see all stats
  ]

  const handleSignOut = (e) => {
    // console.log('click')
    setToggleNav(false)
    navigate('/')
    auth.signOut()
  }
  // prettier-ignore
  return (
    <nav className="nav-bar">
      <div className="nav-bar-container">

        <div className="logo-box testing">
          <Logo className='logo' />
        </div>
        <ul className="nav-ul">
          <NavItem setToggleNav={setToggleNav} toggleNav={toggleNav} />
        </ul>
      </div>
      {toggleNav && (
        <div className="dropdown">
          <div className="profile-info">
            <Profile style={{ width: '60px', height: '60px' }} />
         <div className="nav-header">
         <span className="nav-name-span">{loggedInUser}</span>
            <span onClick={handleSignOut} className="nav-sign-out">sign out</span>
         </div>
          </div>
          <ul className="toggle-nav-ul">
            {navButtons.map((item) => (
              <Link key={item.id} to={`${item.url}`} className="dropdown-text">
                {/* {console.log(item)} */}
                <li className="toggle-nav-list" onClick={()=> setToggleNav(false)} >{item.text.toUpperCase()} </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar
