// useSearchParams ??  gets the query string
// console.log(location.pathname);
// setChangeDetails((prevState) => !prevState);
import { useEffect, useState, useContext } from 'react'
import CrmContext from '../crm context/CrmContext'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth' // only show if it's that agents listing
import { db } from '../firebase.config'
import { onSubmit } from '../crm context/CrmAction'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import ProfileControlButtons from './ProfileControlButtons'
import UpdateReportToData from './forms/UpdateReportToData'
function DisplayCustomerData({ setCustomer, customer }) {
  const { dispatch, changeDetails, nameAndPhoneNumber } = useContext(CrmContext)

  const location = useLocation()

  const [data, setData] = useState({
    name: '',
    phone: '',
    fullData: [],
  })

  const { name, phone, fullData } = data
  // console.log(fullData)

  const params = useParams()
  const navigate = useNavigate()
  const auth = getAuth()

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'customers', params.uid)

      const docSnap = await getDoc(docRef)
      dispatch({
        type: 'CHANGE_INFO',
        name: docSnap.data().name,
        phone: docSnap.data().phone,
      })

      if (docSnap.exists()) {
        setData((prevState) => ({
          ...prevState,
          name: docSnap.data().name,
          phone: docSnap.data().phone,
          fullData: docSnap.data(),
        }))
      }
    }

    fetchData()
  }, [navigate, params.uid])

  const onChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  try {
    changeDetails && onSubmit(params.uid, name, phone)
  } catch (error) {
    console.log(error)
  }

  if (!customer) {
    return <h1>Loading ... </h1>
  }

  return (
    <div>
      <div className="profile-card profile-page-card">
        <form>
          <input
            className={changeDetails ? 'profile-input' : 'profile-card-active'}
            type="text"
            id="name"
            onChange={onChange}
            value={name}
            disabled={!changeDetails}
          />
          <input
            className={changeDetails ? 'profile-input' : 'profile-card-active'}
            type="text"
            id="phone"
            onChange={onChange}
            value={phone}
            disabled={!changeDetails}
          />
        </form>
      </div>

      <div className="customer-details">
        <div className="customer-details-container">
          <p className="profile-extra-info">
            Cust ID <span>{data.fullData.custId} </span>{' '}
          </p>
          <p className="profile-extra-info">
            Email <span>{data.fullData.email} </span>
          </p>
          <p className="profile-extra-info">
            Date Of Signup <span>{data.fullData.dateOfSignUp} </span>
          </p>
          <p className="profile-extra-info">
            Sign Up Agent {/* was signUpAgent */}
            <span>
              {data.fullData.signUpagent ? data.fullData.signUpagent : 'System'}
            </span>
          </p>
          <p className="profile-extra-info">
            Company{/* was signUpAgent */}
            <span>{data.fullData.company}</span>
          </p>
          {/* prettier-ignore */}
          <p className="profile-extra-info profile-formatedAddress">
            Address
            <span>
              {data.fullData.signUpagent ? data.fullData.formattedAddress : 'System'}
            </span>
          </p>
          <p className="profile-extra-info">
            Postcode
            <span>ST5 1LT</span>
          </p>
          <p className="profile-extra-info">
            agent reports to
            <span>{data.fullData.reportsTo.name}</span>
          </p>
        </div>

        <UpdateReportToData />
        <ProfileControlButtons />
      </div>

      <div className="map-container">
        <MapContainer
          style={{
            height: '100%',
            width: '100%',
            borderRadius: '2em',
          }}
          center={[data.fullData.geoLocation.lat, data.fullData.geoLocation.lng]}
          zoom={14}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[data.fullData.geoLocation.lat, data.fullData.geoLocation.lng]}
          >
            <Popup>
              <div
                className="box"
                style={{
                  width: '100%',
                  fontSize: '20px',
                }}
              >
                Customers Address <br /> Easily customizable.
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

export default DisplayCustomerData
