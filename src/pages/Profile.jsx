import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import CrmContext from '../crm context/CrmContext'
import {
  getEmailsToDisplayInAgentProfile,
  getOrdersToDisplayInAgentProfile,
  getNotesToDisplayInAgentProfile,
  getAllCustomersForProfilePageCompanyStats,
  calculateCompanyTotals,
} from '../crm context/CrmAction'
import AgentToDoList from '../components/AgentToDoList'
import DashboardHeader from '../components/DashboardHeader'
import DisplayCompanySumUp from '../components/DisplayCompanySumUp'

function Profile() {
  const [show, setShow] = useState(false)
  const { dispatch } = useContext(CrmContext)
  window.addEventListener('beforeunload', () => {
    console.log('User clicked back button')
  })

  const auth = getAuth()
  const params = useParams()
  // console.log(params);

  let test
  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // console.log('logged in');
          setAgentId(user.uid)
        }
      },
      []
    )

    const getEmails = async () => {
      try {
        const data = await getEmailsToDisplayInAgentProfile('emails', params.uid)
        setEmails(data)
      } catch (error) {
        console.log(error)
      }
    }

    const getOrders = async () => {
      try {
        const data = await getOrdersToDisplayInAgentProfile('orders', params.uid)
        setOrders(data)
      } catch (error) {
        console.log(error)
      }
    }

    const getNotes = async () => {
      try {
        const data = await getNotesToDisplayInAgentProfile('notes', params.uid)

        setNotes(data)
      } catch (error) {
        console.log(error)
      }
    }

    getNotes()
    getOrders()
    getEmails()
  }, [])
  const [changeDetails, setChangeDetails] = useState(false)
  const [emails, setEmails] = useState(null)
  const [orders, setOrders] = useState(null)
  const [notes, setNotes] = useState(null)
  const [agentId, setAgentId] = useState('')
  // console.log(emails);
  // console.log(auth.currentUser.displayName);
  // console.log(agentId);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate('/')
  const onLogout = () => {
    auth.signOut()
    dispatch({ type: 'LOGGED_IN_USER_NAME', payload: '' })
    navigate('/')
  }

  // in (  )
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  // console.log(auth.currentUser.displayName);
  // console.log(name);
  const onSubmit = async () => {
    //  updating the details
    try {
      // if the name has not been touched do nothing
      if (auth.currentUser.displayName !== name) {
        // update dispName in firebase
        // takes in a object of what we want to update
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
      }

      // update in fireStore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name,
      })
    } catch (error) {
      toast.error('Could not be updated ')
    }
  }

  return (
    <div className="page-container">
      <DashboardHeader />
      {/* <header className="profile-header">
        <p className="header">Profile Page</p>
        <button type="button" className="logout" onClick={onLogout}>
          Logout
        </button>
        <Link to="/dashboard">
          <button>Dashoard</button>
        </Link>
      </header> */}

      <main>
        <div className="profile-grid grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 ">
          <div className="profile-agent-details">
          <div className="profile-detais-header">
          <button
            className="change-personal-details"
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? 'done' : 'edit details'}
          </button>
        </div>
            <div className="profile-card-container">
              <div className="profile-card">
                <form>
                  <input
                    type="text"
                    id="name"
                    className={!changeDetails ? 'profile-name' : 'profile-name-active'}
                    disabled={!changeDetails}
                    value={name}
                    onChange={onChange}
                  />
                  <input
                    type="text"
                    id="email"
                    className={!changeDetails ? 'profile-email' : 'profile-email-active'}
                    disabled={!changeDetails}
                    value={email}
                    onChange={onChange}
                  />
                </form>
              </div>
            </div>
            {emails && emails.length > 0 ? (
              <>
                <p className="profile-top-five-header profile-emails">
                  most recent 5 emails
                </p>
                <div className="most-recent-heading">
                  {' '}
                  <span className="most-recent-text">Name</span>
                  <span className="most-recent-text">Email</span>
                  <span className="most-recent-text">Date</span>
                </div>
              </>
            ) : (
              <div className="profile-no-data-container">
                <p>no emails to show yet</p>
              </div>
            )}
            <ul className="most-recent-customers">
              {emails &&
                emails.map(({ id, data }) => (
                  <li key={id} className="most-recent-customers-items">
                    <span className="most-recent-email-info">{data.customerName}</span>
                    <span className="most-recent-email-info">{data.emailBody}</span>
                    <span className="most-recent-email-info">{data.dateSent}</span>
                  </li>
                ))}
            </ul>

            {orders && orders.length > 0 ? (
              <>
                <p className="profile-top-five-header profile-sales">
                  most recent 5 Sales
                </p>
                <div className="most-recent-heading">
                  {' '}
                  <span className="most-recent-text">Item</span>
                  <span className="most-recent-text">Price</span>
                  <span className="most-recent-text">For</span>
                  <span className="most-recent-text">Email</span>
                  <span className="most-recent-text">Date</span>
                </div>
              </>
            ) : (
              <div className="profile-no-data-container">
                <p>no sales to show yet</p>
              </div>
            )}
            <ul className="most-recent-customers">
              {orders &&
                orders.map(({ id, data }) => (
                  <li key={id} className="most-recent-customers-items">
                    <span className="most-recent-email-info">{data.item}</span>
                    <span className="most-recent-email-info">{data.price}</span>
                    <span className="most-recent-email-info">{data.customerName}</span>
                    <span className="most-recent-email-info">{data.customerEmail}</span>

                    <span className="most-recent-email-info">{data.dateOfOrder}</span>
                  </li>
                ))}
            </ul>
            {/* todo back params kyle */}

            {notes && notes.length > 0 ? (
              <>
                <p className="profile-top-five-header profile-notes">
                  most recent 5 Notes
                </p>
                <div className="most-recent-heading">
                  <span className="most-recent-text">customer</span>
                  <span className="most-recent-text">email</span>
                  <span className="most-recent-text">note</span>
                  <span className="most-recent-text">Email</span>
                  <span className="most-recent-text">Date</span>
                </div>
              </>
            ) : (
              <div className="profile-no-data-container">
                <p>no notes to show yet</p>
              </div>
            )}

            <ul className="most-recent-customers">
              {notes &&
                notes.map(({ id, data }) => (
                  <li key={id} className="most-recent-customers-items">
                    <span className="most-recent-email-info">{data.customerName}</span>
                    <span className="most-recent-email-info">{data.customerEmail}</span>
                    <span className="most-recent-email-info">{data.noteText}</span>
                    <span className="most-recent-email-info">{data.dateOfNote}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="profile-dash">
            <p className="profile-btn-container">
              <Link
                className="profile-btns"
                to={`/new-customer?agentName=${auth.currentUser.displayName}&agentId=${auth.currentUser.uid}`}
              >
                NEW CUSTOMER
              </Link>
              <Link className="profile-btns" to={`/stats/${params.uid}`}>
                COMPANY STATS
              </Link>
              <Link className="profile-btns" to={`/data/${agentId}`}>
                VIEW ALL CUSTOMERS
              </Link>
            </p>
            <div className="taskList">
              <AgentToDoList />
            </div>
          </div>
          <div className="agentStats-container">
            <div className="agent-stats-header-container">
              <p className="agent-stats-text">
                <span>Top 3 accounts stats at a glance</span>
              </p>
            </div>
            <DisplayCompanySumUp />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
