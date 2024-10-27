import { useContext } from 'react'
import CrmContext from '../crm context/CrmContext'
import { ReactComponent as WarningIcon } from '../icons/warning.svg'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'
import { doc, deleteDoc } from 'firebase/firestore'

function DeleteModal() {
  const params = useParams()

  const navigate = useNavigate()

  const { deleteBtn, dispatch } = useContext(CrmContext)
  const handleCloseModal = () => {
    dispatch({ type: 'DELETE_USER_TOGGLE', payload: false })
  }

  const handleDeleteClick = async (id) => {
    await deleteDoc(doc(db, 'customers', params.uid))
    await deleteDoc(doc(db, 'stats', params.uid))

    // todo --> delete profile pic from firebase
    dispatch({ type: 'DELETE_USER_TOGGLE', payload: false })
    navigate(`/data/${params.uid}`)
  }
  return (
    <div className={deleteBtn ? 'modal-container modal-active' : 'modal-container '}>
      <div className="modal-header">
        <WarningIcon width="34px" height="34px" className="warning-icon" />
        <p className="modal-header-text">Are You Sure You Want to Delete ...</p>
      </div>

      <div className="modal-body">
        <p>you are about to delete </p>
        <p>this can't be undone</p>
      </div>
      <div className="modal-footer">
        <button
          onClick={() => handleDeleteClick(params.uid)}
          className="modal-delete-btn"
        >
          delete
        </button>
        <button onClick={handleCloseModal} className="modal-delete-btn">
          close
        </button>
      </div>
    </div>
  )
}

export default DeleteModal
