import { createContext, useReducer } from 'react'
import { CrmReducer } from './CrmReducer'

const CrmContext = createContext()

// fills the arrays up
// why is one null and one an array
export const CrmDataContextProvider = ({ children }) => {
  const initialState = {
    deleteBtn: false,
    totalAmountSpent: 0,
    custOrders: null,
    editPurchase: false,
    editNote: false,
    toggleEmail: false,
    ordersData: null,
    notesData: null,
    ordersLength: 0,
    notesLength: 0,
    changeDetails: false,
    submitDetails: false,
    navLoginLogoutControl: true,
    sendMessageModal: false,
    readMessageModal: false,
    messageCounter: 0,
    showPasswordResetModal: false,
    customerStats: null,

    nameAndPhoneNumber: {
      name: '',
      phome: '',
    },
  }

  const [state, dispatch] = useReducer(CrmReducer, initialState)

  return (
    <CrmContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </CrmContext.Provider>
  )
}

export default CrmContext
