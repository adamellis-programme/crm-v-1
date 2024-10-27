import { useState, useEffect } from 'react'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { collection, query, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import './admin.css'
import {
  addAgentToDbFromAdmin,
  getListOfAgentsForAdminPage,
  deleteAgent,
} from '../../crm context/CrmAction'
import { db } from '../../firebase.config'
import { doc, deleteDoc, writeBatch, getDocs, where } from 'firebase/firestore'
import Loader from '../../assets/Loader'
import AdminPageMModal from '../../modals/AdminPageMModal'
import { runTransaction } from 'firebase/firestore'
import Test from './Test'
function AdminPage() {
  const [managers, setManagers] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState(null)
  const [loadingStates, setLoadingStates] = useState({
    permissions: false,
    signUp: false,
    delete: false,
  })

  const [oldReportsTO, setOldReportsTO] = useState({})
  const [newReportsTo, setNewReportsTo] = useState({})

  const [deleteData, setDeleteData] = useState(null)
  const auth = getAuth()
  const [agentData, setAgentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAgentUsers = async () => {
      const data = await getListOfAgentsForAdminPage('users')
      setAgentData(data)
      setLoading(false)
    }
    getAgentUsers()
  }, [])

  const [permissions, setPermissions] = useState({
    adminEmail: '',
    admin: false,
    manager: false,
    ceo: false,
    sales: false,
    reportsTo: 'none chosen',
  })

  const [newAgent, setNewAgent] = useState(null)
  const [newAgentData, setNewAgentData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [deleteAgentData, setDeleteAgentData] = useState({
    agentEmailToDelete: '',
  })

  const { adminEmail, admin, manager, ceo, sales, reportsTo } = permissions
  const { name, email, password } = newAgentData
  const { agentEmailToDelete } = deleteAgentData

  const handleButtonLoading = (boolean, type) => {
    setLoadingStates((prevState) => ({
      ...prevState,
      [type]: boolean,
    }))
  }

  const changePermissions = async (e) => {
    e.preventDefault()
    handleButtonLoading(true, 'permissions')

    const callFirebaseFunction = async () => {
      const functions = getFunctions()
      const addAdminRole = httpsCallable(functions, 'addAdminRole')

      try {
        const result = await addAdminRole({
          email: adminEmail,
          admin,
          manager,
          ceo,
          sales,
          reportsTo,
        })

        if (result.data.status === 'ok') {
          setShowAlert(true)
          setAlertData(result)
          resetPermissionData()

          console.log(result.data.customClaims.reportsTo)

          const newReportsToData = {
            name: result.data.customClaims.reportsTo.name,
            id: result.data.customClaims.reportsTo.id,
          }

          // do not need this line as we have and object
          // within this funciton which only gets set once
          // setNewReportsTo(newReportsToData)

          // Wait for state update to complete before calling batchChanges
          batchChanges(newReportsToData)
        } else {
          console.log(result)
        }
      } catch (error) {
        console.log(`error: ${JSON.stringify(error)}`)
      } finally {
        handleButtonLoading(false, 'permissions')
      }
    }
    callFirebaseFunction()
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = false
    }
    if (e.target.value === 'false') {
      boolean = true
    }

    setPermissions((prevState) => ({
      ...prevState,
      [e.target.id]: boolean ?? e.target.value,
    }))
  }

  const onSignUpChange = (e) => {
    setNewAgentData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onAddNewAgent = async (e) => {
    e.preventDefault()
    handleButtonLoading(true, 'signUp')

    const agentId = `AG-${name.toUpperCase().slice(0, 4)}-${crypto
      .randomUUID()
      .toUpperCase()
      .slice(0, 4)}`

    const functions = getFunctions()

    try {
      const makeNewUser = httpsCallable(functions, 'makeNewUser')
      const userRecord = await makeNewUser({
        email,
        password,
        name,
      })

      // console.log(userRecord)
      setNewAgent(userRecord)

      const agentOrigUid = userRecord.data.data.uid
      console.log('Successfully created new user:', agentOrigUid)

      const newAgentObj = {
        name: userRecord.data.data.displayName,
        email: userRecord.data.data.email,
        agentUId: agentOrigUid,
        timestamp: serverTimestamp(),
        agentId,
        tasksLength: 0,
        msgLength: 0,
        salesTeamIds: [],
      }

      const data = await addAgentToDbFromAdmin('users', agentOrigUid, newAgentObj)
      console.log(data)

      const getUpdatedData = await getListOfAgentsForAdminPage('users')
      console.log(getUpdatedData)
      setAgentData(getUpdatedData)
      resetNewAgentData()
    } catch (error) {
      console.log('Error creating new user:', error)
    } finally {
      handleButtonLoading(false, 'signUp')
    }
  }

  const onChangeDelete = (e) => {
    setDeleteAgentData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const handleDeleteSubmit = (e) => {
    e.preventDefault()
    handleButtonLoading(true, 'delete')

    const functions = getFunctions()
    const deleteAgent = httpsCallable(functions, 'deleteAgent')

    deleteAgent({
      email: agentEmailToDelete,
    })
      .then((user) => {
        console.log(user.data.userData)
        setDeleteData(user.data.userData)
        deleteDoc(doc(db, 'users', user.data.userData.uid))
        const updatedDomData = agentData.filter(
          (item) => item.id !== user.data.userData.uid
        )
        setAgentData(updatedDomData)
        resetDeleteData()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        handleButtonLoading(false, 'delete')
      })
  }

  const resetPermissionData = () => {
    setPermissions({
      adminEmail: '',
      admin: false,
      manager: false,
      ceo: false,
      sales: false,
      reportsTo: 'none chosen',
    })
  }

  const resetNewAgentData = () => {
    setNewAgentData({
      name: '',
      email: '',
      password: '',
    })
  }

  const resetDeleteData = () => {
    setDeleteAgentData({
      agentEmailToDelete: '',
    })
  }

  useEffect(() => {
    const getData = async () => {
      const functions = getFunctions()
      const listAllUsers = httpsCallable(functions, 'listAllUsers')
      try {
        const result = await listAllUsers()
        const managers = []
        result.data.users.forEach((item) => {
          if (item.customClaims.manager === true) {
            managers.push(item)
          }
        })
        setManagers(managers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    getData()
  }, [])

  const handleSelectChange = (e) => {
    const value =
      e.target.value === 'none chosen' ? 'none chosen' : JSON.parse(e.target.value)
    setPermissions((prevState) => ({
      ...prevState,
      reportsTo: value,
    }))
  }

  const handlePopulate = async (e) => {
    e.preventDefault()
    const functions = getFunctions()
    const getUser = httpsCallable(functions, 'getUser')

    try {
      const res = await getUser({ email: adminEmail })
      const userClaims = res.data.customClaims
      console.log(userClaims)
      setPermissions((prevState) => ({
        ...prevState,
        admin: userClaims.admin || false,
        manager: userClaims.manager || false,
        ceo: userClaims.ceo || false,
        sales: userClaims.sales || false,
        reportsTo: userClaims.reportsTo ? userClaims.reportsTo : 'none chosen',
      }))

      // console.log()
      setOldReportsTO({
        id: userClaims.reportsTo.id,
        name: userClaims.reportsTo.name,
      })
    } catch (error) {
      console.log(error)
    }
  }
  console.log(oldReportsTO.id)
  console.log(newReportsTo.id)

  async function batchChanges(newReportsToData) {
    try {
      const newID = newReportsToData.id
      const newName = newReportsToData.name
      const oldID = oldReportsTO.id

      console.log(newID, oldID)

      const batch = writeBatch(db)
      const q = query(collection(db, 'customers'), where('reportsTo.id', '==', oldID))

      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((document) => {
        console.log(document.data())
        batch.update(document.ref, {
          'reportsTo.id': newID,
          'reportsTo.name': newName,
        })
      })

      await batch.commit()
      console.log('Batch update committed successfully')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {/* <Test /> */}
      {showAlert && <AdminPageMModal alertData={alertData} setShowAlert={setShowAlert} />}
      <div className="admin-grid">
        <div className="agent-sign-up agent-sign-up-left">
          <div className="agent-inner-div-text">
            <div className="sign-in-text-container">
              <h1 className="sign-in-h1-text">Admin Panel</h1>
            </div>
            <div className="sign-in-text-container">
              <ul className="sign-in-info">
                <li className="sign-in-list">Control agents' access privileges</li>
                <li className="sign-in-list">Change Permissions</li>
                <li className="sign-in-list">Add and Delete Users</li>
                <li className="sign-in-list">Keep Track of who is logging in</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="agent-sign-up agent-sign-up-right">
          <div className="admin-controls-text-container">
            <p>Your Admin Controls</p>
          </div>
          <div className="sign-in-form-container">
            <div className="admin-control-header">
              <p className="admin-control-text">Change Admin Permissions</p>
            </div>
            <form onSubmit={changePermissions} className="agent-sign-in-form">
              <input
                onChange={onMutate}
                className="sign-up-input"
                type="text"
                id="adminEmail"
                placeholder="Enter Email to change / add admin"
                value={adminEmail}
              />
              <div className="checkbox-container">
                <div className="checkbox-inner">
                  <label className="admin-label" htmlFor="admin">
                    Admin
                  </label>
                  <input
                    className="admin-check"
                    onChange={onMutate}
                    type="checkbox"
                    id="admin"
                    value={admin}
                    checked={admin}
                  />
                </div>
                <div className="checkbox-inner">
                  <label className="admin-label" htmlFor="manager">
                    Manager
                  </label>
                  <input
                    className="admin-check"
                    type="checkbox"
                    id="manager"
                    onChange={onMutate}
                    value={manager}
                    checked={manager}
                  />
                </div>
                <div className="checkbox-inner">
                  <label className="admin-label" htmlFor="ceo">
                    CEO
                  </label>
                  <input
                    className="admin-check"
                    type="checkbox"
                    id="ceo"
                    onChange={onMutate}
                    value={ceo}
                    checked={ceo}
                  />
                </div>
                <div className="checkbox-inner">
                  <label className="admin-label" htmlFor="sales">
                    Sales
                  </label>
                  <input
                    className="admin-check"
                    type="checkbox"
                    id="sales"
                    onChange={onMutate}
                    value={sales}
                    checked={sales}
                  />
                </div>
              </div>
              <div className="reports-to-div">
                <label className="reports-to-label" htmlFor="reportsTo">
                  Reports To
                </label>
                <select
                  onChange={handleSelectChange}
                  className="manager-select"
                  name=""
                  id="reportsTo"
                  value={JSON.stringify(reportsTo)}
                >
                  <option value="none chosen">Please select</option>
                  {managers &&
                    managers.map((item, i) => (
                      <option
                        key={i}
                        value={JSON.stringify({ name: item.displayName, id: item.uid })}
                      >
                        {item.displayName}
                      </option>
                    ))}
                </select>
              </div>
              <button onClick={handlePopulate} className="modify-agent-button">
                Populate
              </button>
              <button
                disabled={loadingStates.permissions}
                className={`modify-agent-button ${
                  loadingStates.permissions && 'button-loading'
                }`}
              >
                {loadingStates.permissions ? 'Wait...' : 'Add / Modify Roles'}
              </button>
            </form>
          </div>
          <div className="sign-in-form-container">
            <div className="admin-control-header">
              <p className="admin-control-text">Add New User</p>
            </div>
            <form onSubmit={onAddNewAgent} className="agent-sign-in-form">
              <input
                onChange={onSignUpChange}
                className="sign-up-input"
                type="text"
                id="name"
                placeholder="Enter Name"
                value={name}
              />
              <input
                onChange={onSignUpChange}
                className="sign-up-input"
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
              />
              <input
                onChange={onSignUpChange}
                className="sign-up-input"
                type="password"
                id="password"
                placeholder="Choose Password"
                value={password}
                autoComplete="true"
              />
              <button
                disabled={loadingStates.signUp}
                className={`sign-up-agent-button ${
                  loadingStates.signUp && 'button-loading'
                }`}
              >
                {loadingStates.signUp ? 'Loading...' : 'Sign Up New Agent'}
              </button>
            </form>
          </div>
          <div className="sign-in-form-container">
            <div className="admin-control-header">
              <p className="admin-control-text">Delete User</p>
            </div>
            <form onSubmit={handleDeleteSubmit} className="agent-sign-in-form">
              <input
                onChange={onChangeDelete}
                className="sign-up-input"
                type="text"
                id="agentEmailToDelete"
                placeholder="Enter Email of agent to delete"
                value={agentEmailToDelete}
              />
              <button
                disabled={loadingStates.delete}
                className={`modify-agent-button delete-agent ${
                  loadingStates.delete && 'button-loading'
                }`}
              >
                {loadingStates.delete ? 'Loading...' : 'Delete User'}
              </button>
            </form>
          </div>
        </div>
        <div className="agent-page-right">
          <div className="agent-page-right-header-container">
            <p>Active Agents</p>
          </div>
          <div className="user-list-container">
            <ul className="user-list-ul">
              {!loading &&
                agentData &&
                agentData.length > 0 &&
                agentData.map((item) => (
                  <li key={item.id} className="user-list-li">
                    <span className="user-list-info">{item.data.name}</span>
                    <span className="user-list-info">{item.data.email}</span>
                  </li>
                ))}
            </ul>
            {loading && <Loader />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
