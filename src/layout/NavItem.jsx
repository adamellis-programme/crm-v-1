import { ReactComponent as CaretIcon } from '../icons/caret.svg';
import CrmContext from '../crm context/CrmContext';
import { Link, NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ReactComponent as AddCustomer } from '../icons/add.svg';

function NavItem({ setToggleNav, toggleNav }) {
  const { navLoginLogoutControl, dispatch } = useContext(CrmContext);
  const [show, setShow] = useState(true);
  const [toggleLeftNav, setToggleLeftNav] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [userUid, setUserUid] = useState('');
  const [inits, setInits] = useState('');
  const auth = getAuth();
  let initials = '';
  // console.log(userUid);
  useEffect(() => {
    const agentInitials = agentName.split(' ');
    agentInitials.forEach((item) => {
      initials += item.slice(0, 1);
    });
    setInits(initials);
  }, [agentName]);

  const handleOutsideClick = (event) => {
    // event delegation
    if (
      !event.target.closest('.nav-button.nav-drop-wrap') && // actual button
      !event.target.closest('.nav-left') // dropdown-container
    ) {
      setToggleLeftNav(false);
    }
  };

  useEffect(() => {
    if (toggleLeftNav) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
  }, [toggleLeftNav]);

  const navigate = useNavigate();
  useEffect(() => {
    initials = true; //   ************************************************
    auth.onAuthStateChanged((user) => {
      if (user) {
        setAgentName(user.displayName);
        setUserUid(user.uid);

        dispatch({ type: 'TOGGLE_SIGN_IN_SIGN_OUT_BUTTON', payload: false });
        setShow(true);
      } else {
        dispatch({ type: 'TOGGLE_SIGN_IN_SIGN_OUT_BUTTON', payload: true });
        setShow(false);
      }
    });
  }, []);

  // 1- signed out method
  // 1- then checked for user and set to true for logoout
  const handleLogOut = (e) => {
    e.preventDefault();
    auth.signOut();
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: 'TOGGLE_SIGN_IN_SIGN_OUT_BUTTON', payload: true });
      } else {
        setShow(false);
      }
    });
    navigate('/');
  };
  const styles = {
    // this is the initial style the rotate is contrlooed by toggel nav in the ocntext
    transform: toggleNav && 'rotate(180deg)',
    fill: '#fff',
  };

  const handleToggleNav = (e) => {
    e.preventDefault();
    setToggleLeftNav((prevState) => !prevState);
  };

  const navLeftButtons = [
    { id: 1, text: 'Admin', url: `/admin/${userUid}`, paramText: 'admin' },
    { id: 2, text: 'Profile', url: `/profile/${userUid}` },
    {
      id: 3,
      text: 'New Customer',
      url: `/new-customer?agentName=${agentName}&agentId=${userUid}`,
    },
  ];

  // prettier-ignore
  const mainLogonLogoutButtons = [
    {
      id: 1,
      el:   <Link to={navLoginLogoutControl ?'/agent-sign-in' : '/'}> 
      <button className={ navLoginLogoutControl ?  "nav-button nav-button-agent-sign-in" : "none"}>Agent sign in</button>
      <button onClick={handleLogOut} className={ navLoginLogoutControl ?  "none" : "nav-button nav-button-agent-sign-out"}>Agent sign out</button>
      </Link>  ,
    }, 
  ];

  // document.addEventListener('click', (e) => {
  //   // path is the svg tagName
  //   if (e.target.closest('nav-button')) {
  //     console.log('path');
  //     // setToggleNav(false);
  //   }
  // });

  const buttons = [
    {
      id: 2,
      el: (
        <div className="testing-nav">
          <button
            onClick={handleToggleNav}
            className="nav-button nav-drop-wrap"
          >
            {' '}
            {inits}{' '}
          </button>
          {toggleLeftNav && (
            <div className="nav-left">
              <ul className="left-nav-ul">
                {navLeftButtons &&
                  navLeftButtons.map((item) => (
                    <Link key={item.id} to={item.url}>
                      <li className="left-nav-li">{item.text.toUpperCase()}</li>
                    </Link>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 3,
      el: (
        <button className="nav-button ">
          <Link to={`/new-customer?agentName=${agentName}&agentId=${userUid}`}>
            <AddCustomer fill="#fff" />
          </Link>
        </button>
      ),
    },
    {
      id: 4,
      el: (
        <button className="nav-button nav-caret-container">
          <CaretIcon className="caret" style={styles} />
        </button>
      ),
    },
  ];
  const handleCLick = (id) => {
    if (id === 4) {
      setToggleNav(!toggleNav);
    }
  };

  // prettier-ignore
  return (
    <>
      {mainLogonLogoutButtons &&
        mainLogonLogoutButtons.map((btn, index) => (
            <li key={btn.id} onClick={() => handleCLick(btn.id)}>
              {' '}
              {btn.el}{' '}
            </li>
        ))}

      { show &&  buttons.map((btn) => (
        <li className='nav-buttons-li-wrap' key={btn.id} onClick={() => handleCLick(btn.id)}>
          {' '}
          {btn.el}{' '}
        </li>
      ))}
    </>
  );
}

export default NavItem;
