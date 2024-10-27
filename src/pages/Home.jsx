import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useContext } from 'react';
import CrmContext from '../crm context/CrmContext';
import EmailSignUpModal from '../components/EmailSignUpModal';

function Home() {
  const { dispatch } = useContext(CrmContext);
  const auth = getAuth();
  // install react toastify and make the join our mailing list form
  // make a file for testing the if nav btn !== ... || e.target !== xxx
  return (
    <div className="page-container-home">
      <EmailSignUpModal />
      <div className="grid-wrapper">
        {/* flex wrapper */}
        <div className="home-text-container">
          <div className="text-container">
            <h1 className="home-h1">
              <span className="home-text-sub-top">your trusty crm system</span>
              <span className="home-text-main"> easy data systems</span>
              <span className="home-text-sub">
                company data safe in the cloud
              </span>
              <span className="home-text-sub des-by">
                Designed by Adam Ellis
              </span>
              <div className="money-off-home">30%off</div>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
